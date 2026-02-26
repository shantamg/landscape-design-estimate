import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEstimate } from "@/context/EstimateContext";
import { CompanyHeader } from "./CompanyHeader";
import { EstimateMetadata } from "./EstimateMetadata";
import { ClientInfoSection } from "./ClientInfoSection";
import { ProjectDescription } from "./ProjectDescription";
import { ProjectSectionEditor } from "./ProjectSectionEditor";
import { DesignFeeSection } from "./DesignFeeSection";
import { TotalsSection } from "./TotalsSection";
import { ActionBar } from "./ActionBar";

interface EstimateFormProps {
  onRevisionCreated?: (id: string) => void;
}

export function EstimateForm({ onRevisionCreated }: EstimateFormProps) {
  const { estimate, dispatch } = useEstimate();

  return (
    <div className="space-y-6">
      <CompanyHeader />

      <EstimateMetadata />

      <ClientInfoSection />

      <ProjectDescription />

      {/* Project Sections */}
      <div className="space-y-4">
        {estimate.projectSections.map((section) => (
          <ProjectSectionEditor
            key={section.id}
            section={section}
            canDelete={estimate.projectSections.length > 1}
          />
        ))}

        <Button
          variant="outline"
          onClick={() => dispatch({ type: "ADD_PROJECT_SECTION" })}
          className="gap-2 border-dashed border-sage/40 text-sage hover:text-sage-dark hover:border-sage"
        >
          <Plus className="size-4" />
          Add Project Section
        </Button>
      </div>

      {/* Design Fee */}
      <DesignFeeSection />

      {/* Totals */}
      <TotalsSection />

      {/* Action Bar */}
      <ActionBar onRevisionCreated={onRevisionCreated} />
    </div>
  );
}
