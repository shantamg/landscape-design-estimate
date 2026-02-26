import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEstimate } from "@/context/EstimateContext";
import { LineItemSection } from "./LineItemSection";
import { formatCurrency, computeProjectSectionSubtotal } from "@/lib/estimate-utils";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(section.name);

  const sectionTotal = computeProjectSectionSubtotal(section);

  function handleSaveName() {
    if (editName.trim()) {
      dispatch({
        type: "UPDATE_SECTION_NAME",
        sectionId: section.id,
        name: editName.trim(),
      });
    }
    setIsEditingName(false);
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

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 bg-sage/8 border-b border-sage/15">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="shrink-0 text-sage-dark hover:bg-sage/15"
        >
          {isCollapsed ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronUp className="size-4" />
          )}
        </Button>

        {isEditingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") {
                  setEditName(section.name);
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="h-7 px-2 rounded border border-sage/30 bg-background text-sm font-heading font-bold text-forest outline-none focus-visible:border-sage focus-visible:ring-sage/30 focus-visible:ring-[3px]"
            />
            <Button variant="ghost" size="icon-xs" onClick={handleSaveName} className="text-sage hover:bg-sage/15">
              <Check className="size-3.5" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditName(section.name);
              setIsEditingName(true);
            }}
            className="flex items-center gap-1.5 group cursor-pointer"
          >
            <h3 className="text-base font-heading font-bold text-forest tracking-wide">
              {section.name}
            </h3>
            <Pencil className="size-3 text-stone opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-semibold text-forest tabular-nums">
            {formatCurrency(sectionTotal)}
          </span>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() =>
                dispatch({
                  type: "REMOVE_PROJECT_SECTION",
                  sectionId: section.id,
                })
              }
              className="text-stone hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Section Body */}
      {!isCollapsed && (
        <div className="px-6 py-5 space-y-6">
          <LineItemSection
            title="Plant Material"
            items={section.plantMaterial}
            sectionType="plant"
            onAdd={() => handleAddItem("plantMaterial")}
            onUpdate={(itemId, updates) =>
              handleUpdateItem("plantMaterial", itemId, updates)
            }
            onRemove={(itemId) => handleRemoveItem("plantMaterial", itemId)}
          />

          <div className="border-t border-stone/15" />

          <LineItemSection
            title="Labor & Services"
            items={section.laborAndServices}
            sectionType="labor"
            onAdd={() => handleAddItem("laborAndServices")}
            onUpdate={(itemId, updates) =>
              handleUpdateItem("laborAndServices", itemId, updates)
            }
            onRemove={(itemId) =>
              handleRemoveItem("laborAndServices", itemId)
            }
          />

          <div className="border-t border-stone/15" />

          <LineItemSection
            title="Other Materials"
            items={section.otherMaterials}
            sectionType="material"
            onAdd={() => handleAddItem("otherMaterials")}
            onUpdate={(itemId, updates) =>
              handleUpdateItem("otherMaterials", itemId, updates)
            }
            onRemove={(itemId) => handleRemoveItem("otherMaterials", itemId)}
          />
        </div>
      )}
    </div>
  );
}
