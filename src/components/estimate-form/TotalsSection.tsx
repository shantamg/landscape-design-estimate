import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEstimate } from "@/context/EstimateContext";
import {
  formatCurrency,
  computeCategoryTotal,
  computeDesignFeeTotal,
  computeTaxableTotal,
  computeTax,
  computeSubtotal,
  computeGrandTotal,
} from "@/lib/estimate-utils";

export function TotalsSection() {
  const { estimate, dispatch } = useEstimate();

  const plantTotal = computeCategoryTotal(estimate, "plantMaterial");
  const laborTotal = computeCategoryTotal(estimate, "laborAndServices");
  const materialsTotal = computeCategoryTotal(estimate, "otherMaterials");
  const designFeeTotal = computeDesignFeeTotal(estimate);
  const subtotal = computeSubtotal(estimate);
  const taxableTotal = computeTaxableTotal(estimate);
  const taxAmount = computeTax(estimate);
  const grandTotal = computeGrandTotal(estimate);

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h3 className="text-lg font-heading font-semibold text-forest">
        Cost Summary
      </h3>

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Plant Material</span>
          <span className="tabular-nums">{formatCurrency(plantTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Labor & Services</span>
          <span className="tabular-nums">{formatCurrency(laborTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Other Materials</span>
          <span className="tabular-nums">{formatCurrency(materialsTotal)}</span>
        </div>
        {designFeeTotal > 0 && (
          <div className="flex justify-between">
            <span>Design Fee</span>
            <span className="tabular-nums">
              {formatCurrency(designFeeTotal)}
            </span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span className="font-medium tabular-nums">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Tax */}
      <div className="flex items-center justify-between text-sm gap-2">
        <div className="flex items-center gap-2">
          <span>Sales Tax on Materials</span>
          <span className="text-xs text-muted-foreground">
            ({formatCurrency(taxableTotal)} taxable)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={0}
              max={25}
              step={0.1}
              value={estimate.taxRate}
              onChange={(e) =>
                dispatch({
                  type: "SET_TAX_RATE",
                  value: parseFloat(e.target.value) || 0,
                })
              }
              className="w-16 h-7 text-right text-xs"
            />
            <Label className="text-xs">%</Label>
          </div>
          <span className="tabular-nums w-24 text-right">
            {formatCurrency(taxAmount)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Grand Total */}
      <div className="flex justify-between text-lg font-bold">
        <span className="font-heading text-forest">Grand Total</span>
        <span className="tabular-nums text-forest">
          {formatCurrency(grandTotal)}
        </span>
      </div>
    </div>
  );
}
