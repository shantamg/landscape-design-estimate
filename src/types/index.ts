// ============================================================================
// NLGD Estimate Tool - Core Type Definitions
// ============================================================================

// --- Line Item Categories ---
export type LineItemCategory =
  | "Planting"
  | "Hardscape"
  | "Irrigation"
  | "Lighting"
  | "Labor"
  | "Equipment"
  | "Other";

// --- Unit Types ---
export type UnitType =
  | "ea"
  | "sqft"
  | "lnft"
  | "cuyd"
  | "hr"
  | "lot"
  | "flat"
  | "bag"
  | "ton"
  | "roll"
  | "box";

// --- Estimate Status ---
export type EstimateStatus = "draft" | "sent" | "accepted" | "declined";

// --- Payment Schedule Templates ---
export type PaymentTemplate = "50-50" | "thirds" | "custom";

// --- Line Item ---
export interface LineItem {
  id: string;
  category: LineItemCategory;
  description: string;
  quantity: number;
  unit: UnitType | string;
  unitPrice: number;
  total: number; // Computed: quantity * unitPrice
}

// --- Project Section ---
// Each estimate can have multiple project sections (e.g., "Backyard", "Front of House")
export interface ProjectSection {
  id: string;
  name: string; // e.g., "Backyard", "Front of House", "Upper Terrace"
  plantMaterial: LineItem[];
  laborAndServices: LineItem[];
  otherMaterials: LineItem[];
}

// --- Payment Milestone ---
export interface PaymentMilestone {
  description: string;
  percentage: number;
  amount: number; // Computed from grand total
}

// --- Payment Schedule ---
export interface PaymentSchedule {
  template: PaymentTemplate;
  milestones: PaymentMilestone[];
}

// --- Client Info ---
export interface ClientInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  projectAddress: string;
  projectAddressSameAsClient: boolean;
}

// --- Estimate ---
export interface Estimate {
  id: string;
  estimateNumber: string; // "NL-2026-001"
  status: EstimateStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  validDays: number; // Default 30

  client: ClientInfo;

  projectDescription: string;
  estimatedStartDate: string;
  estimatedDuration: string;

  // Organized by project sections
  projectSections: ProjectSection[];

  // Design fee is project-level (not per-section)
  designFee: LineItem[];

  taxRate: number; // Default 9.5%
  taxableCategories: LineItemCategory[]; // Typically ["Planting", "Other"]
  paymentSchedule: PaymentSchedule;

  terms: string;
  warranty: string;
  exclusions: string;
  notes: string;
}

// --- Catalog Item ---
export type CatalogType = "plant" | "service" | "material";

export interface CatalogItem {
  id: string;
  type: CatalogType;
  category: LineItemCategory;
  name: string; // "Japanese Maple (Acer palmatum)"
  description: string;
  defaultUnit: UnitType | string;
  defaultUnitPrice: number;
  tags: string[];
  isBuiltIn: boolean; // true = shipped, false = user-added
}

// --- Company Info ---
export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  licenseNumber: string; // CSLB#
  logo: string; // Base64-encoded image
}

// --- Settings ---
export interface Settings {
  company: CompanyInfo;

  defaults: {
    taxRate: number;
    validDays: number;
    paymentTemplate: PaymentTemplate;
    terms: string;
    warranty: string;
    exclusions: string;
    designFeeDescription: string;
    designFeePrice: number;
  };

  estimateNumberPrefix: string; // "NL"
  nextEstimateNumber: number; // Auto-incremented
}

// --- Contract (separate from Estimate) ---
export interface Contract {
  id: string;
  estimateId: string; // Links to source estimate
  contractNumber: string;
  createdAt: string;
  updatedAt: string;

  // Inherited from estimate
  client: ClientInfo;
  projectDescription: string;
  projectSections: ProjectSection[];
  designFee: LineItem[];
  taxRate: number;
  taxableCategories: LineItemCategory[];

  // Contract-specific
  paymentSchedule: PaymentSchedule;
  terms: string;
  warranty: string;
  exclusions: string;
  acceptedDate: string;
  clientSignature: string; // Base64 image or empty
  contractorSignature: string;
}
