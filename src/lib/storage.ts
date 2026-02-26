import type { Estimate, Settings, CatalogItem, Contract } from "@/types";
import { generateEstimateNumber } from "./estimate-utils";
import {
  queueSync,
  syncEstimates,
  syncContracts,
  syncSettings,
  syncCatalog,
  deleteEstimateFromCloud,
  deleteContractFromCloud,
} from "./sync";

// --- Storage Keys ---
const KEYS = {
  estimates: "nlgd_estimates",
  contracts: "nlgd_contracts",
  settings: "nlgd_settings",
  plantCatalog: "nlgd_plant_catalog",
  serviceCatalog: "nlgd_service_catalog",
  materialCatalog: "nlgd_material_catalog",
} as const;

// --- Default Settings ---
const DEFAULT_SETTINGS: Settings = {
  company: {
    name: "Nancy Lyons Garden Design",
    address: "",
    city: "Los Angeles",
    state: "CA",
    zip: "",
    phone: "310-630-9711",
    email: "nancylyonsdesign@gmail.com",
    website: "",
    licenseNumber: "",
    logo: "",
  },
  defaults: {
    taxRate: 9.5,
    validDays: 30,
    paymentTemplate: "custom",
    terms:
      "All plant material is due at the time of ordering. 50% of the design fee is due as a deposit upon acceptance of this estimate. Hardscape and irrigation materials are due at the time of ordering. The remaining balance is due upon project completion.",
    warranty:
      "All plants are guaranteed for 30 days from the date of installation, provided that the irrigation system is properly maintained and functioning. Hardscape work is guaranteed for one year against defects in workmanship.",
    exclusions:
      "This estimate does not include permits, engineering, or structural work unless specifically noted. Any unforeseen conditions discovered during construction may result in additional charges, which will be discussed and approved before proceeding.",
    designFeeDescription: "Design Fee — Property design",
    designFeePrice: 5000,
  },
  estimateNumberPrefix: "NL",
  nextEstimateNumber: 1,
};

// --- Generic Helpers ---

function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Estimate CRUD ---

export function listEstimates(): Estimate[] {
  return getItem<Estimate[]>(KEYS.estimates) ?? [];
}

export function loadEstimate(id: string): Estimate | null {
  const estimates = listEstimates();
  return estimates.find((e) => e.id === id) ?? null;
}

export function saveEstimate(estimate: Estimate): void {
  const estimates = listEstimates();
  const index = estimates.findIndex((e) => e.id === estimate.id);

  const updated = { ...estimate, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    estimates[index] = updated;
  } else {
    estimates.push(updated);
  }

  setItem(KEYS.estimates, estimates);
  queueSync("estimates", () => syncEstimates(listEstimates()));
}

export function deleteEstimate(id: string): void {
  const estimates = listEstimates().filter((e) => e.id !== id);
  setItem(KEYS.estimates, estimates);
  queueSync(`delete-estimate-${id}`, () => deleteEstimateFromCloud(id));
}

export function duplicateEstimate(id: string): Estimate | null {
  const original = loadEstimate(id);
  if (!original) return null;

  const settings = loadSettings();
  const newNumber = generateEstimateNumber(
    settings.estimateNumberPrefix,
    settings.nextEstimateNumber
  );

  const duplicate: Estimate = {
    ...structuredClone(original),
    id: crypto.randomUUID(),
    estimateNumber: newNumber,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Increment estimate number
  settings.nextEstimateNumber++;
  saveSettings(settings);

  saveEstimate(duplicate);
  return duplicate;
}

// --- Settings ---

export function loadSettings(): Settings {
  const stored = getItem<Settings>(KEYS.settings);
  if (!stored) {
    // Initialize with defaults on first load
    setItem(KEYS.settings, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS };
  }
  return stored;
}

export function saveSettings(settings: Settings): void {
  setItem(KEYS.settings, settings);
  queueSync("settings", () => syncSettings(loadSettings()));
}

// --- Estimate Number ---

export function getNextEstimateNumber(): string {
  const settings = loadSettings();
  return generateEstimateNumber(
    settings.estimateNumberPrefix,
    settings.nextEstimateNumber
  );
}

export function incrementEstimateNumber(): void {
  const settings = loadSettings();
  settings.nextEstimateNumber++;
  saveSettings(settings);
}

// --- Contract CRUD ---

export function listContracts(): Contract[] {
  return getItem<Contract[]>(KEYS.contracts) ?? [];
}

export function loadContract(id: string): Contract | null {
  const contracts = listContracts();
  return contracts.find((c) => c.id === id) ?? null;
}

export function saveContract(contract: Contract): void {
  const contracts = listContracts();
  const index = contracts.findIndex((c) => c.id === contract.id);

  const updated = { ...contract, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    contracts[index] = updated;
  } else {
    contracts.push(updated);
  }

  setItem(KEYS.contracts, contracts);
  queueSync("contracts", () => syncContracts(listContracts()));
}

export function deleteContract(id: string): void {
  const contracts = listContracts().filter((c) => c.id !== id);
  setItem(KEYS.contracts, contracts);
  queueSync(`delete-contract-${id}`, () => deleteContractFromCloud(id));
}

// --- Catalog ---

export function loadCatalog(type: "plant" | "service" | "material"): CatalogItem[] {
  const keyMap = {
    plant: KEYS.plantCatalog,
    service: KEYS.serviceCatalog,
    material: KEYS.materialCatalog,
  };
  return getItem<CatalogItem[]>(keyMap[type]) ?? [];
}

export function saveCatalog(
  type: "plant" | "service" | "material",
  items: CatalogItem[]
): void {
  const keyMap = {
    plant: KEYS.plantCatalog,
    service: KEYS.serviceCatalog,
    material: KEYS.materialCatalog,
  };
  setItem(keyMap[type], items);
  queueSync(`catalog-${type}`, () => syncCatalog(type, loadCatalog(type)));
}

export function initializeCatalog(defaultCatalog: CatalogItem[]): void {
  const plants = defaultCatalog.filter((c) => c.type === "plant");
  const services = defaultCatalog.filter((c) => c.type === "service");
  const materials = defaultCatalog.filter((c) => c.type === "material");

  // Only initialize if empty
  if (loadCatalog("plant").length === 0) saveCatalog("plant", plants);
  if (loadCatalog("service").length === 0) saveCatalog("service", services);
  if (loadCatalog("material").length === 0) saveCatalog("material", materials);
}

// --- Single Estimate Import (from JSON) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function importSingleEstimate(data: any): Estimate {
  const settings = loadSettings();
  const now = new Date().toISOString();

  const estimateNumber = generateEstimateNumber(
    settings.estimateNumberPrefix,
    settings.nextEstimateNumber
  );

  // Regenerate IDs for line items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function regenLineItems(items: any[] | undefined): import("@/types").LineItem[] {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      id: crypto.randomUUID(),
      category: item.category ?? "Other",
      description: item.description ?? "",
      quantity: Number(item.quantity) || 0,
      unit: item.unit ?? "ea",
      unitPrice: Number(item.unitPrice) || 0,
      total: (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      ...(item.noPrice ? { noPrice: true } : {}),
    }));
  }

  // Regenerate IDs for project sections
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function regenSections(sections: any[] | undefined): import("@/types").ProjectSection[] {
    if (!Array.isArray(sections)) return [];
    return sections.map((s) => ({
      id: crypto.randomUUID(),
      name: s.name ?? "Project",
      plantMaterial: regenLineItems(s.plantMaterial),
      laborAndServices: regenLineItems(s.laborAndServices),
      otherMaterials: regenLineItems(s.otherMaterials),
    }));
  }

  const client = data.client ?? {};

  const estimate: Estimate = {
    id: crypto.randomUUID(),
    estimateNumber,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    validDays: data.validDays ?? settings.defaults.validDays,

    client: {
      name: client.name ?? "",
      address: client.address ?? "",
      city: client.city ?? "",
      state: client.state ?? "",
      zip: client.zip ?? "",
      phone: client.phone ?? "",
      email: client.email ?? "",
      projectAddress: client.projectAddress ?? "",
      projectAddressSameAsClient: client.projectAddressSameAsClient ?? true,
    },

    projectDescription: data.projectDescription ?? "",
    estimatedStartDate: data.estimatedStartDate ?? "",
    estimatedDuration: data.estimatedDuration ?? "",

    projectSections: regenSections(data.projectSections),
    designFee: regenLineItems(data.designFee),

    taxRate: data.taxRate ?? settings.defaults.taxRate,
    taxableCategories: data.taxableCategories ?? ["Planting", "Other"],
    paymentSchedule: data.paymentSchedule ?? {
      template: settings.defaults.paymentTemplate,
      milestones: [],
    },

    terms: data.terms ?? settings.defaults.terms,
    warranty: data.warranty ?? settings.defaults.warranty,
    exclusions: data.exclusions ?? settings.defaults.exclusions,
    notes: data.notes ?? "",
  };

  // Increment estimate number
  settings.nextEstimateNumber++;
  saveSettings(settings);

  saveEstimate(estimate);
  return estimate;
}

// --- Export / Import ---

export interface ExportData {
  version: 1;
  exportedAt: string;
  estimates: Estimate[];
  settings: Settings;
  catalogs: {
    plants: CatalogItem[];
    services: CatalogItem[];
    materials: CatalogItem[];
  };
}

export function exportAllData(): ExportData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    estimates: listEstimates(),
    settings: loadSettings(),
    catalogs: {
      plants: loadCatalog("plant"),
      services: loadCatalog("service"),
      materials: loadCatalog("material"),
    },
  };
}

export function importData(data: ExportData): void {
  if (data.version !== 1) {
    throw new Error(`Unsupported data version: ${data.version}`);
  }

  setItem(KEYS.estimates, data.estimates);
  setItem(KEYS.settings, data.settings);
  saveCatalog("plant", data.catalogs.plants);
  saveCatalog("service", data.catalogs.services);
  saveCatalog("material", data.catalogs.materials);
}
