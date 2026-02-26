import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  listEstimates,
  loadEstimate,
  loadSettings,
  saveContract,
  listContracts,
} from "@/lib/storage";
import {
  computeGrandTotal,
  formatCurrency,
  formatDate,
} from "@/lib/estimate-utils";
import type { Contract, Estimate } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { ContractPreviewModal } from "@/components/pdf/ContractPreviewModal";
import { FileText, Eye, Download, Save } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { ContractPDF } from "@/components/pdf/ContractPDF";

// --- Default contract text from TERMS-DRAFT.md ---

const DEFAULT_TERMS = `Thank you for choosing Nancy Lyons Garden Design! Here's how we'll work together:

Scheduling & Timeline
Once this estimate is accepted and the deposit is received, we'll schedule your project based on current availability. We'll do our best to stay on timeline, though weather, material availability, and site conditions can sometimes cause adjustments — we'll keep you informed every step of the way.

Changes & Additions
We know that projects can evolve! If you'd like to make changes or additions once work has begun, we'll provide an updated estimate for your approval before proceeding with any additional work.

What's Included
This estimate covers the materials, plants, and labor described in the referenced estimate. It's based on the current conditions of your property as observed during our site visit.

What's Not Included
Unless specifically noted, this contract does not include:
- Permit fees or inspections
- Utility locating services
- Removal or hauling of excess soil beyond what's described
- Work on neighboring properties
- Ongoing maintenance after installation
- Treatment for pest or disease issues that arise after planting
- Stump grinding (if not listed in the estimate)

If we encounter unexpected conditions during the project (like buried concrete or rock), we'll discuss options with you before proceeding.`;

const DEFAULT_WARRANTY = `We stand behind our work! All plant material is covered by a 30-day warranty from the date of installation, as long as the irrigation system is properly maintained and the recommended watering schedule is followed.

If a plant doesn't make it within that 30-day window and the irrigation has been kept up, we'll replace it — you just cover the cost of the new plant material.

Hardscape work is warranted for one year against defects in workmanship. This doesn't cover settling due to natural causes, damage from tree roots, or modifications made by others.`;

const DEFAULT_EXCLUSIONS = `A few things that aren't included in this project:
- Utility locates and any underground surprises
- Permit fees (if required)
- Hauling soil beyond what's specified
- Ongoing maintenance after installation
- Pest or disease treatment after planting`;

const DEFAULT_CHANGE_ORDERS = `Gardens evolve! If you'd like to add or change anything during the project, we'll talk it through and provide a written change order with updated pricing before any additional work begins.`;

// --- Payment schedule items ---

interface PaymentItem {
  id: string;
  label: string;
  checked: boolean;
}

const DEFAULT_PAYMENT_ITEMS: PaymentItem[] = [
  {
    id: "plant-material",
    label: "All plant material costs due at time of ordering",
    checked: true,
  },
  {
    id: "design-deposit",
    label: "50% of design fee due as deposit upon acceptance",
    checked: true,
  },
  {
    id: "hardscape-irrigation",
    label: "Hardscape and irrigation materials due at time of ordering",
    checked: true,
  },
  {
    id: "remaining-balance",
    label: "Remaining balance due upon project completion",
    checked: true,
  },
];

const PAYMENT_METHODS_NOTE =
  "We accept checks, Venmo, and Zelle. Credit card payments are subject to a 3% processing fee.";

// --- Helper to generate contract number ---
function generateContractNumber(): string {
  const existingContracts = listContracts();
  const year = new Date().getFullYear();
  const nextNum = existingContracts.length + 1;
  return `NL-C-${year}-${String(nextNum).padStart(3, "0")}`;
}

// --- Component ---

interface ContractFormProps {
  preSelectedEstimateId?: string;
}

export function ContractForm({ preSelectedEstimateId }: ContractFormProps) {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string>(preSelectedEstimateId || "");
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(
    null
  );
  const [paymentItems, setPaymentItems] =
    useState<PaymentItem[]>(DEFAULT_PAYMENT_ITEMS);
  const [paymentMethodsNote, setPaymentMethodsNote] =
    useState(PAYMENT_METHODS_NOTE);
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [warranty, setWarranty] = useState(DEFAULT_WARRANTY);
  const [exclusions, setExclusions] = useState(DEFAULT_EXCLUSIONS);
  const [changeOrders, setChangeOrders] = useState(DEFAULT_CHANGE_ORDERS);
  const [validDays] = useState(30);
  const [showPreview, setShowPreview] = useState(false);
  const [contractId] = useState(() => uuidv4());
  const [contractNumber] = useState(() => generateContractNumber());

  // Load estimates on mount
  useEffect(() => {
    const allEstimates = listEstimates();
    setEstimates(allEstimates);
  }, []);

  // React to preSelectedEstimateId prop changes
  useEffect(() => {
    if (preSelectedEstimateId) {
      setSelectedEstimateId(preSelectedEstimateId);
    }
  }, [preSelectedEstimateId]);

  // Load selected estimate details
  useEffect(() => {
    if (!selectedEstimateId) {
      setSelectedEstimate(null);
      return;
    }
    const est = loadEstimate(selectedEstimateId);
    setSelectedEstimate(est);
  }, [selectedEstimateId]);

  const togglePaymentItem = (id: string) => {
    setPaymentItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const buildContract = useCallback((): Contract | null => {
    if (!selectedEstimate) return null;

    return {
      id: contractId,
      estimateId: selectedEstimate.id,
      contractNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      client: { ...selectedEstimate.client },
      projectDescription: selectedEstimate.projectDescription,
      projectSections: structuredClone(selectedEstimate.projectSections),
      designFee: structuredClone(selectedEstimate.designFee),
      taxRate: selectedEstimate.taxRate,
      taxableCategories: [...selectedEstimate.taxableCategories],
      paymentSchedule: {
        template: "custom",
        milestones: paymentItems
          .filter((item) => item.checked)
          .map((item) => ({
            description: item.label,
            percentage: 0,
            amount: 0,
          })),
      },
      terms:
        terms +
        "\n\nPayment Schedule\n" +
        paymentItems
          .filter((p) => p.checked)
          .map((p) => `- ${p.label}`)
          .join("\n") +
        "\n\n" +
        paymentMethodsNote,
      warranty,
      exclusions:
        exclusions +
        (changeOrders
          ? "\n\nChange Orders\n" + changeOrders
          : ""),
      acceptedDate: "",
      clientSignature: "",
      contractorSignature: "",
    };
  }, [
    selectedEstimate,
    contractId,
    contractNumber,
    paymentItems,
    paymentMethodsNote,
    terms,
    warranty,
    exclusions,
    changeOrders,
  ]);

  const handleSave = () => {
    const contract = buildContract();
    if (!contract) {
      toast.error("Please select an estimate first.");
      return;
    }
    saveContract(contract);
    toast.success("Contract saved successfully.");
  };

  const handlePreview = () => {
    if (!selectedEstimate) {
      toast.error("Please select an estimate first.");
      return;
    }
    setShowPreview(true);
  };

  const handleExportPDF = async () => {
    if (!selectedEstimate) {
      toast.error("Please select an estimate first.");
      return;
    }
    const contract = buildContract();
    if (!contract) return;

    const settings = loadSettings();
    const grandTotal = computeGrandTotal(selectedEstimate);
    const blob = await pdf(
      <ContractPDF
        contract={contract}
        company={settings.company}
        estimateNumber={selectedEstimate.estimateNumber}
        estimateDate={selectedEstimate.createdAt}
        grandTotal={grandTotal}
        paymentItems={paymentItems.filter((p) => p.checked)}
        paymentMethodsNote={paymentMethodsNote}
        changeOrders={changeOrders}
        validDays={validDays}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Contract-${contractNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("PDF exported.");
  };

  const contract = buildContract();
  const grandTotal = selectedEstimate
    ? computeGrandTotal(selectedEstimate)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-forest">New Contract</h2>
          <p className="text-sm text-stone">
            Contract {contractNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
            <Save className="size-4" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreview} className="gap-1.5">
            <Eye className="size-4" />
            Preview PDF
          </Button>
          <Button size="sm" onClick={handleExportPDF} className="gap-1.5 bg-sage hover:bg-sage-dark">
            <Download className="size-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="border-t border-sage/20" />

      {/* Linked Estimate Selector */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-sage" />
          <Label className="text-xs font-semibold uppercase tracking-widest text-sage">
            Linked Estimate
          </Label>
        </div>

        <Select
          value={selectedEstimateId}
          onValueChange={setSelectedEstimateId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an estimate..." />
          </SelectTrigger>
          <SelectContent>
            {estimates.length === 0 ? (
              <SelectItem value="none" disabled>
                No saved estimates
              </SelectItem>
            ) : (
              estimates.map((est) => (
                <SelectItem key={est.id} value={est.id}>
                  {est.estimateNumber} - {est.client.name || "Unnamed"} (
                  {formatDate(est.createdAt)})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {selectedEstimate && (
          <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
            <div>
              <span className="text-muted-foreground">Client:</span>{" "}
              <span className="font-medium">
                {selectedEstimate.client.name}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>{" "}
              <span className="font-medium">
                {formatDate(selectedEstimate.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>{" "}
              <span className="font-medium text-terracotta">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Payment Schedule */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-widest text-sage">
          Payment Schedule
        </Label>

        <div className="space-y-2">
          {paymentItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={() => togglePaymentItem(item.id)}
              />
              <label
                htmlFor={item.id}
                className="text-sm cursor-pointer select-none"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Label htmlFor="payment-methods" className="text-xs text-muted-foreground">
            Payment Methods Note
          </Label>
          <Textarea
            id="payment-methods"
            value={paymentMethodsNote}
            onChange={(e) => setPaymentMethodsNote(e.target.value)}
            rows={2}
            className="mt-1"
          />
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <Label
          htmlFor="terms"
          className="text-xs font-semibold uppercase tracking-widest text-sage"
        >
          Terms & Conditions
        </Label>
        <Textarea
          id="terms"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          rows={12}
        />
      </div>

      {/* Warranty */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <Label
          htmlFor="warranty"
          className="text-xs font-semibold uppercase tracking-widest text-sage"
        >
          Warranty
        </Label>
        <Textarea
          id="warranty"
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
          rows={6}
        />
      </div>

      {/* Exclusions */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <Label
          htmlFor="exclusions"
          className="text-xs font-semibold uppercase tracking-widest text-sage"
        >
          Exclusions
        </Label>
        <Textarea
          id="exclusions"
          value={exclusions}
          onChange={(e) => setExclusions(e.target.value)}
          rows={6}
        />
      </div>

      {/* Change Order Process */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <Label
          htmlFor="change-orders"
          className="text-xs font-semibold uppercase tracking-widest text-sage"
        >
          Change Order Process
        </Label>
        <Textarea
          id="change-orders"
          value={changeOrders}
          onChange={(e) => setChangeOrders(e.target.value)}
          rows={3}
        />
      </div>

      {/* Validity */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          This estimate is valid for <strong>{validDays} days</strong> from the
          date above. After that, material prices and availability may change and
          we'd want to provide you with updated pricing.
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-2 pb-4">
        <Button variant="outline" onClick={handleSave} className="gap-1.5">
          <Save className="size-4" />
          Save Draft
        </Button>
        <Button variant="outline" onClick={handlePreview} className="gap-1.5">
          <Eye className="size-4" />
          Preview PDF
        </Button>
        <Button onClick={handleExportPDF} className="gap-1.5 bg-sage hover:bg-sage-dark">
          <Download className="size-4" />
          Export PDF
        </Button>
      </div>

      {/* Preview Modal */}
      {showPreview && contract && selectedEstimate && (
        <ContractPreviewModal
          open={showPreview}
          onOpenChange={setShowPreview}
          contract={contract}
          estimateNumber={selectedEstimate.estimateNumber}
          estimateDate={selectedEstimate.createdAt}
          grandTotal={grandTotal}
          paymentItems={paymentItems.filter((p) => p.checked)}
          paymentMethodsNote={paymentMethodsNote}
          changeOrders={changeOrders}
          validDays={validDays}
        />
      )}
    </div>
  );
}
