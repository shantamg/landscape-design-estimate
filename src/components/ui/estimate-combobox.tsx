import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCurrency, formatDate, computeGrandTotal } from "@/lib/estimate-utils";
import type { Estimate } from "@/types";

interface EstimateComboboxProps {
  estimates: Estimate[];
  value: string; // selected estimate ID
  onValueChange: (id: string) => void;
  placeholder?: string;
}

export function EstimateCombobox({
  estimates,
  value,
  onValueChange,
  placeholder = "Search estimates...",
}: EstimateComboboxProps) {
  const [open, setOpen] = useState(false);

  const selected = estimates.find((e) => e.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-auto py-2"
        >
          {selected ? (
            <span className="truncate text-left">
              <span className="font-medium">{selected.estimateNumber}</span>
              {" — "}
              {selected.client.name || "Unnamed"}
              <span className="text-muted-foreground ml-1">
                ({formatDate(selected.createdAt)})
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search by client, number, or address..." />
          <CommandList>
            <CommandEmpty>No estimates found.</CommandEmpty>
            <CommandGroup>
              {estimates.map((est) => {
                const total = computeGrandTotal(est);
                return (
                  <CommandItem
                    key={est.id}
                    value={`${est.estimateNumber} ${est.client.name} ${est.client.address}`}
                    onSelect={() => {
                      onValueChange(est.id);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between gap-2 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{est.estimateNumber}</span>
                        <Check
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            value === est.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {est.client.name || est.client.address || "No client"}
                        {" — "}
                        {formatDate(est.createdAt)}
                      </div>
                    </div>
                    <span className="text-xs font-medium tabular-nums text-terracotta shrink-0">
                      {formatCurrency(total)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
