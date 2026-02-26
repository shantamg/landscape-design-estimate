import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEstimate } from "@/context/EstimateContext";
import { useAutoSave } from "@/hooks/useAutoSave";
import { saveEstimate } from "@/lib/storage";
import { formatCurrency, computeSectionSubtotal } from "@/lib/estimate-utils";
import { toast } from "sonner";
import { CompanyHeader } from "./CompanyHeader";
import { EstimateMetadata } from "./EstimateMetadata";
import { ClientInfoSection } from "./ClientInfoSection";
import { ProjectDescription } from "./ProjectDescription";
import { ProjectSectionEditor } from "./ProjectSectionEditor";
import { LineItemSection } from "./LineItemSection";
import { TotalsSection } from "./TotalsSection";
import type { LineItem } from "@/types";

export function EstimateForm() {
  const { estimate, dispatch } = useEstimate();

  // Auto-save to localStorage
  useAutoSave(estimate);

  function handleAddSection() {
    dispatch({ type: "ADD_PROJECT_SECTION", name: "New Section" });
  }

  function handleSave() {
    saveEstimate(estimate);
    toast.success("Estimate saved");
  }

  // Design fee handlers
  function handleAddDesignFeeItem() {
    dispatch({ type: "ADD_DESIGN_FEE_ITEM" });
  }

  function handleUpdateDesignFeeItem(
    itemId: string,
    updates: Partial<LineItem>
  ) {
    dispatch({ type: "UPDATE_DESIGN_FEE_ITEM", itemId, updates });
  }

  function handleRemoveDesignFeeItem(itemId: string) {
    dispatch({ type: "REMOVE_DESIGN_FEE_ITEM", itemId });
  }

  const designFeeSubtotal = computeSectionSubtotal(estimate.designFee);

  return (
    <div className="space-y-6">
      <CompanyHeader />

      <Separator />

      <EstimateMetadata />

      <Separator />

      <ClientInfoSection />

      <Separator />

      <ProjectDescription />

      <Separator />

      {/* Project Sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-forest">
          Project Sections
        </h3>

        {estimate.projectSections.map((section) => (
          <ProjectSectionEditor
            key={section.id}
            section={section}
            canDelete={estimate.projectSections.length > 1}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddSection}
          className="w-full border-dashed"
        >
          + Add Project Section
        </Button>
      </div>

      <Separator />

      {/* Design Fee (FOURTH per Nancy's spec - separate section) */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-forest">
            Design Fee
          </h3>
          {designFeeSubtotal > 0 && (
            <span className="text-sm font-medium tabular-nums">
              {formatCurrency(designFeeSubtotal)}
            </span>
          )}
        </div>

        <LineItemSection
          title=""
          items={estimate.designFee}
          catalogType="service"
          onAdd={handleAddDesignFeeItem}
          onUpdate={handleUpdateDesignFeeItem}
          onRemove={handleRemoveDesignFeeItem}
        />
      </div>

      <Separator />

      {/* Totals */}
      <TotalsSection />

      {/* Action Bar */}
      <div className="flex items-center gap-3 py-4 sticky bottom-0 bg-background/95 backdrop-blur border-t border-border -mx-6 px-6">
        <Button onClick={handleSave} className="bg-sage hover:bg-sage-dark">
          Save Estimate
        </Button>
        <Button variant="outline" disabled>
          Preview PDF
        </Button>
        <Button variant="outline" disabled>
          Export PDF
        </Button>
      </div>
    </div>
  );
}
