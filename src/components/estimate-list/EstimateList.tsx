import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EstimateCard } from "./EstimateCard";
import {
  listEstimates,
  deleteEstimate,
  saveEstimate,
  loadEstimate,
} from "@/lib/storage";
import type { Estimate } from "@/types";
import { sampleEstimate } from "@/data/sample-estimate";
import { toast } from "sonner";

interface EstimateListProps {
  onOpenEstimate: (id: string) => void;
  onNewEstimate: () => void;
  onCreateContract?: (estimateId: string) => void;
  onDuplicate?: (id: string) => void;
}

export function EstimateList({
  onOpenEstimate,
  onNewEstimate,
  onCreateContract,
  onDuplicate,
}: EstimateListProps) {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshList = useCallback(() => {
    setEstimates(listEstimates());
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  function handleDelete(id: string) {
    if (!window.confirm("Delete this estimate? This cannot be undone.")) return;
    deleteEstimate(id);
    refreshList();
    toast.success("Estimate deleted");
  }

  function handleDuplicate(id: string) {
    onDuplicate?.(id);
    // Refresh to show the duplicate
    setTimeout(refreshList, 50);
  }

  function handleCreateContract(id: string) {
    onCreateContract?.(id);
  }

  function handleLoadSample() {
    const existing = loadEstimate(sampleEstimate.id);
    if (existing) {
      toast.info("Sample estimate already loaded.");
      return;
    }
    const now = new Date().toISOString();
    saveEstimate({ ...sampleEstimate, createdAt: now, updatedAt: now });
    refreshList();
    toast.success("Sample estimate loaded — 200 S. Bentley Ave");
  }

  // Filter by search
  const filtered = estimates.filter((est) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      est.estimateNumber.toLowerCase().includes(query) ||
      est.client.name.toLowerCase().includes(query) ||
      est.client.address.toLowerCase().includes(query)
    );
  });

  // Sort by most recently updated
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by client name, address, or estimate number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleLoadSample}
            className="text-stone hover:text-forest"
          >
            Load Sample Estimate
          </Button>
          <Button
            onClick={onNewEstimate}
            className="bg-sage hover:bg-sage-dark"
          >
            + New Estimate
          </Button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-sage/20 p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-sage text-lg font-heading font-bold">NL</span>
          </div>
          <p className="text-muted-foreground mb-1">
            {searchQuery
              ? "No estimates match your search."
              : "No saved estimates yet."}
          </p>
          {!searchQuery && (
            <>
              <p className="text-sm text-stone mb-4">Get started by creating your first estimate.</p>
              <Button
                onClick={onNewEstimate}
                className="bg-sage hover:bg-sage-dark"
              >
                Create First Estimate
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((est) => (
            <EstimateCard
              key={est.id}
              estimate={est}
              onOpen={onOpenEstimate}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onCreateContract={handleCreateContract}
            />
          ))}
        </div>
      )}
    </div>
  );
}
