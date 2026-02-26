import { useCallback } from "react";
import { Trash2, DollarSign } from "lucide-react";
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
  "1 gal",
  "5 gal",
  "7 gal",
  "15 gal",
  '24" box',
  '36" box',
  "Flats",
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
  isCurrency = false,
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  min?: number;
  step?: string;
  isCurrency?: boolean;
}) {
  const inputClass = `h-8 rounded border border-input bg-transparent py-1 text-sm text-right outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] ${isCurrency ? "pl-5 pr-2" : "px-2"} ${className}`;

  function sanitize(raw: string): number {
    // Strip $, commas, spaces, and any other non-numeric chars except . and -
    const cleaned = raw.replace(/[^0-9.\-]/g, "");
    return parseFloat(cleaned) || 0;
  }

  return (
    <div className={isCurrency ? "relative" : undefined}>
      {isCurrency && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          $
        </span>
      )}
      <input
        type="text"
        inputMode="decimal"
        value={value || ""}
        onChange={(e) => onChange(sanitize(e.target.value))}
        className={inputClass}
      />
    </div>
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
          isCurrency
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
      <div className="grid grid-cols-[1fr_60px_70px_90px_90px_56px] gap-2 items-center" onKeyDown={handleKeyDown}>
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
        {item.noPrice ? (
          <>
            <div className="col-span-2 text-[10px] text-stone italic text-right pr-1">
              no price
            </div>
          </>
        ) : (
          <>
            <NumberInput
              value={item.unitPrice}
              onChange={(v) => onUpdate({ unitPrice: v })}
              className="w-full"
              isCurrency
            />
            <div className="text-sm text-right font-medium text-forest tabular-nums pr-1">
              {formatCurrency(lineTotal)}
            </div>
          </>
        )}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onUpdate({ noPrice: !item.noPrice, unitPrice: item.noPrice ? item.unitPrice : 0 })}
            className={item.noPrice ? "text-sage hover:text-sage-dark hover:bg-sage/10" : "text-stone hover:text-sage hover:bg-sage/10"}
            title={item.noPrice ? "Add price to this line" : "Remove price (description only)"}
          >
            <DollarSign className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            className="text-stone hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
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
          isCurrency
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
        isCurrency
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
