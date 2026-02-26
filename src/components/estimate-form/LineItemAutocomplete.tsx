import { useState, useRef, useEffect, useCallback } from "react";
import { loadCatalog } from "@/lib/storage";
import { filterCatalog } from "@/lib/catalog-filter";
import { formatCurrency } from "@/lib/estimate-utils";
import type { CatalogItem, CatalogType } from "@/types";

interface LineItemAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: CatalogItem) => void;
  catalogType: CatalogType;
  placeholder?: string;
}

export function LineItemAutocomplete({
  value,
  onChange,
  onSelect,
  catalogType,
  placeholder = "Type to search or enter description...",
}: LineItemAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CatalogItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(
    (query: string) => {
      const catalog = loadCatalog(catalogType);
      const filtered = filterCatalog(catalog, query, catalogType);
      setResults(filtered);
      setIsOpen(filtered.length > 0 && query.length >= 2);
      setSelectedIndex(-1);
    },
    [catalogType]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    search(val);
  }

  function handleSelectItem(item: CatalogItem) {
    onSelect(item);
    onChange(item.name);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectItem(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value.length >= 2) search(value);
        }}
        placeholder={placeholder}
        className="h-8 w-full min-w-0 rounded border border-input bg-transparent px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow]"
      />
      {isOpen && results.length > 0 && (
        <div
          ref={listRef}
          className="absolute top-full left-0 z-50 mt-1 w-72 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md"
        >
          {results.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between gap-2 hover:bg-accent cursor-pointer ${
                index === selectedIndex ? "bg-accent" : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectItem(item);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="truncate">{item.name}</span>
              <span className="text-muted-foreground text-xs shrink-0">
                {formatCurrency(item.defaultUnitPrice)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
