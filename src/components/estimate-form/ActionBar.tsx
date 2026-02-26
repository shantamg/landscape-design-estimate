import { useState } from "react";
import { Save, FileText, Printer, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEstimate } from "@/context/EstimateContext";
import { saveEstimate, loadSettings, duplicateEstimate } from "@/lib/storage";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { EstimatePDF } from "@/components/pdf/EstimatePDF";
import { PDFPreviewModal } from "@/components/pdf/PDFPreviewModal";

interface ActionBarProps {
  onRevisionCreated?: (id: string) => void;
}

export function ActionBar({ onRevisionCreated }: ActionBarProps) {
  const { estimate } = useEstimate();
  const [exporting, setExporting] = useState(false);

  function validate(): boolean {
    if (!estimate.client.name.trim() && !estimate.client.address.trim()) {
      toast.error("Client name or address is required before saving.");
      return false;
    }
    const hasItems =
      estimate.projectSections.some(
        (s) =>
          s.plantMaterial.length > 0 ||
          s.laborAndServices.length > 0 ||
          s.otherMaterials.length > 0
      ) || estimate.designFee.length > 0;
    if (!hasItems) {
      toast.error("Add at least one line item before saving.");
      return false;
    }
    return true;
  }

  function handleSave() {
    if (!validate()) return;
    try {
      saveEstimate(estimate);
      toast.success("Estimate saved");
    } catch (err) {
      if (
        err instanceof DOMException &&
        err.name === "QuotaExceededError"
      ) {
        toast.error(
          "Storage is full. Export your data and clear old estimates."
        );
      } else {
        toast.error("Failed to save estimate.");
      }
    }
  }

  async function handleExportPDF() {
    if (!estimate.client.name.trim() && !estimate.client.address.trim()) {
      toast.error("Add a client name or address before exporting.");
      return;
    }
    setExporting(true);
    try {
      const settings = loadSettings();
      const blob = await pdf(
        <EstimatePDF estimate={estimate} company={settings.company} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${estimate.estimateNumber}-estimate.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF exported");
    } catch {
      toast.error("Failed to generate PDF.");
    } finally {
      setExporting(false);
    }
  }

  function handleCreateRevision() {
    // Save current first
    try {
      saveEstimate(estimate);
    } catch {
      toast.error("Failed to save before creating revision.");
      return;
    }
    const dup = duplicateEstimate(estimate.id);
    if (dup) {
      toast.success(`Revision created: ${dup.estimateNumber}`);
      onRevisionCreated?.(dup.id);
    } else {
      toast.error("Failed to create revision.");
    }
  }

  const settings = loadSettings();

  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-3 px-6 py-4 bg-card/95 backdrop-blur-sm border-t-2 border-sage/20 rounded-b-lg shadow-[0_-4px_12px_rgba(0,0,0,0.08)] print:hidden">
      <Button onClick={handleSave} className="gap-2 bg-sage hover:bg-sage-dark">
        <Save className="size-4" />
        Save
      </Button>
      <PDFPreviewModal
        estimate={estimate}
        company={settings.company}
        trigger={
          <Button variant="outline" className="gap-2">
            <FileText className="size-4" />
            Preview PDF
          </Button>
        }
      />
      <Button
        variant="outline"
        onClick={handleExportPDF}
        disabled={exporting}
        className="gap-2 border-terracotta/30 text-terracotta hover:bg-terracotta/10 hover:text-terracotta"
      >
        <Download className="size-4" />
        {exporting ? "Exporting..." : "Export PDF"}
      </Button>
      <div className="hidden sm:block w-px h-6 bg-border" />
      <Button
        variant="ghost"
        onClick={() => window.print()}
        className="gap-2 text-muted-foreground"
      >
        <Printer className="size-4" />
        Print
      </Button>
      <Button
        variant="ghost"
        onClick={handleCreateRevision}
        className="gap-2 text-muted-foreground"
      >
        <Copy className="size-4" />
        Revision
      </Button>
    </div>
  );
}
