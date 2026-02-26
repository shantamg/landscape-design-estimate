import { useEstimate } from "@/context/EstimateContext";
import { Input } from "@/components/ui/input";
import {
  formatCurrency,
  computeCategoryTotal,
  computeDesignFeeTotal,
  computeTaxableTotal,
  computeTax,
  computeSubtotal,
  computeGrandTotal,
  computeProjectSectionSubtotal,
} from "@/lib/estimate-utils";

export function TotalsSection() {
  const { estimate, dispatch } = useEstimate();

  const plantTotal = computeCategoryTotal(estimate, "plantMaterial");
  const laborTotal = computeCategoryTotal(estimate, "laborAndServices");
  const materialsTotal = computeCategoryTotal(estimate, "otherMaterials");
  const designFeeTotal = computeDesignFeeTotal(estimate);
  const taxableTotal = computeTaxableTotal(estimate);
  const tax = computeTax(estimate);
  const subtotal = computeSubtotal(estimate);
  const grandTotal = computeGrandTotal(estimate);

  return (
    <div className="rounded-lg border-2 border-sage/30 bg-card p-6">
      <h3 className="text-xs font-semibold text-sage uppercase tracking-widest mb-5">
        Cost Summary
      </h3>

      <div className="space-y-3 max-w-md ml-auto">
        {/* Per-section subtotals */}
        {estimate.projectSections.map((section) => {
          const sectionTotal = computeProjectSectionSubtotal(section);
          if (sectionTotal === 0) return null;
          return (
            <div
              key={section.id}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">{section.name}</span>
              <span className="tabular-nums">{formatCurrency(sectionTotal)}</span>
            </div>
          );
        })}

        {estimate.projectSections.length > 1 && (
          <div className="border-t border-border pt-2" />
        )}

        {/* Category breakdowns */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plant Material</span>
          <span className="tabular-nums">{formatCurrency(plantTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Labor & Services</span>
          <span className="tabular-nums">{formatCurrency(laborTotal)}</span>
        </div>
        {materialsTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Other Materials</span>
            <span className="tabular-nums">{formatCurrency(materialsTotal)}</span>
          </div>
        )}
        {designFeeTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Design Fee</span>
            <span className="tabular-nums">{formatCurrency(designFeeTotal)}</span>
          </div>
        )}

        <div className="border-t border-border pt-2">
          <div className="flex justify-between text-sm font-semibold text-forest">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Tax on materials ({formatCurrency(taxableTotal)})
            </span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={estimate.taxRate}
                onChange={(e) =>
                  dispatch({
                    type: "SET_TAX_RATE",
                    value: parseFloat(e.target.value) || 0,
                  })
                }
                step="0.1"
                min="0"
                max="20"
                className="w-16 h-7 text-xs text-right"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
          <span className="tabular-nums">{formatCurrency(tax)}</span>
        </div>

        {/* Grand Total */}
        <div className="border-t-2 border-sage pt-4 mt-1">
          <div className="flex justify-between items-center">
            <span className="text-lg font-heading font-bold text-forest">
              Grand Total
            </span>
            <span className="text-2xl font-heading font-bold text-terracotta tabular-nums">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
