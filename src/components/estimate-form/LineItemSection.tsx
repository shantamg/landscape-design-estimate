import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineItemRow, type SectionType } from "./LineItemRow";
import { formatCurrency, computeSectionSubtotal } from "@/lib/estimate-utils";
import type { LineItem } from "@/types";

interface LineItemSectionProps {
  title: string;
  items: LineItem[];
  sectionType: SectionType;
  onAdd: () => void;
  onUpdate: (itemId: string, updates: Partial<LineItem>) => void;
  onRemove: (itemId: string) => void;
}

function getColumnHeaders(sectionType: SectionType) {
  const baseClass = "text-[10px] text-stone font-semibold uppercase tracking-wider pb-2 border-b border-stone/20 mb-1";
  switch (sectionType) {
    case "plant":
      return (
        <div className={`grid grid-cols-[1fr_120px_60px_90px_90px_32px] gap-2 ${baseClass}`}>
          <span>Description</span>
          <span>Size</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Price</span>
          <span className="text-right">Total</span>
          <span />
        </div>
      );
    case "labor":
      return (
        <div className={`grid grid-cols-[1fr_60px_70px_90px_90px_56px] gap-2 ${baseClass}`}>
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span>Unit</span>
          <span className="text-right">Rate</span>
          <span className="text-right">Total</span>
          <span />
        </div>
      );
    case "material":
      return (
        <div className={`grid grid-cols-[1fr_60px_80px_90px_90px_32px] gap-2 ${baseClass}`}>
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span>Unit</span>
          <span className="text-right">Price</span>
          <span className="text-right">Total</span>
          <span />
        </div>
      );
    default:
      return (
        <div className={`grid grid-cols-[1fr_60px_70px_90px_90px_32px] gap-2 ${baseClass}`}>
          <span>Description</span>
          <span className="text-right">Qty</span>
          <span>Unit</span>
          <span className="text-right">Rate</span>
          <span className="text-right">Total</span>
          <span />
        </div>
      );
  }
}

export function LineItemSection({
  title,
  items,
  sectionType,
  onAdd,
  onUpdate,
  onRemove,
}: LineItemSectionProps) {
  const subtotal = computeSectionSubtotal(items);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-sage uppercase tracking-widest">{title}</h4>
      </div>

      {items.length > 0 && getColumnHeaders(sectionType)}

      <div className="space-y-1.5">
        {items.map((item, index) => (
          <LineItemRow
            key={item.id}
            item={item}
            sectionType={sectionType}
            onUpdate={(updates) => onUpdate(item.id, updates)}
            onRemove={() => onRemove(item.id)}
            isLast={index === items.length - 1}
            onEnterOnLast={onAdd}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAdd}
          className="text-sage hover:text-sage-dark hover:bg-sage/10 -ml-2"
        >
          <Plus className="size-4" />
          Add {sectionType === "plant" ? "Plant" : sectionType === "labor" ? "Service" : sectionType === "material" ? "Material" : "Item"}
        </Button>
        {items.length > 0 && (
          <div className="text-sm font-semibold text-forest tabular-nums">
            Subtotal: {formatCurrency(subtotal)}
          </div>
        )}
      </div>
    </div>
  );
}
