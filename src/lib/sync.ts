import { supabase } from "./supabase";
import type { Estimate, Contract, Settings, CatalogItem } from "@/types";

type SyncStatus = "idle" | "syncing" | "synced" | "error";
type SyncListener = (status: SyncStatus) => void;

const listeners = new Set<SyncListener>();
let currentStatus: SyncStatus = "idle";

function setStatus(status: SyncStatus) {
  currentStatus = status;
  listeners.forEach((fn) => fn(status));
}

export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

export function onSyncStatusChange(listener: SyncListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// --- Debounced sync queue ---

let syncTimer: ReturnType<typeof setTimeout> | null = null;
const pendingOps = new Map<string, () => Promise<void>>();

export function queueSync(key: string, operation: () => Promise<void>): void {
  if (!supabase) return;
  pendingOps.set(key, operation);
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(flushSyncQueue, 3000);
}

export async function flushSyncQueue(): Promise<void> {
  if (!supabase || pendingOps.size === 0) return;

  const ops = Array.from(pendingOps.values());
  pendingOps.clear();
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }

  setStatus("syncing");
  try {
    await Promise.all(ops.map((op) => op()));
    setStatus("synced");
  } catch (err) {
    console.error("[sync] flush failed:", err);
    setStatus("error");
  }
}

// --- Online/offline listener ---

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    flushSyncQueue();
  });
}

// --- Cloud operations ---

async function getUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export async function syncEstimates(estimates: Estimate[]): Promise<void> {
  const userId = await getUserId();
  if (!supabase || !userId) return;

  for (const est of estimates) {
    const { error } = await supabase.from("estimates").upsert(
      {
        id: est.id,
        user_id: userId,
        estimate_number: est.estimateNumber,
        status: est.status,
        data: est,
        updated_at: est.updatedAt,
      },
      { onConflict: "id" }
    );
    if (error) console.error("[sync] estimate upsert failed:", error);
  }
}

export async function syncContracts(contracts: Contract[]): Promise<void> {
  const userId = await getUserId();
  if (!supabase || !userId) return;

  for (const contract of contracts) {
    const { error } = await supabase.from("contracts").upsert(
      {
        id: contract.id,
        user_id: userId,
        estimate_id: contract.estimateId || null,
        contract_number: contract.contractNumber,
        data: contract,
        updated_at: contract.updatedAt,
      },
      { onConflict: "id" }
    );
    if (error) console.error("[sync] contract upsert failed:", error);
  }
}

export async function syncSettings(settings: Settings): Promise<void> {
  const userId = await getUserId();
  if (!supabase || !userId) return;

  const { error } = await supabase.from("settings").upsert(
    {
      user_id: userId,
      data: settings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) console.error("[sync] settings upsert failed:", error);
}

export async function syncCatalog(
  type: "plant" | "service" | "material",
  items: CatalogItem[]
): Promise<void> {
  const userId = await getUserId();
  if (!supabase || !userId) return;

  const { error } = await supabase.from("catalogs").upsert(
    {
      user_id: userId,
      catalog_type: type,
      data: items,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,catalog_type" }
  );
  if (error) console.error("[sync] catalog upsert failed:", error);
}

export async function deleteEstimateFromCloud(id: string): Promise<void> {
  const userId = await getUserId();
  if (!supabase || !userId) return;

  const { error } = await supabase
    .from("estimates")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) console.error("[sync] estimate delete failed:", error);
}

export async function deleteContractFromCloud(id: string): Promise<void> {
  const userId = await getUserId();
  if (!supabase || !userId) return;

  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) console.error("[sync] contract delete failed:", error);
}

// --- Pull from cloud (initial sync on sign-in) ---

export async function pullFromCloud(): Promise<{
  estimates: Estimate[];
  contracts: Contract[];
  settings: Settings | null;
  catalogs: { plant: CatalogItem[]; service: CatalogItem[]; material: CatalogItem[] };
} | null> {
  const userId = await getUserId();
  if (!supabase || !userId) return null;

  setStatus("syncing");
  try {
    const [estRes, contractRes, settingsRes, catalogRes] = await Promise.all([
      supabase.from("estimates").select("data").eq("user_id", userId),
      supabase.from("contracts").select("data").eq("user_id", userId),
      supabase.from("settings").select("data").eq("user_id", userId).single(),
      supabase.from("catalogs").select("catalog_type, data").eq("user_id", userId),
    ]);

    const catalogs = { plant: [] as CatalogItem[], service: [] as CatalogItem[], material: [] as CatalogItem[] };
    if (catalogRes.data) {
      for (const row of catalogRes.data) {
        const type = row.catalog_type as "plant" | "service" | "material";
        catalogs[type] = row.data as CatalogItem[];
      }
    }

    setStatus("synced");
    return {
      estimates: (estRes.data ?? []).map((r) => r.data as Estimate),
      contracts: (contractRes.data ?? []).map((r) => r.data as Contract),
      settings: settingsRes.data ? (settingsRes.data.data as Settings) : null,
      catalogs,
    };
  } catch (err) {
    console.error("[sync] pull failed:", err);
    setStatus("error");
    return null;
  }
}

// --- Push all local data to cloud (first sign-in migration) ---

export async function pushAllToCloud(data: {
  estimates: Estimate[];
  contracts: Contract[];
  settings: Settings;
  catalogs: { plant: CatalogItem[]; service: CatalogItem[]; material: CatalogItem[] };
}): Promise<void> {
  setStatus("syncing");
  try {
    await Promise.all([
      syncEstimates(data.estimates),
      syncContracts(data.contracts),
      syncSettings(data.settings),
      syncCatalog("plant", data.catalogs.plant),
      syncCatalog("service", data.catalogs.service),
      syncCatalog("material", data.catalogs.material),
    ]);
    setStatus("synced");
  } catch (err) {
    console.error("[sync] push all failed:", err);
    setStatus("error");
  }
}
