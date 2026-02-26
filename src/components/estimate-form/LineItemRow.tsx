import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineItemAutocomplete } from "./LineItemAutocomplete";
import { formatCurrency } from "@/lib/estimate-utils";
import type { LineItem, CatalogItem, CatalogType } from "@/types";

interface LineItemRowProps {
  item: LineItem;
  catalogType: CatalogType;
  onUpdate: (updates: Partial<LineItem>) => void;
  onRemove: () => void;
}

export function LineItemRow({
  item,
  catalogType,
  onUpdate,
  onRemove,
}: LineItemRowProps) {
  function handleSelectCatalogItem(catalogItem: CatalogItem) {
    onUpdate({
      description: catalogItem.name,
      unit: catalogItem.defaultUnit,
      unitPrice: catalogItem.defaultUnitPrice,
    });
  }

  const lineTotal = item.quantity * item.unitPrice;

  return (
    <div className="flex items-start gap-2 group">
      {/* Description with autocomplete */}
      <LineItemAutocomplete
        value={item.description}
        onChange={(value) => onUpdate({ description: value })}
        onSelect={handleSelectCatalogItem}
        catalogType={catalogType}
        placeholder="Description"
      />

      {/* Quantity */}
      <Input
        type="number"
        min={0}
        step={1}
        value={item.quantity || ""}
        onChange={(e) =>
          onUpdate({ quantity: parseFloat(e.target.value) || 0 })
        }
        className="w-20 text-right"
        placeholder="Qty"
      />

      {/* Unit */}
      <Input
        value={item.unit}
        onChange={(e) => onUpdate({ unit: e.target.value })}
        className="w-16 text-center"
        placeholder="Unit"
      />

      {/* Unit Price */}
      <Input
        type="number"
        min={0}
        step={0.01}
        value={item.unitPrice || ""}
        onChange={(e) =>
          onUpdate({ unitPrice: parseFloat(e.target.value) || 0 })
        }
        className="w-24 text-right"
        placeholder="Price"
      />

      {/* Line Total (read-only) */}
      <div className="w-24 text-right text-sm font-medium py-2 tabular-nums">
        {formatCurrency(lineTotal)}
      </div>

      {/* Delete */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive shrink-0"
        aria-label="Remove item"
      >
        X
      </Button>
    </div>
  );
}
