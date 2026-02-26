import { Button } from "@/components/ui/button";
import { LineItemRow } from "./LineItemRow";
import { formatCurrency, computeSectionSubtotal } from "@/lib/estimate-utils";
import type { LineItem, CatalogType } from "@/types";

interface LineItemSectionProps {
  title: string;
  items: LineItem[];
  catalogType: CatalogType;
  onAdd: () => void;
  onUpdate: (itemId: string, updates: Partial<LineItem>) => void;
  onRemove: (itemId: string) => void;
}

export function LineItemSection({
  title,
  items,
  catalogType,
  onAdd,
  onUpdate,
  onRemove,
}: LineItemSectionProps) {
  const subtotal = computeSectionSubtotal(items);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-sage-dark uppercase tracking-wide">
          {title}
        </h4>
        {items.length > 0 && (
          <span className="text-sm font-medium tabular-nums">
            {formatCurrency(subtotal)}
          </span>
        )}
      </div>

      {/* Column headers */}
      {items.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-0">
          <div className="flex-1">Description</div>
          <div className="w-20 text-right">Qty</div>
          <div className="w-16 text-center">Unit</div>
          <div className="w-24 text-right">Price</div>
          <div className="w-24 text-right">Total</div>
          <div className="w-8" />
        </div>
      )}

      {/* Line items */}
      <div className="space-y-1">
        {items.map((item) => (
          <LineItemRow
            key={item.id}
            item={item}
            catalogType={catalogType}
            onUpdate={(updates) => onUpdate(item.id, updates)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="text-sage hover:text-sage-dark"
      >
        + Add Item
      </Button>
    </div>
  );
}
