import type { Estimate } from "@/types";

/**
 * Sample estimate based on the real "200 S. Bentley Avenue" project.
 * Used for testing and demonstration.
 */
export const sampleEstimate: Estimate = {
  id: "sample-001",
  estimateNumber: "NL-2026-001",
  status: "draft",
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  validDays: 30,

  client: {
    name: "",
    address: "200 S. Bentley Avenue",
    city: "Los Angeles",
    state: "CA",
    zip: "",
    phone: "",
    email: "",
    projectAddress: "200 S. Bentley Avenue",
    projectAddressSameAsClient: true,
  },

  projectDescription:
    "Complete landscape renovation including backyard, upper terrace, and front of house. Backyard features new planting beds, gravel area, and irrigation retrofit. Front of house includes azalea removal, jasmine installation, and bark in three areas.",

  estimatedStartDate: "",
  estimatedDuration: "",

  projectSections: [
    {
      id: "section-backyard",
      name: "Backyard",
      plantMaterial: [
        {
          id: "by-p1",
          category: "Planting",
          description: "#15 Tree (In container)",
          quantity: 1,
          unit: "ea",
          unitPrice: 200.0,
          total: 200.0,
        },
        {
          id: "by-p2",
          category: "Planting",
          description: "5 gal plants",
          quantity: 38,
          unit: "ea",
          unitPrice: 40.0,
          total: 1520.0,
        },
        {
          id: "by-p3",
          category: "Planting",
          description: "1 gal plants",
          quantity: 18,
          unit: "ea",
          unitPrice: 12.0,
          total: 216.0,
        },
        {
          id: "by-p4",
          category: "Planting",
          description: '5 gal Roses',
          quantity: 16,
          unit: "ea",
          unitPrice: 50.0,
          total: 800.0,
        },
        {
          id: "by-p5",
          category: "Planting",
          description: '4" plants',
          quantity: 16,
          unit: "ea",
          unitPrice: 5.0,
          total: 80.0,
        },
      ],
      laborAndServices: [
        {
          id: "by-l1",
          category: "Labor",
          description: "Demolition — Prep, soil, grading and dump",
          quantity: 1,
          unit: "lot",
          unitPrice: 4000.0,
          total: 4000.0,
        },
        {
          id: "by-l2",
          category: "Labor",
          description:
            "Planting labor — Includes relocating citrus tree",
          quantity: 1,
          unit: "lot",
          unitPrice: 3250.0,
          total: 3250.0,
        },
        {
          id: "by-l3",
          category: "Labor",
          description: "Gravel area 14x26 — Main area in backyard",
          quantity: 1,
          unit: "lot",
          unitPrice: 1500.0,
          total: 1500.0,
        },
        {
          id: "by-l4",
          category: "Irrigation",
          description: "Move valves",
          quantity: 1,
          unit: "lot",
          unitPrice: 550.0,
          total: 550.0,
        },
        {
          id: "by-l5",
          category: "Irrigation",
          description: "Retrofit irrigation for newly planted plants",
          quantity: 1,
          unit: "lot",
          unitPrice: 1800.0,
          total: 1800.0,
        },
      ],
      otherMaterials: [
        {
          id: "by-m1",
          category: "Other",
          description: "Bags Potting soil",
          quantity: 6,
          unit: "bag",
          unitPrice: 15.0,
          total: 90.0,
        },
      ],
    },
    {
      id: "section-upper-terrace",
      name: "Upper Terrace",
      plantMaterial: [
        {
          id: "ut-p1",
          category: "Planting",
          description: "15 gal plants",
          quantity: 6,
          unit: "ea",
          unitPrice: 100.0,
          total: 600.0,
        },
      ],
      laborAndServices: [
        {
          id: "ut-l1",
          category: "Labor",
          description: "Plant delivery",
          quantity: 1,
          unit: "lot",
          unitPrice: 150.0,
          total: 150.0,
        },
      ],
      otherMaterials: [
        {
          id: "ut-m1",
          category: "Other",
          description: "Misc materials",
          quantity: 1,
          unit: "lot",
          unitPrice: 57.0,
          total: 57.0,
        },
      ],
    },
    {
      id: "section-front",
      name: "Front of House",
      plantMaterial: [
        {
          id: "fh-p1",
          category: "Planting",
          description: "5 gal plants",
          quantity: 12,
          unit: "ea",
          unitPrice: 40.0,
          total: 480.0,
        },
        {
          id: "fh-p2",
          category: "Planting",
          description: "5 gal Jasmine (Cascade jasmine over wall)",
          quantity: 12,
          unit: "ea",
          unitPrice: 40.0,
          total: 480.0,
        },
      ],
      laborAndServices: [
        {
          id: "fh-l1",
          category: "Labor",
          description:
            "Remove azaleas to the right of staircase",
          quantity: 1,
          unit: "lot",
          unitPrice: 0,
          total: 0,
        },
        {
          id: "fh-l2",
          category: "Labor",
          description:
            "Remove 3 Agave from staircase to transplant in back of azalea area",
          quantity: 1,
          unit: "lot",
          unitPrice: 0,
          total: 0,
        },
        {
          id: "fh-l3",
          category: "Labor",
          description:
            "Plant 12-5 gallon plants to main planting area and where azaleas were removed",
          quantity: 1,
          unit: "lot",
          unitPrice: 0,
          total: 0,
        },
        {
          id: "fh-l4",
          category: "Labor",
          description:
            "Plant 12-5 gallon jasmine and trailing rosemary",
          quantity: 1,
          unit: "lot",
          unitPrice: 0,
          total: 0,
        },
        {
          id: "fh-l5",
          category: "Labor",
          description:
            "Install bark in 3 areas: Front of house, backyard newly planted beds (3) and upper terrace",
          quantity: 1,
          unit: "lot",
          unitPrice: 0,
          total: 0,
        },
      ],
      otherMaterials: [],
    },
  ],

  designFee: [
    {
      id: "df-1",
      category: "Labor",
      description: "Design Fee — Property design",
      quantity: 1,
      unit: "lot",
      unitPrice: 5000.0,
      total: 5000.0,
    },
  ],

  taxRate: 9.5,
  taxableCategories: ["Planting", "Other"],

  paymentSchedule: {
    template: "custom",
    milestones: [
      {
        description: "All plant material due at time of ordering",
        percentage: 0,
        amount: 0,
      },
      {
        description: "50% of design fee as deposit upon acceptance",
        percentage: 0,
        amount: 2500,
      },
      {
        description:
          "Hardscape & irrigation materials due at time of ordering",
        percentage: 0,
        amount: 0,
      },
      {
        description: "Remaining balance due upon project completion",
        percentage: 0,
        amount: 0,
      },
    ],
  },

  terms:
    "All plant material is due at the time of ordering. 50% of the design fee is due as a deposit upon acceptance of this estimate. Hardscape and irrigation materials are due at the time of ordering. The remaining balance is due upon project completion.",
  warranty:
    "All plants are guaranteed for 30 days from the date of installation, provided that the irrigation system is properly maintained and functioning. Hardscape work is guaranteed for one year against defects in workmanship.",
  exclusions:
    "This estimate does not include permits, engineering, or structural work unless specifically noted. Any unforeseen conditions discovered during construction may result in additional charges, which will be discussed and approved before proceeding.",
  notes: "",
};
