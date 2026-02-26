import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type {
  Estimate,
  ClientInfo,
  LineItem,
  ProjectSection,
  PaymentSchedule,
} from "@/types";
import { v4 as uuidv4 } from "uuid";

// --- Actions ---

type EstimateAction =
  | { type: "LOAD_ESTIMATE"; payload: Estimate }
  | { type: "RESET"; payload: Estimate }
  | { type: "SET_CLIENT_FIELD"; field: keyof ClientInfo; value: string | boolean }
  | { type: "SET_PROJECT_DESCRIPTION"; value: string }
  | { type: "SET_FIELD"; field: keyof Estimate; value: unknown }
  | { type: "ADD_PROJECT_SECTION"; name?: string }
  | { type: "REMOVE_PROJECT_SECTION"; sectionId: string }
  | { type: "UPDATE_SECTION_NAME"; sectionId: string; name: string }
  | {
      type: "ADD_LINE_ITEM";
      sectionId: string;
      listKey: "plantMaterial" | "laborAndServices" | "otherMaterials";
      item?: Partial<LineItem>;
    }
  | {
      type: "UPDATE_LINE_ITEM";
      sectionId: string;
      listKey: "plantMaterial" | "laborAndServices" | "otherMaterials";
      itemId: string;
      updates: Partial<LineItem>;
    }
  | {
      type: "REMOVE_LINE_ITEM";
      sectionId: string;
      listKey: "plantMaterial" | "laborAndServices" | "otherMaterials";
      itemId: string;
    }
  | { type: "ADD_DESIGN_FEE_ITEM"; item?: Partial<LineItem> }
  | { type: "UPDATE_DESIGN_FEE_ITEM"; itemId: string; updates: Partial<LineItem> }
  | { type: "REMOVE_DESIGN_FEE_ITEM"; itemId: string }
  | { type: "SET_TAX_RATE"; value: number }
  | { type: "SET_PAYMENT_SCHEDULE"; schedule: PaymentSchedule }
  | { type: "SET_TERMS"; value: string }
  | { type: "SET_WARRANTY"; value: string }
  | { type: "SET_EXCLUSIONS"; value: string }
  | { type: "SET_NOTES"; value: string };

// --- Default empty line item ---

function createEmptyLineItem(
  category: "Planting" | "Labor" | "Other"
): LineItem {
  return {
    id: uuidv4(),
    category,
    description: "",
    quantity: 1,
    unit: "ea",
    unitPrice: 0,
    total: 0,
  };
}

// --- Default empty project section ---

function createEmptySection(name: string = "New Section"): ProjectSection {
  return {
    id: uuidv4(),
    name,
    plantMaterial: [],
    laborAndServices: [],
    otherMaterials: [],
  };
}

// --- Reducer ---

function estimateReducer(
  state: Estimate,
  action: EstimateAction
): Estimate {
  switch (action.type) {
    case "LOAD_ESTIMATE":
    case "RESET":
      return { ...action.payload };

    case "SET_CLIENT_FIELD":
      return {
        ...state,
        client: { ...state.client, [action.field]: action.value },
      };

    case "SET_PROJECT_DESCRIPTION":
      return { ...state, projectDescription: action.value };

    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "ADD_PROJECT_SECTION":
      return {
        ...state,
        projectSections: [
          ...state.projectSections,
          createEmptySection(action.name),
        ],
      };

    case "REMOVE_PROJECT_SECTION":
      return {
        ...state,
        projectSections: state.projectSections.filter(
          (s) => s.id !== action.sectionId
        ),
      };

    case "UPDATE_SECTION_NAME":
      return {
        ...state,
        projectSections: state.projectSections.map((s) =>
          s.id === action.sectionId ? { ...s, name: action.name } : s
        ),
      };

    case "ADD_LINE_ITEM": {
      const categoryMap = {
        plantMaterial: "Planting" as const,
        laborAndServices: "Labor" as const,
        otherMaterials: "Other" as const,
      };
      const newItem: LineItem = {
        ...createEmptyLineItem(categoryMap[action.listKey]),
        ...action.item,
        id: action.item?.id ?? uuidv4(),
      };
      return {
        ...state,
        projectSections: state.projectSections.map((s) =>
          s.id === action.sectionId
            ? { ...s, [action.listKey]: [...s[action.listKey], newItem] }
            : s
        ),
      };
    }

    case "UPDATE_LINE_ITEM":
      return {
        ...state,
        projectSections: state.projectSections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                [action.listKey]: s[action.listKey].map((item: LineItem) =>
                  item.id === action.itemId
                    ? { ...item, ...action.updates }
                    : item
                ),
              }
            : s
        ),
      };

    case "REMOVE_LINE_ITEM":
      return {
        ...state,
        projectSections: state.projectSections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                [action.listKey]: s[action.listKey].filter(
                  (item: LineItem) => item.id !== action.itemId
                ),
              }
            : s
        ),
      };

    case "ADD_DESIGN_FEE_ITEM": {
      const newItem: LineItem = {
        ...createEmptyLineItem("Labor"),
        category: "Labor",
        unit: "lot",
        ...action.item,
        id: action.item?.id ?? uuidv4(),
      };
      return {
        ...state,
        designFee: [...state.designFee, newItem],
      };
    }

    case "UPDATE_DESIGN_FEE_ITEM":
      return {
        ...state,
        designFee: state.designFee.map((item) =>
          item.id === action.itemId ? { ...item, ...action.updates } : item
        ),
      };

    case "REMOVE_DESIGN_FEE_ITEM":
      return {
        ...state,
        designFee: state.designFee.filter((item) => item.id !== action.itemId),
      };

    case "SET_TAX_RATE":
      return { ...state, taxRate: action.value };

    case "SET_PAYMENT_SCHEDULE":
      return { ...state, paymentSchedule: action.schedule };

    case "SET_TERMS":
      return { ...state, terms: action.value };

    case "SET_WARRANTY":
      return { ...state, warranty: action.value };

    case "SET_EXCLUSIONS":
      return { ...state, exclusions: action.value };

    case "SET_NOTES":
      return { ...state, notes: action.value };

    default:
      return state;
  }
}

// --- Context ---

interface EstimateContextValue {
  estimate: Estimate;
  dispatch: Dispatch<EstimateAction>;
}

const EstimateContext = createContext<EstimateContextValue | null>(null);

// --- Create blank estimate ---

export function createBlankEstimate(
  estimateNumber: string,
  defaults?: {
    taxRate?: number;
    validDays?: number;
    terms?: string;
    warranty?: string;
    exclusions?: string;
  }
): Estimate {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    estimateNumber,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    validDays: defaults?.validDays ?? 30,
    client: {
      name: "",
      address: "",
      city: "",
      state: "CA",
      zip: "",
      phone: "",
      email: "",
      projectAddress: "",
      projectAddressSameAsClient: true,
    },
    projectDescription: "",
    estimatedStartDate: "",
    estimatedDuration: "",
    projectSections: [createEmptySection("Main")],
    designFee: [],
    taxRate: defaults?.taxRate ?? 9.5,
    taxableCategories: ["Planting", "Other"],
    paymentSchedule: {
      template: "custom",
      milestones: [
        { description: "Plant material due at time of ordering", percentage: 0, amount: 0 },
        { description: "50% of design fee as deposit upon acceptance", percentage: 0, amount: 0 },
        { description: "Remaining balance due upon project completion", percentage: 0, amount: 0 },
      ],
    },
    terms: defaults?.terms ?? "",
    warranty: defaults?.warranty ?? "",
    exclusions: defaults?.exclusions ?? "",
    notes: "",
  };
}

// --- Provider ---

export function EstimateProvider({
  children,
  initialEstimate,
}: {
  children: ReactNode;
  initialEstimate: Estimate;
}) {
  const [estimate, dispatch] = useReducer(estimateReducer, initialEstimate);

  return (
    <EstimateContext.Provider value={{ estimate, dispatch }}>
      {children}
    </EstimateContext.Provider>
  );
}

// --- Hook ---

export function useEstimate() {
  const context = useContext(EstimateContext);
  if (!context) {
    throw new Error("useEstimate must be used within an EstimateProvider");
  }
  return context;
}
