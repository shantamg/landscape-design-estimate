import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { ContractPDF } from "./ContractPDF";
import { loadSettings } from "@/lib/storage";
import type { Contract } from "@/types";
import { Download } from "lucide-react";

interface PaymentItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ContractPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract;
  estimateNumber: string;
  estimateDate: string;
  grandTotal: number;
  paymentItems: PaymentItem[];
  paymentMethodsNote: string;
  changeOrders: string;
  validDays: number;
}

export function ContractPreviewModal({
  open,
  onOpenChange,
  contract,
  estimateNumber,
  estimateDate,
  grandTotal,
  paymentItems,
  paymentMethodsNote,
  changeOrders,
  validDays,
}: ContractPreviewModalProps) {
  const [downloading, setDownloading] = useState(false);
  const settings = loadSettings();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await pdf(
        <ContractPDF
          contract={contract}
          company={settings.company}
          estimateNumber={estimateNumber}
          estimateDate={estimateDate}
          grandTotal={grandTotal}
          paymentItems={paymentItems}
          paymentMethodsNote={paymentMethodsNote}
          changeOrders={changeOrders}
          validDays={validDays}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Contract-${contract.contractNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-heading">
            Contract Preview - {contract.contractNumber}
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
            <ContractPDF
              contract={contract}
              company={settings.company}
              estimateNumber={estimateNumber}
              estimateDate={estimateDate}
              grandTotal={grandTotal}
              paymentItems={paymentItems}
              paymentMethodsNote={paymentMethodsNote}
              changeOrders={changeOrders}
              validDays={validDays}
            />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
