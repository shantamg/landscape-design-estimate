import { useCallback } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineItemAutocomplete } from "./LineItemAutocomplete";
import { formatCurrency } from "@/lib/estimate-utils";
import type { LineItem, CatalogItem, CatalogType } from "@/types";

export type SectionType = "plant" | "labor" | "material" | "designFee" | "supervision";

interface LineItemRowProps {
  item: LineItem;
  sectionType: SectionType;
  onUpdate: (updates: Partial<LineItem>) => void;
  onRemove: () => void;
  onEnterOnLast?: () => void;
  isLast?: boolean;
}

const PLANT_SIZES = [
  '4" pot',
  '6" pot',
  "#1 (1 gal)",
  "#2",
  "#3",
  "#5",
  "#7",
  "#10",
  "#15",
  "#25",
  '24" box',
  '36" box',
  "Flat",
];

const LABOR_UNITS = ["ea", "hr", "lot"];
const MATERIAL_UNITS = ["ea", "sqft", "lnft", "cuyd", "lot", "bag", "ton", "roll"];

const CATALOG_TYPE_MAP: Record<SectionType, CatalogType> = {
  plant: "plant",
  labor: "service",
  material: "material",
  designFee: "service",
  supervision: "service",
};

function NumberInput({
  value,
  onChange,
  className = "",
  min = 0,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  min?: number;
  step?: string;
}) {
  return (
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      min={min}
      step={step}
      className={`h-8 rounded border border-input bg-transparent px-2 py-1 text-sm text-right outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] ${className}`}
    />
  );
}

function UnitSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded border border-input bg-transparent px-1.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function LineItemRow({
  item,
  sectionType,
  onUpdate,
  onRemove,
  onEnterOnLast,
  isLast,
}: LineItemRowProps) {
  const lineTotal = item.quantity * item.unitPrice;

  const handleCatalogSelect = useCallback(
    (catalogItem: CatalogItem) => {
      onUpdate({
        description: catalogItem.name,
        unitPrice: catalogItem.defaultUnitPrice,
        unit: catalogItem.defaultUnit,
      });
    },
    [onUpdate]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && isLast && onEnterOnLast) {
      e.preventDefault();
      onEnterOnLast();
    }
  }

  if (sectionType === "plant") {
    return (
      <div className="grid grid-cols-[1fr_120px_60px_90px_90px_32px] gap-2 items-center" onKeyDown={handleKeyDown}>
        <LineItemAutocomplete
          value={item.description}
          onChange={(v) => onUpdate({ description: v })}
          onSelect={handleCatalogSelect}
          catalogType={CATALOG_TYPE_MAP[sectionType]}
          placeholder="Plant name..."
        />
        <select
          value={item.unit}
          onChange={(e) => onUpdate({ unit: e.target.value })}
          className="h-8 rounded border border-input bg-transparent px-1.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] cursor-pointer"
        >
          {PLANT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          <option value="ea">ea</option>
        </select>
        <NumberInput
          value={item.quantity}
          onChange={(v) => onUpdate({ quantity: v })}
          className="w-full"
          min={0}
        />
        <NumberInput
          value={item.unitPrice}
          onChange={(v) => onUpdate({ unitPrice: v })}
          className="w-full"
          step="0.01"
        />
        <div className="text-sm text-right font-medium text-forest tabular-nums pr-1">
          {formatCurrency(lineTotal)}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="text-stone hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    );
  }

  if (sectionType === "labor") {
    return (
      <div className="grid grid-cols-[1fr_60px_70px_90px_90px_32px] gap-2 items-center" onKeyDown={handleKeyDown}>
        <LineItemAutocomplete
          value={item.description}
          onChange={(v) => onUpdate({ description: v })}
          onSelect={handleCatalogSelect}
          catalogType={CATALOG_TYPE_MAP[sectionType]}
          placeholder="Service description..."
        />
        <NumberInput
          value={item.quantity}
          onChange={(v) => onUpdate({ quantity: v })}
          className="w-full"
          min={0}
        />
        <UnitSelect
          value={item.unit}
          options={LABOR_UNITS}
          onChange={(v) => onUpdate({ unit: v })}
        />
        <NumberInput
          value={item.unitPrice}
          onChange={(v) => onUpdate({ unitPrice: v })}
          className="w-full"
          step="0.01"
        />
        <div className="text-sm text-right font-medium text-forest tabular-nums pr-1">
          {formatCurrency(lineTotal)}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="text-stone hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    );
  }

  if (sectionType === "material") {
    return (
      <div className="grid grid-cols-[1fr_60px_80px_90px_90px_32px] gap-2 items-center" onKeyDown={handleKeyDown}>
        <LineItemAutocomplete
          value={item.description}
          onChange={(v) => onUpdate({ description: v })}
          onSelect={handleCatalogSelect}
          catalogType={CATALOG_TYPE_MAP[sectionType]}
          placeholder="Material description..."
        />
        <NumberInput
          value={item.quantity}
          onChange={(v) => onUpdate({ quantity: v })}
          className="w-full"
          min={0}
        />
        <UnitSelect
          value={item.unit}
          options={MATERIAL_UNITS}
          onChange={(v) => onUpdate({ unit: v })}
        />
        <NumberInput
          value={item.unitPrice}
          onChange={(v) => onUpdate({ unitPrice: v })}
          className="w-full"
          step="0.01"
        />
        <div className="text-sm text-right font-medium text-forest tabular-nums pr-1">
          {formatCurrency(lineTotal)}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="text-stone hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    );
  }

  // designFee / supervision
  return (
    <div className="grid grid-cols-[1fr_60px_70px_90px_90px_32px] gap-2 items-center" onKeyDown={handleKeyDown}>
      <input
        type="text"
        value={item.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Description..."
        className="h-8 w-full min-w-0 rounded border border-input bg-transparent px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow]"
      />
      <NumberInput
        value={item.quantity}
        onChange={(v) => onUpdate({ quantity: v })}
        className="w-full"
        min={0}
      />
      <UnitSelect
        value={item.unit || "hr"}
        options={["hr", "lot", "ea"]}
        onChange={(v) => onUpdate({ unit: v })}
      />
      <NumberInput
        value={item.unitPrice || (sectionType === "designFee" || sectionType === "supervision" ? 195 : 0)}
        onChange={(v) => onUpdate({ unitPrice: v })}
        className="w-full"
        step="0.01"
      />
      <div className="text-sm text-right font-medium text-forest tabular-nums pr-1">
        {formatCurrency(lineTotal)}
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onRemove}
        className="text-stone hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}
