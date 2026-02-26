import { Save, FileText, Printer, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEstimate } from "@/context/EstimateContext";
import { saveEstimate } from "@/lib/storage";
import { toast } from "sonner";

export function ActionBar() {
  const { estimate } = useEstimate();

  function handleSave() {
    saveEstimate(estimate);
    toast.success("Estimate saved");
  }

  return (
    <div className="sticky bottom-0 z-10 flex items-center gap-3 px-5 py-3 bg-card border-t border-border rounded-b-lg shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <Button onClick={handleSave} className="gap-2">
        <Save className="size-4" />
        Save
      </Button>
      <Button variant="outline" disabled className="gap-2">
        <FileText className="size-4" />
        Preview PDF
      </Button>
      <Button variant="outline" disabled className="gap-2">
        <FileText className="size-4" />
        Export PDF
      </Button>
      <Button
        variant="outline"
        onClick={() => window.print()}
        className="gap-2"
      >
        <Printer className="size-4" />
        Print
      </Button>
      <Button variant="outline" disabled className="gap-2">
        <Copy className="size-4" />
        Create Revision
      </Button>
    </div>
  );
}
