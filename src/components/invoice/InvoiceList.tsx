import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InvoiceCard } from "./InvoiceCard";
import { listInvoices, deleteInvoice } from "@/lib/storage";
import type { Invoice } from "@/types";
import { toast } from "sonner";

interface InvoiceListProps {
  onOpenInvoice: (id: string) => void;
  onNewInvoice: () => void;
}

export function InvoiceList({ onOpenInvoice, onNewInvoice }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshList = useCallback(() => {
    setInvoices(listInvoices());
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  function handleDelete(id: string) {
    if (!window.confirm("Delete this invoice? This cannot be undone.")) return;
    deleteInvoice(id);
    refreshList();
    toast.success("Invoice deleted");
  }

  const filtered = invoices.filter((inv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(query) ||
      inv.client.name.toLowerCase().includes(query) ||
      inv.client.address.toLowerCase().includes(query)
    );
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by client name, address, or invoice number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-sage/20 p-16 text-center">
          <img src="/logo.png" alt="Nancy Lyons Garden Design" className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground mb-1">
            {searchQuery ? "No invoices match your search." : "No invoices yet."}
          </p>
          {!searchQuery && (
            <>
              <p className="text-sm text-stone mb-4">
                Create an invoice from the New Invoice tab or from a saved estimate.
              </p>
              <Button
                onClick={onNewInvoice}
                className="bg-sage hover:bg-sage-dark"
              >
                Create First Invoice
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((inv) => (
            <InvoiceCard
              key={inv.id}
              invoice={inv}
              onOpen={onOpenInvoice}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
