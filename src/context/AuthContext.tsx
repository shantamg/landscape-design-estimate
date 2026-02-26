import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSession, onAuthStateChange, signInWithMagicLink, signOut } from "@/lib/auth";
import {
  pullFromCloud,
  pushAllToCloud,
  flushSyncQueue,
  getSyncStatus,
  onSyncStatusChange,
} from "@/lib/sync";
import {
  listEstimates,
  listContracts,
  loadSettings,
  loadCatalog,
  saveEstimate,
  saveContract,
  saveSettings as saveSettingsToStorage,
  saveCatalog,
} from "@/lib/storage";

type SyncStatus = "idle" | "syncing" | "synced" | "error";

interface AuthContextValue {
  user: User | null;
  isConfigured: boolean;
  isLoading: boolean;
  syncStatus: SyncStatus;
  sendMagicLink: (email: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());
  const configured = isSupabaseConfigured();

  // Track sync status changes
  useEffect(() => {
    return onSyncStatusChange(setSyncStatus);
  }, []);

  // Initial session check + auth state listener
  useEffect(() => {
    if (!configured) {
      setIsLoading(false);
      return;
    }

    getSession().then((session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { unsubscribe } = onAuthStateChange((session: Session | null) => {
      const newUser = session?.user ?? null;
      const hadUser = user !== null;
      setUser(newUser);

      // First sign-in: sync data
      if (newUser && !hadUser) {
        performInitialSync();
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured]);

  const performInitialSync = useCallback(async () => {
    const cloudData = await pullFromCloud();

    if (cloudData) {
      // Merge: cloud data that's newer overwrites local
      const localEstimates = listEstimates();
      const localMap = new Map(localEstimates.map((e) => [e.id, e]));

      for (const cloudEst of cloudData.estimates) {
        const local = localMap.get(cloudEst.id);
        if (!local || new Date(cloudEst.updatedAt) > new Date(local.updatedAt)) {
          saveEstimate(cloudEst);
        }
      }

      const localContracts = listContracts();
      const localContractMap = new Map(localContracts.map((c) => [c.id, c]));

      for (const cloudContract of cloudData.contracts) {
        const local = localContractMap.get(cloudContract.id);
        if (!local || new Date(cloudContract.updatedAt) > new Date(local.updatedAt)) {
          saveContract(cloudContract);
        }
      }

      if (cloudData.settings) {
        saveSettingsToStorage(cloudData.settings);
      }

      for (const type of ["plant", "service", "material"] as const) {
        if (cloudData.catalogs[type].length > 0) {
          saveCatalog(type, cloudData.catalogs[type]);
        }
      }
    }

    // Push all local data to cloud (ensures cloud has everything)
    await pushAllToCloud({
      estimates: listEstimates(),
      contracts: listContracts(),
      settings: loadSettings(),
      catalogs: {
        plant: loadCatalog("plant"),
        service: loadCatalog("service"),
        material: loadCatalog("material"),
      },
    });
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    return signInWithMagicLink(email);
  }, []);

  const logout = useCallback(async () => {
    await flushSyncQueue();
    await signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isConfigured: configured,
        isLoading,
        syncStatus,
        sendMagicLink,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
