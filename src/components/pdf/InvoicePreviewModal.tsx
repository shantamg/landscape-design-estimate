import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";
import { loadSettings } from "@/lib/storage";
import type { Invoice } from "@/types";
import { Download } from "lucide-react";

interface InvoicePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  estimateNumber?: string;
}

export function InvoicePreviewModal({
  open,
  onOpenChange,
  invoice,
  estimateNumber,
}: InvoicePreviewModalProps) {
  const [downloading, setDownloading] = useState(false);
  const settings = loadSettings();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await pdf(
        <InvoicePDF
          invoice={invoice}
          company={settings.company}
          estimateNumber={estimateNumber}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${invoice.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-heading">
            Invoice Preview - {invoice.invoiceNumber}
          </DialogTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="size-4" />
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <InvoicePDF
              invoice={invoice}
              company={settings.company}
              estimateNumber={estimateNumber}
            />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
