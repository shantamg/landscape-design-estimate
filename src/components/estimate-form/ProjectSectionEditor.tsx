import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LineItemSection } from "./LineItemSection";
import { useEstimate } from "@/context/EstimateContext";
import {
  formatCurrency,
  computeProjectSectionSubtotal,
} from "@/lib/estimate-utils";
import type { ProjectSection, LineItem } from "@/types";

interface ProjectSectionEditorProps {
  section: ProjectSection;
  canDelete: boolean;
}

export function ProjectSectionEditor({
  section,
  canDelete,
}: ProjectSectionEditorProps) {
  const { dispatch } = useEstimate();

  function handleUpdateName(name: string) {
    dispatch({ type: "UPDATE_SECTION_NAME", sectionId: section.id, name });
  }

  function handleAddItem(
    listKey: "plantMaterial" | "laborAndServices" | "otherMaterials"
  ) {
    dispatch({ type: "ADD_LINE_ITEM", sectionId: section.id, listKey });
  }

  function handleUpdateItem(
    listKey: "plantMaterial" | "laborAndServices" | "otherMaterials",
    itemId: string,
    updates: Partial<LineItem>
  ) {
    dispatch({
      type: "UPDATE_LINE_ITEM",
      sectionId: section.id,
      listKey,
      itemId,
      updates,
    });
  }

  function handleRemoveItem(
    listKey: "plantMaterial" | "laborAndServices" | "otherMaterials",
    itemId: string
  ) {
    dispatch({
      type: "REMOVE_LINE_ITEM",
      sectionId: section.id,
      listKey,
      itemId,
    });
  }

  function handleDeleteSection() {
    dispatch({ type: "REMOVE_PROJECT_SECTION", sectionId: section.id });
  }

  const sectionTotal = computeProjectSectionSubtotal(section);

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <Input
          value={section.name}
          onChange={(e) => handleUpdateName(e.target.value)}
          className="text-lg font-heading font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0 bg-transparent"
          placeholder="Section name (e.g., Backyard)"
        />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums whitespace-nowrap">
            Section: {formatCurrency(sectionTotal)}
          </span>
          {canDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDeleteSection}
              className="text-destructive hover:text-destructive"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Plant Material (FIRST per Nancy's spec) */}
      <LineItemSection
        title="Plant Material"
        items={section.plantMaterial}
        catalogType="plant"
        onAdd={() => handleAddItem("plantMaterial")}
        onUpdate={(itemId, updates) =>
          handleUpdateItem("plantMaterial", itemId, updates)
        }
        onRemove={(itemId) => handleRemoveItem("plantMaterial", itemId)}
      />

      <Separator className="my-2" />

      {/* Labor & Services (SECOND) */}
      <LineItemSection
        title="Labor & Services"
        items={section.laborAndServices}
        catalogType="service"
        onAdd={() => handleAddItem("laborAndServices")}
        onUpdate={(itemId, updates) =>
          handleUpdateItem("laborAndServices", itemId, updates)
        }
        onRemove={(itemId) => handleRemoveItem("laborAndServices", itemId)}
      />

      <Separator className="my-2" />

      {/* Other Materials (THIRD) */}
      <LineItemSection
        title="Other Materials"
        items={section.otherMaterials}
        catalogType="material"
        onAdd={() => handleAddItem("otherMaterials")}
        onUpdate={(itemId, updates) =>
          handleUpdateItem("otherMaterials", itemId, updates)
        }
        onRemove={(itemId) => handleRemoveItem("otherMaterials", itemId)}
      />
    </div>
  );
}
