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
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-forest uppercase tracking-wide mb-4">
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
              <span>{formatCurrency(sectionTotal)}</span>
            </div>
          );
        })}

        {estimate.projectSections.length > 1 && (
          <div className="border-t border-border pt-2" />
        )}

        {/* Category breakdowns */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plant Material</span>
          <span>{formatCurrency(plantTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Labor & Services</span>
          <span>{formatCurrency(laborTotal)}</span>
        </div>
        {materialsTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Other Materials</span>
            <span>{formatCurrency(materialsTotal)}</span>
          </div>
        )}
        {designFeeTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Design Fee</span>
            <span>{formatCurrency(designFeeTotal)}</span>
          </div>
        )}

        <div className="border-t border-border pt-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
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
          <span>{formatCurrency(tax)}</span>
        </div>

        {/* Grand Total */}
        <div className="border-t-2 border-forest pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-heading font-bold text-forest">
              Grand Total
            </span>
            <span className="text-xl font-heading font-bold text-forest">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
