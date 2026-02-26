import { useState } from "react";
import { PDFViewer, BlobProvider } from "@react-pdf/renderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Estimate, CompanyInfo } from "@/types";
import { EstimatePDF } from "./EstimatePDF";
import { FileDown, Eye } from "lucide-react";

interface PDFPreviewModalProps {
  estimate: Estimate;
  company: CompanyInfo;
  trigger?: React.ReactNode;
}

export function PDFPreviewModal({
  estimate,
  company,
  trigger,
}: PDFPreviewModalProps) {
  const [open, setOpen] = useState(false);

  const pdfDoc = <EstimatePDF estimate={estimate} company={company} />;
  const fileName = `${estimate.estimateNumber}-estimate.pdf`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col" showCloseButton={false}>
        <DialogHeader className="flex-none">
          <div className="flex items-center justify-between">
            <DialogTitle>
              Estimate Preview &mdash; {estimate.estimateNumber}
            </DialogTitle>
            <BlobProvider document={pdfDoc}>
              {({ blob, loading }) => (
                <Button
                  variant="default"
                  size="sm"
                  disabled={loading || !blob}
                  onClick={() => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  {loading ? "Generating..." : "Download PDF"}
                </Button>
              )}
            </BlobProvider>
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0 rounded-md overflow-hidden border border-border">
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            {pdfDoc}
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
