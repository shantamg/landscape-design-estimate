import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEstimate } from "@/context/EstimateContext";
import { LineItemRow } from "./LineItemRow";
import { formatCurrency, computeSectionSubtotal } from "@/lib/estimate-utils";

export function DesignFeeSection() {
  const { estimate, dispatch } = useEstimate();
  const items = estimate.designFee;
  const subtotal = computeSectionSubtotal(items);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 bg-terracotta/8 border-b border-terracotta/15">
        <h3 className="text-base font-heading font-bold text-forest tracking-wide">
          Design Fee
        </h3>
        <div className="ml-auto text-sm font-semibold text-forest tabular-nums">
          {formatCurrency(subtotal)}
        </div>
      </div>
      <div className="px-6 py-5 space-y-2">
        {items.length > 0 && (
          <div className="grid grid-cols-[1fr_60px_70px_90px_90px_32px] gap-2 text-[10px] text-stone font-semibold uppercase tracking-wider pb-2 border-b border-stone/20 mb-1">
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span>Unit</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Total</span>
            <span />
          </div>
        )}
        <div className="space-y-1.5">
          {items.map((item, index) => (
            <LineItemRow
              key={item.id}
              item={item}
              sectionType="designFee"
              onUpdate={(updates) =>
                dispatch({
                  type: "UPDATE_DESIGN_FEE_ITEM",
                  itemId: item.id,
                  updates,
                })
              }
              onRemove={() =>
                dispatch({ type: "REMOVE_DESIGN_FEE_ITEM", itemId: item.id })
              }
              isLast={index === items.length - 1}
              onEnterOnLast={() => dispatch({ type: "ADD_DESIGN_FEE_ITEM" })}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "ADD_DESIGN_FEE_ITEM" })}
          className="text-sage hover:text-sage-dark hover:bg-sage/10 -ml-2"
        >
          <Plus className="size-4" />
          Add Design Fee Item
        </Button>
      </div>
    </div>
  );
}
