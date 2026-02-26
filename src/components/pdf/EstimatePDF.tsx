import { Document, Page, Font } from "@react-pdf/renderer";
import type { Estimate, CompanyInfo } from "@/types";
import { styles } from "./pdf-styles";
import { PDFHeader } from "./PDFHeader";
import { PDFClientInfo } from "./PDFClientInfo";
import { PDFProjectDescription } from "./PDFProjectDescription";
import {
  PDFProjectSection,
  PDFDesignFeeSection,
} from "./PDFLineItemTable";
import { PDFSummary } from "./PDFSummary";
import { PDFFooter } from "./PDFFooter";
import { computeProjectSectionSubtotal } from "@/lib/estimate-utils";

// --- Font Registration ---
import CormorantRegular from "@/assets/fonts/CormorantGaramond-Regular.ttf";
import CormorantBold from "@/assets/fonts/CormorantGaramond-Bold.ttf";
import CormorantItalic from "@/assets/fonts/CormorantGaramond-Italic.ttf";
import SourceSansRegular from "@/assets/fonts/SourceSans3-Regular.ttf";
import SourceSansSemiBold from "@/assets/fonts/SourceSans3-SemiBold.ttf";
import SourceSansBold from "@/assets/fonts/SourceSans3-Bold.ttf";

Font.register({
  family: "Cormorant Garamond",
  fonts: [
    { src: CormorantRegular },
    { src: CormorantBold, fontWeight: "bold" },
    { src: CormorantItalic, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Source Sans 3",
  fonts: [
    { src: SourceSansRegular },
    { src: SourceSansSemiBold, fontWeight: 600 },
    { src: SourceSansBold, fontWeight: "bold" },
  ],
});

// Disable hyphenation for cleaner layout
Font.registerHyphenationCallback((word) => [word]);

// --- Component ---

interface EstimatePDFProps {
  estimate: Estimate;
  company: CompanyInfo;
}

export function EstimatePDF({ estimate, company }: EstimatePDFProps) {
  return (
    <Document
      title={`Estimate ${estimate.estimateNumber}`}
      author={company.name}
      subject={`Landscape estimate for ${estimate.client.name || estimate.client.address}`}
    >
      <Page size="LETTER" style={styles.page}>
        {/* Letterhead */}
        <PDFHeader company={company} isFirstPage={true} />

        {/* Client info + estimate details */}
        <PDFClientInfo
          client={estimate.client}
          estimateNumber={estimate.estimateNumber}
          createdAt={estimate.createdAt}
          validDays={estimate.validDays}
        />

        {/* Project description */}
        <PDFProjectDescription description={estimate.projectDescription} />

        {/* Project sections (Backyard, Upper Terrace, Front of House, etc.) */}
        {estimate.projectSections.map((section) => (
          <PDFProjectSection
            key={section.id}
            sectionName={section.name}
            plantMaterial={section.plantMaterial}
            laborAndServices={section.laborAndServices}
            otherMaterials={section.otherMaterials}
            sectionTotal={computeProjectSectionSubtotal(section)}
          />
        ))}

        {/* Design Fee section */}
        <PDFDesignFeeSection items={estimate.designFee} />

        {/* Cost Summary */}
        <PDFSummary estimate={estimate} />

        {/* Footer on every page */}
        <PDFFooter companyName={company.name} estimateNumber={estimate.estimateNumber} />
      </Page>
    </Document>
  );
}
