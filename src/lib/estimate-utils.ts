import type {
  LineItem,
  ProjectSection,
  Estimate,
  LineItemCategory,
  Invoice,
  SimpleLineItem,
} from "@/types";

/** Subset of Estimate/Invoice fields needed for price computation */
export type PriceableDocument = Pick<
  Estimate,
  "projectSections" | "designFee" | "taxRate" | "taxableCategories"
> & {
  standaloneItems?: SimpleLineItem[];
};

// --- Line-level ---

export function computeLineTotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

// --- Section-level (within a project section) ---

export function computeSectionSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

// --- Project Section totals ---

export function computeProjectSectionSubtotal(
  section: ProjectSection
): number {
  return (
    computeSectionSubtotal(section.plantMaterial) +
    computeSectionSubtotal(section.laborAndServices) +
    computeSectionSubtotal(section.otherMaterials)
  );
}

// --- Estimate-level computations ---

/** Sum all items in a given category across all project sections */
export function computeCategoryTotal(
  estimate: PriceableDocument,
  category: "plantMaterial" | "laborAndServices" | "otherMaterials"
): number {
  return estimate.projectSections.reduce(
    (sum, section) => sum + computeSectionSubtotal(section[category]),
    0
  );
}

/** Sum of design fee line items */
export function computeDesignFeeTotal(estimate: PriceableDocument): number {
  return computeSectionSubtotal(estimate.designFee);
}

/** Total of all taxable categories (plant material + other materials by default) */
export function computeTaxableTotal(estimate: PriceableDocument): number {
  const taxableCategories = estimate.taxableCategories;

  let total = 0;
  for (const section of estimate.projectSections) {
    for (const item of section.plantMaterial) {
      if (taxableCategories.includes(item.category)) {
        total += item.quantity * item.unitPrice;
      }
    }
    for (const item of section.otherMaterials) {
      if (taxableCategories.includes(item.category)) {
        total += item.quantity * item.unitPrice;
      }
    }
    for (const item of section.laborAndServices) {
      if (taxableCategories.includes(item.category)) {
        total += item.quantity * item.unitPrice;
      }
    }
  }

  return total;
}

/** Total of all non-taxable items */
export function computeNonTaxableTotal(estimate: PriceableDocument): number {
  const taxableCategories = estimate.taxableCategories;

  let total = 0;
  for (const section of estimate.projectSections) {
    for (const item of [
      ...section.plantMaterial,
      ...section.laborAndServices,
      ...section.otherMaterials,
    ]) {
      if (!taxableCategories.includes(item.category)) {
        total += item.quantity * item.unitPrice;
      }
    }
  }

  // Design fee is non-taxable
  total += computeDesignFeeTotal(estimate);

  return total;
}

/** Compute tax amount */
export function computeTax(estimate: PriceableDocument): number {
  const taxableTotal = computeTaxableTotal(estimate);
  return Math.round(taxableTotal * (estimate.taxRate / 100) * 100) / 100;
}

/** Sum of standalone line items (no tax) */
export function computeStandaloneTotal(items: SimpleLineItem[]): number {
  return Math.round(
    items.reduce((sum, item) => sum + item.amount, 0) * 100
  ) / 100;
}

/** Grand total: all items + tax (or standalone total if standalone items exist) */
export function computeGrandTotal(estimate: PriceableDocument): number {
  // Standalone invoices: simple sum, no tax
  if (estimate.standaloneItems && estimate.standaloneItems.length > 0) {
    return computeStandaloneTotal(estimate.standaloneItems);
  }

  let total = 0;

  // Sum all project sections
  for (const section of estimate.projectSections) {
    total += computeProjectSectionSubtotal(section);
  }

  // Add design fee
  total += computeDesignFeeTotal(estimate);

  // Add tax
  total += computeTax(estimate);

  return Math.round(total * 100) / 100;
}

/** Subtotal before tax (all items, no tax) */
export function computeSubtotal(estimate: PriceableDocument): number {
  let total = 0;
  for (const section of estimate.projectSections) {
    total += computeProjectSectionSubtotal(section);
  }
  total += computeDesignFeeTotal(estimate);
  return Math.round(total * 100) / 100;
}

// --- Formatting ---

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- Estimate Number Generation ---

export function generateEstimateNumber(
  prefix: string,
  nextNumber: number
): string {
  const year = new Date().getFullYear();
  const padded = String(nextNumber).padStart(3, "0");
  return `${prefix}-${year}-${padded}`;
}

export function generateInvoiceNumber(
  prefix: string,
  nextNumber: number
): string {
  const year = new Date().getFullYear();
  const padded = String(nextNumber).padStart(3, "0");
  return `${prefix}-INV-${year}-${padded}`;
}

/** Sum of all payments recorded on an invoice */
export function computeAmountPaid(invoice: Invoice): number {
  return invoice.payments.reduce((sum, p) => sum + p.amount, 0);
}

/** Grand total minus amount paid */
export function computeBalanceRemaining(invoice: Invoice): number {
  return computeGrandTotal(invoice) - computeAmountPaid(invoice);
}

// --- Category helpers ---

export const TAXABLE_CATEGORIES: LineItemCategory[] = ["Planting", "Other"];

export const ALL_CATEGORIES: LineItemCategory[] = [
  "Planting",
  "Hardscape",
  "Irrigation",
  "Lighting",
  "Labor",
  "Equipment",
  "Other",
];

export const UNIT_OPTIONS = [
  { value: "ea", label: "each" },
  { value: "sqft", label: "sq ft" },
  { value: "lnft", label: "lin ft" },
  { value: "cuyd", label: "cu yd" },
  { value: "hr", label: "hour" },
  { value: "lot", label: "lot" },
  { value: "flat", label: "flat" },
  { value: "bag", label: "bag" },
  { value: "ton", label: "ton" },
  { value: "roll", label: "roll" },
  { value: "box", label: "box" },
];
