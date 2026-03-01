import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EstimateCombobox } from "@/components/ui/estimate-combobox";
import { toast } from "sonner";
import {
  listEstimates,
  loadEstimate,
  loadSettings,
  saveInvoice,
  getNextInvoiceNumber,
  incrementInvoiceNumber,
} from "@/lib/storage";
import {
  computeGrandTotal,
  computeAmountPaid,
  computeBalanceRemaining,
  computeStandaloneTotal,
  formatCurrency,
  formatDate,
} from "@/lib/estimate-utils";
import type { Invoice, Estimate, PaymentMethod, Payment, SimpleLineItem, ClientInfo } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { InvoicePreviewModal } from "@/components/pdf/InvoicePreviewModal";
import { FileText, Eye, Download, Save, Plus, Trash2, List } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/pdf/InvoicePDF";

const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "check", label: "Check" },
  { value: "venmo", label: "Venmo" },
  { value: "zelle", label: "Zelle" },
  { value: "credit_card", label: "Credit Card" },
  { value: "cash", label: "Cash" },
  { value: "other", label: "Other" },
];

type InvoiceMode = "estimate" | "standalone";

const EMPTY_CLIENT: ClientInfo = {
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  email: "",
  projectAddress: "",
  projectAddressSameAsClient: true,
};

interface InvoiceFormProps {
  preSelectedEstimateId?: string;
}

export function InvoiceForm({ preSelectedEstimateId }: InvoiceFormProps) {
  const [mode, setMode] = useState<InvoiceMode>(preSelectedEstimateId ? "estimate" : "estimate");
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string>(preSelectedEstimateId || "");
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);

  // Standalone fields
  const [standaloneClient, setStandaloneClient] = useState<ClientInfo>({ ...EMPTY_CLIENT });
  const [standaloneDescription, setStandaloneDescription] = useState("");
  const [standaloneItems, setStandaloneItems] = useState<SimpleLineItem[]>([
    { id: uuidv4(), description: "", amount: 0 },
  ]);

  const settings = loadSettings();
  const [invoiceId] = useState(() => uuidv4());
  const [invoiceNumber] = useState(() => {
    const num = getNextInvoiceNumber();
    return num;
  });
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [paymentInstructions, setPaymentInstructions] = useState(settings.defaults.invoicePaymentInstructions);
  const [notes, setNotes] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [hasIncremented, setHasIncremented] = useState(false);

  // Load estimates on mount
  useEffect(() => {
    setEstimates(listEstimates());
  }, []);

  // React to preSelectedEstimateId prop changes
  useEffect(() => {
    if (preSelectedEstimateId) {
      setSelectedEstimateId(preSelectedEstimateId);
      setMode("estimate");
    }
  }, [preSelectedEstimateId]);

  // Load selected estimate
  useEffect(() => {
    if (!selectedEstimateId) {
      setSelectedEstimate(null);
      return;
    }
    setSelectedEstimate(loadEstimate(selectedEstimateId));
  }, [selectedEstimateId]);

  // Standalone line item helpers
  const addStandaloneItem = () => {
    setStandaloneItems((prev) => [
      ...prev,
      { id: uuidv4(), description: "", amount: 0 },
    ]);
  };

  const updateStandaloneItem = (id: string, updates: Partial<SimpleLineItem>) => {
    setStandaloneItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeStandaloneItem = (id: string) => {
    setStandaloneItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addPayment = () => {
    setPayments((prev) => [
      ...prev,
      {
        id: uuidv4(),
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        method: "check" as PaymentMethod,
        note: "",
      },
    ]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const buildInvoice = useCallback((): Invoice | null => {
    if (mode === "estimate") {
      if (!selectedEstimate) return null;

      return {
        id: invoiceId,
        estimateId: selectedEstimate.id,
        invoiceNumber,
        status: "unpaid",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        client: { ...selectedEstimate.client },
        projectDescription: selectedEstimate.projectDescription,
        projectSections: structuredClone(selectedEstimate.projectSections),
        designFee: structuredClone(selectedEstimate.designFee),
        taxRate: selectedEstimate.taxRate,
        taxableCategories: [...selectedEstimate.taxableCategories],
        invoiceDate,
        payments,
        paymentInstructions,
        notes,
        standaloneItems: [],
      };
    }

    // Standalone mode
    if (!standaloneClient.name.trim()) return null;
    const validItems = standaloneItems.filter((item) => item.description.trim() && item.amount > 0);
    if (validItems.length === 0) return null;

    return {
      id: invoiceId,
      estimateId: "",
      invoiceNumber,
      status: "unpaid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      client: { ...standaloneClient },
      projectDescription: standaloneDescription,
      projectSections: [],
      designFee: [],
      taxRate: 0,
      taxableCategories: [],
      invoiceDate,
      payments,
      paymentInstructions,
      notes,
      standaloneItems: validItems,
    };
  }, [
    mode,
    selectedEstimate,
    standaloneClient,
    standaloneDescription,
    standaloneItems,
    invoiceId,
    invoiceNumber,
    invoiceDate,
    payments,
    paymentInstructions,
    notes,
  ]);

  const handleSave = () => {
    const invoice = buildInvoice();
    if (!invoice) {
      if (mode === "estimate") {
        toast.error("Please select an estimate first.");
      } else {
        toast.error("Please enter a client name and at least one line item.");
      }
      return;
    }

    // Determine status based on payments
    const grandTotal = computeGrandTotal(invoice);
    const amountPaid = computeAmountPaid(invoice);
    if (amountPaid >= grandTotal) {
      invoice.status = "paid";
    } else if (amountPaid > 0) {
      invoice.status = "partial";
    } else {
      invoice.status = "unpaid";
    }

    saveInvoice(invoice);
    if (!hasIncremented) {
      incrementInvoiceNumber();
      setHasIncremented(true);
    }
    toast.success("Invoice saved successfully.");
  };

  const canPreview = mode === "estimate" ? !!selectedEstimate : !!(standaloneClient.name.trim() && standaloneItems.some((i) => i.description.trim() && i.amount > 0));

  const handlePreview = () => {
    if (!canPreview) {
      if (mode === "estimate") {
        toast.error("Please select an estimate first.");
      } else {
        toast.error("Please enter a client name and at least one line item.");
      }
      return;
    }
    setShowPreview(true);
  };

  const handleExportPDF = async () => {
    if (!canPreview) {
      if (mode === "estimate") {
        toast.error("Please select an estimate first.");
      } else {
        toast.error("Please enter a client name and at least one line item.");
      }
      return;
    }
    const invoice = buildInvoice();
    if (!invoice) return;

    const blob = await pdf(
      <InvoicePDF
        invoice={invoice}
        company={settings.company}
        estimateNumber={mode === "estimate" ? selectedEstimate?.estimateNumber : undefined}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${invoiceNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("PDF exported.");
  };

  const invoice = buildInvoice();
  const grandTotal = mode === "estimate"
    ? (selectedEstimate ? computeGrandTotal(selectedEstimate) : 0)
    : computeStandaloneTotal(standaloneItems.filter((i) => i.description.trim() && i.amount > 0));
  const amountPaid = invoice ? computeAmountPaid(invoice) : 0;
  const balanceRemaining = invoice ? computeBalanceRemaining(invoice) : grandTotal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-forest">New Invoice</h2>
          <p className="text-sm text-stone">Invoice {invoiceNumber}</p>
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

      {/* Mode Toggle */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
        <button
          type="button"
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "estimate"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setMode("estimate")}
        >
          From Estimate
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "standalone"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setMode("standalone")}
        >
          Standalone Invoice
        </button>
      </div>

      {mode === "estimate" ? (
        /* ─── Estimate-Linked Mode ─── */
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-sage" />
            <Label className="text-xs font-semibold uppercase tracking-widest text-sage">
              Linked Estimate
            </Label>
          </div>

          <EstimateCombobox
            estimates={estimates}
            value={selectedEstimateId}
            onValueChange={setSelectedEstimateId}
            placeholder="Search estimates..."
          />

          {selectedEstimate && (
            <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
              <div>
                <span className="text-muted-foreground">Client:</span>{" "}
                <span className="font-medium">{selectedEstimate.client.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>{" "}
                <span className="font-medium">{formatDate(selectedEstimate.createdAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total:</span>{" "}
                <span className="font-medium text-terracotta">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ─── Standalone Mode ─── */
        <>
          {/* Client Info */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <Label className="text-xs font-semibold uppercase tracking-widest text-sage">
              Client Information
            </Label>

            <div className="space-y-1.5">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={standaloneClient.name}
                onChange={(e) => setStandaloneClient((c) => ({ ...c, name: e.target.value }))}
                placeholder="Client name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clientAddress">Address</Label>
              <Input
                id="clientAddress"
                value={standaloneClient.address}
                onChange={(e) => setStandaloneClient((c) => ({ ...c, address: e.target.value }))}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="clientCity">City</Label>
                <Input
                  id="clientCity"
                  value={standaloneClient.city}
                  onChange={(e) => setStandaloneClient((c) => ({ ...c, city: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientState">State</Label>
                <Input
                  id="clientState"
                  value={standaloneClient.state}
                  onChange={(e) => setStandaloneClient((c) => ({ ...c, state: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientZip">ZIP</Label>
                <Input
                  id="clientZip"
                  value={standaloneClient.zip}
                  onChange={(e) => setStandaloneClient((c) => ({ ...c, zip: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="clientPhone">Phone</Label>
                <Input
                  id="clientPhone"
                  value={standaloneClient.phone}
                  onChange={(e) => setStandaloneClient((c) => ({ ...c, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={standaloneClient.email}
                  onChange={(e) => setStandaloneClient((c) => ({ ...c, email: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <Label htmlFor="standaloneDesc" className="text-xs font-semibold uppercase tracking-widest text-sage">
              Description
            </Label>
            <Textarea
              id="standaloneDesc"
              value={standaloneDescription}
              onChange={(e) => setStandaloneDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of work performed..."
            />
          </div>

          {/* Simple Line Items */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-widest text-sage">
                Line Items
              </Label>
              <Button variant="outline" size="sm" onClick={addStandaloneItem} className="gap-1.5">
                <Plus className="size-3.5" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {standaloneItems.map((item) => {
                const hasSubContent = item.subItems?.some((s) => s.trim());
                return (
                  <div key={item.id}>
                    <div className="grid grid-cols-[1fr_150px_auto_auto] gap-3 items-end">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateStandaloneItem(item.id, { description: e.target.value })}
                          placeholder="Service or item description"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Amount</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.amount || ""}
                          onChange={(e) => updateStandaloneItem(item.id, { amount: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const current = item.subItems;
                          if (current && current.length > 0) {
                            // Toggle off — clear if empty
                            if (!current.some((s) => s.trim())) {
                              updateStandaloneItem(item.id, { subItems: undefined });
                            } else {
                              updateStandaloneItem(item.id, { subItems: undefined });
                            }
                          } else {
                            updateStandaloneItem(item.id, { subItems: [""] });
                          }
                        }}
                        className={hasSubContent ? "text-sage hover:text-sage-dark" : "text-muted-foreground hover:text-sage"}
                        title={item.subItems?.length ? "Remove detail list" : "Add detail list"}
                      >
                        <List className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStandaloneItem(item.id)}
                        disabled={standaloneItems.length <= 1}
                        className="text-destructive/70 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    {item.subItems && item.subItems.length > 0 && (
                      <div className="ml-4 mt-1.5 mb-1">
                        <span className="text-[11px] text-stone italic">Includes:</span>
                        <textarea
                          value={item.subItems.join("\n")}
                          onChange={(e) => {
                            updateStandaloneItem(item.id, { subItems: e.target.value.split("\n") });
                          }}
                          placeholder="One item per line..."
                          rows={Math.max(2, (item.subItems.join("\n").match(/\n/g)?.length ?? 0) + 2)}
                          className="mt-1 w-full rounded border border-input bg-muted/40 px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] resize-y"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Running total */}
            <div className="border-t border-border/60 pt-3 flex justify-between text-sm font-bold">
              <span>Total:</span>
              <span className="text-terracotta">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </>
      )}

      {/* Invoice Details */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <Label className="text-xs font-semibold uppercase tracking-widest text-sage">
          Invoice Details
        </Label>

        <div className="space-y-1.5 max-w-xs">
          <Label htmlFor="invoiceDate">Invoice Date</Label>
          <Input
            id="invoiceDate"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <Label htmlFor="paymentInstructions" className="text-xs font-semibold uppercase tracking-widest text-sage">
          Payment Instructions
        </Label>
        <Textarea
          id="paymentInstructions"
          value={paymentInstructions}
          onChange={(e) => setPaymentInstructions(e.target.value)}
          rows={3}
        />
      </div>

      {/* Payments Received */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-widest text-sage">
            Payments Received
          </Label>
          <Button variant="outline" size="sm" onClick={addPayment} className="gap-1.5">
            <Plus className="size-3.5" />
            Add Payment
          </Button>
        </div>

        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="grid grid-cols-[1fr_1fr_1fr_2fr_auto] gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    type="date"
                    value={payment.date}
                    onChange={(e) => updatePayment(payment.id, { date: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Amount</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={payment.amount || ""}
                    onChange={(e) => updatePayment(payment.id, { amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Method</Label>
                  <Select
                    value={payment.method}
                    onValueChange={(v) => updatePayment(payment.id, { method: v as PaymentMethod })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Note</Label>
                  <Input
                    value={payment.note}
                    onChange={(e) => updatePayment(payment.id, { note: e.target.value })}
                    placeholder="Check #, reference, etc."
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePayment(payment.id)}
                  className="text-destructive/70 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Payment Summary */}
        {(mode === "estimate" ? selectedEstimate : canPreview) && (
          <div className="border-t border-border/60 pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice Total:</span>
              <span className="font-medium">{formatCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-medium text-sage-dark">{formatCurrency(amountPaid)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Balance Remaining:</span>
              <span className={balanceRemaining > 0 ? "text-terracotta" : "text-sage-dark"}>
                {formatCurrency(balanceRemaining)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <Label htmlFor="invoiceNotes" className="text-xs font-semibold uppercase tracking-widest text-sage">
          Notes
        </Label>
        <Textarea
          id="invoiceNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Additional notes for this invoice..."
        />
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
      {showPreview && invoice && (
        <InvoicePreviewModal
          open={showPreview}
          onOpenChange={setShowPreview}
          invoice={invoice}
          estimateNumber={mode === "estimate" ? selectedEstimate?.estimateNumber : undefined}
        />
      )}
    </div>
  );
}
