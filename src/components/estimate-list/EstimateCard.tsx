import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, computeGrandTotal } from "@/lib/estimate-utils";
import type { Estimate } from "@/types";

interface EstimateCardProps {
  estimate: Estimate;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateContract?: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-stone/20 text-stone-dark",
  sent: "bg-sage/20 text-sage-dark",
  accepted: "bg-sage/30 text-forest",
  declined: "bg-terracotta/20 text-terracotta",
};

export function EstimateCard({
  estimate,
  onOpen,
  onDuplicate,
  onDelete,
  onCreateContract,
}: EstimateCardProps) {
  const grandTotal = computeGrandTotal(estimate);
  const statusClass = STATUS_COLORS[estimate.status] ?? "bg-muted text-muted-foreground";

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:border-sage/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-forest truncate">
              {estimate.estimateNumber}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusClass}`}
            >
              {estimate.status}
            </span>
          </div>
          <p className="text-sm text-foreground truncate">
            {estimate.client.name || estimate.client.address || "No client"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(estimate.updatedAt)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold tabular-nums text-forest">
            {formatCurrency(grandTotal)}
          </p>
          <p className="text-xs text-muted-foreground">
            {estimate.projectSections.length} section
            {estimate.projectSections.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpen(estimate.id)}
          className="flex-1"
        >
          Open
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDuplicate(estimate.id)}
        >
          Duplicate
        </Button>
        {onCreateContract && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateContract(estimate.id)}
            className="text-sage-dark"
          >
            <FileText className="size-3.5 mr-1" />
            Contract
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(estimate.id)}
          className="text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
