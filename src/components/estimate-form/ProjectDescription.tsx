import { useEstimate } from "@/context/EstimateContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ProjectDescription() {
  const { estimate, dispatch } = useEstimate();

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-xs font-semibold text-sage uppercase tracking-widest mb-4">
        Project Description
      </h3>
      <div className="space-y-1.5">
        <Label htmlFor="project-description" className="sr-only">
          Project Description
        </Label>
        <Textarea
          id="project-description"
          value={estimate.projectDescription}
          onChange={(e) =>
            dispatch({ type: "SET_PROJECT_DESCRIPTION", value: e.target.value })
          }
          placeholder="Describe the scope of work, including site conditions, client goals, and design intent..."
          rows={4}
          className="resize-y"
        />
      </div>
    </div>
  );
}
