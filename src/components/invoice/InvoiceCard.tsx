import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatDate,
  computeGrandTotal,
  computeAmountPaid,
  computeBalanceRemaining,
} from "@/lib/estimate-utils";
import type { Invoice, InvoiceStatus } from "@/types";

interface InvoiceCardProps {
  invoice: Invoice;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  unpaid: "bg-amber-100 text-amber-800",
  partial: "bg-blue-100 text-blue-800",
  paid: "bg-sage/20 text-forest",
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  unpaid: "Unpaid",
  partial: "Partial",
  paid: "Paid",
};

function getEffectiveStatus(invoice: Invoice): InvoiceStatus {
  const grandTotal = computeGrandTotal(invoice);
  const amountPaid = computeAmountPaid(invoice);
  if (amountPaid >= grandTotal && grandTotal > 0) return "paid";
  if (amountPaid > 0) return "partial";
  return "unpaid";
}

export function InvoiceCard({ invoice, onOpen, onDelete }: InvoiceCardProps) {
  const grandTotal = computeGrandTotal(invoice);
  const balanceRemaining = computeBalanceRemaining(invoice);
  const effectiveStatus = getEffectiveStatus(invoice);
  const statusClass = STATUS_COLORS[effectiveStatus];

  return (
    <div className="rounded-lg border border-border bg-card p-5 hover:border-sage/40 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-forest truncate text-base">
              {invoice.invoiceNumber}
            </h3>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusClass}`}
            >
              {STATUS_LABELS[effectiveStatus]}
            </span>
          </div>
          <p className="text-sm text-foreground truncate">
            {invoice.client.name || invoice.client.address || "No client"}
          </p>
          <p className="text-xs text-stone">
            {formatDate(invoice.invoiceDate)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-heading font-bold tabular-nums text-terracotta">
            {formatCurrency(grandTotal)}
          </p>
          {balanceRemaining > 0 && balanceRemaining < grandTotal && (
            <p className="text-xs text-stone">
              {formatCurrency(balanceRemaining)} remaining
            </p>
          )}
          {balanceRemaining <= 0 && grandTotal > 0 && (
            <p className="text-xs text-sage-dark font-medium">Paid in full</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-border/60">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpen(invoice.id)}
          className="flex-1 border-sage/30 text-sage-dark hover:bg-sage/10"
        >
          Open
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(invoice.id)}
          className="text-destructive/70 hover:text-destructive hover:bg-destructive/10"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
