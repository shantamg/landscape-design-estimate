import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Contract, CompanyInfo } from "@/types";
import { PDFHeader } from "./PDFHeader";
import { colors, page } from "./pdf-styles";
import { formatCurrency, formatDate } from "@/lib/estimate-utils";

// Register fonts (same as estimate PDF)
import CormorantRegular from "@/assets/fonts/CormorantGaramond-Regular.ttf";
import CormorantBold from "@/assets/fonts/CormorantGaramond-Bold.ttf";
import CormorantItalic from "@/assets/fonts/CormorantGaramond-Italic.ttf";
import SourceSansRegular from "@/assets/fonts/SourceSans3-Regular.ttf";
import SourceSansSemiBold from "@/assets/fonts/SourceSans3-SemiBold.ttf";
import SourceSansBold from "@/assets/fonts/SourceSans3-Bold.ttf";

Font.register({
  family: "Cormorant Garamond",
  fonts: [
    { src: CormorantRegular, fontWeight: "normal" },
    { src: CormorantBold, fontWeight: "bold" },
    { src: CormorantItalic, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Source Sans 3",
  fonts: [
    { src: SourceSansRegular, fontWeight: "normal" },
    { src: SourceSansSemiBold, fontWeight: 600 },
    { src: SourceSansBold, fontWeight: "bold" },
  ],
});

// Hyphenation callback
Font.registerHyphenationCallback((word) => [word]);

interface PaymentItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ContractPDFProps {
  contract: Contract;
  company: CompanyInfo;
  estimateNumber: string;
  estimateDate: string;
  grandTotal: number;
  paymentItems: PaymentItem[];
  paymentMethodsNote: string;
  changeOrders: string;
  validDays: number;
}

// --- Styles ---
const s = StyleSheet.create({
  page: {
    width: page.width,
    height: page.height,
    paddingTop: page.marginTop,
    paddingBottom: page.marginBottom + 20,
    paddingLeft: page.marginLeft,
    paddingRight: page.marginRight,
    backgroundColor: colors.white,
    fontFamily: "Source Sans 3",
    fontSize: 10,
    color: colors.deepForest,
  },
  title: {
    fontFamily: "Cormorant Garamond",
    fontSize: 22,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 6,
  },
  // Client info
  clientSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  clientLeft: {
    flex: 1,
  },
  clientRight: {
    width: 180,
    alignItems: "flex-end",
  },
  clientLabel: {
    fontFamily: "Cormorant Garamond",
    fontSize: 9,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.deepForest,
    marginBottom: 2,
  },
  clientDetail: {
    fontSize: 9.5,
    color: colors.deepForest,
    marginBottom: 1,
  },
  contractNumberLabel: {
    fontFamily: "Cormorant Garamond",
    fontSize: 9,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: "right",
  },
  contractNumberValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.deepForest,
    textAlign: "right",
    marginBottom: 2,
  },
  metaDetail: {
    fontSize: 9,
    color: colors.warmStone,
    textAlign: "right",
    marginBottom: 1,
  },
  // Reference line
  referenceBox: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sageGreen,
    borderRadius: 4,
    padding: 12,
    marginBottom: 18,
  },
  referenceText: {
    fontSize: 10,
    color: colors.deepForest,
    lineHeight: 1.5,
  },
  referenceBold: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.deepForest,
  },
  // Section headers
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontFamily: "Cormorant Garamond",
    fontSize: 14,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
  },
  sectionLeaderDots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmStone,
    borderBottomStyle: "dotted" as const,
    marginLeft: 6,
    marginBottom: 2,
  },
  // Body text
  bodyText: {
    fontSize: 9.5,
    color: colors.deepForest,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  bodyTextBold: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: colors.deepForest,
    lineHeight: 1.6,
    marginBottom: 2,
    marginTop: 6,
  },
  bulletItem: {
    fontSize: 9.5,
    color: colors.deepForest,
    lineHeight: 1.6,
    paddingLeft: 12,
    marginBottom: 1,
  },
  // Signature block
  signatureSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: colors.sageGreen,
    paddingTop: 16,
  },
  signatureIntro: {
    fontSize: 10,
    color: colors.deepForest,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  signatureIntroWarm: {
    fontFamily: "Cormorant Garamond",
    fontSize: 11,
    color: colors.deepForest,
    fontStyle: "italic",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  signatureLabel: {
    fontSize: 9,
    color: colors.warmStone,
    marginBottom: 2,
  },
  signatureLine: {
    borderBottomWidth: 0.75,
    borderBottomColor: colors.deepForest,
  },
  signatureBlock: {
    width: "48%",
  },
  companySignatureName: {
    fontFamily: "Cormorant Garamond",
    fontSize: 11,
    fontWeight: "bold",
    color: colors.deepForest,
    marginBottom: 4,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: page.marginLeft,
    right: page.marginRight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: colors.warmStone,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: colors.warmStone,
  },
});

// --- Helper: Parse multi-paragraph text with bold sub-headers ---
function renderFormattedText(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Bullet items
    if (line.startsWith("- ")) {
      elements.push(
        <Text key={i} style={s.bulletItem}>
          {"\u2022  "}{line.slice(2)}
        </Text>
      );
      continue;
    }

    // Check if next line is content (this line could be a sub-header)
    // A sub-header is a short line (< 60 chars) followed by a longer line
    const nextLine = i + 1 < lines.length ? lines[i + 1]?.trim() : "";
    const isSubHeader =
      line.length < 60 &&
      !line.startsWith("-") &&
      nextLine &&
      nextLine.length > 0 &&
      !nextLine.startsWith("-") &&
      // Don't treat lines that look like regular sentences as headers
      !line.endsWith(".") &&
      !line.endsWith("!") &&
      !line.endsWith(",");

    if (isSubHeader) {
      elements.push(
        <Text key={i} style={s.bodyTextBold}>
          {line}
        </Text>
      );
    } else {
      elements.push(
        <Text key={i} style={s.bodyText}>
          {line}
        </Text>
      );
    }
  }

  return elements;
}

export function ContractPDF({
  contract,
  company,
  estimateNumber,
  estimateDate,
  grandTotal,
  paymentItems,
  paymentMethodsNote,
  changeOrders,
  validDays,
}: ContractPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={s.page} wrap>
        {/* Company Header */}
        <PDFHeader company={company} isFirstPage={true} />

        {/* Title */}
        <Text style={s.title}>
          LANDSCAPE DESIGN & INSTALLATION CONTRACT
        </Text>

        {/* Client Info + Contract Meta */}
        <View style={s.clientSection}>
          <View style={s.clientLeft}>
            <Text style={s.clientLabel}>PREPARED FOR</Text>
            <Text style={s.clientName}>{contract.client.name}</Text>
            {contract.client.address && (
              <Text style={s.clientDetail}>{contract.client.address}</Text>
            )}
            <Text style={s.clientDetail}>
              {[contract.client.city, contract.client.state, contract.client.zip]
                .filter(Boolean)
                .join(", ")}
            </Text>
            {contract.client.phone && (
              <Text style={s.clientDetail}>{contract.client.phone}</Text>
            )}
            {contract.client.email && (
              <Text style={s.clientDetail}>{contract.client.email}</Text>
            )}
          </View>
          <View style={s.clientRight}>
            <Text style={s.contractNumberLabel}>CONTRACT</Text>
            <Text style={s.contractNumberValue}>
              {contract.contractNumber}
            </Text>
            <Text style={s.metaDetail}>
              Date: {formatDate(contract.createdAt)}
            </Text>
          </View>
        </View>

        {/* Estimate Reference */}
        <View style={s.referenceBox}>
          <Text style={s.referenceText}>
            This contract is for the work described in Estimate{" "}
            <Text style={s.referenceBold}>{estimateNumber}</Text> dated{" "}
            <Text style={s.referenceBold}>{formatDate(estimateDate)}</Text>,
            with a total project cost of{" "}
            <Text style={s.referenceBold}>{formatCurrency(grandTotal)}</Text>.
          </Text>
        </View>

        {/* Payment Schedule */}
        <View style={s.sectionHeaderContainer} minPresenceAhead={100}>
          <Text style={s.sectionHeaderText}>PAYMENT SCHEDULE</Text>
          <View style={s.sectionLeaderDots} />
        </View>
        {paymentItems.map((item, idx) => (
          <Text key={idx} style={s.bulletItem}>
            {"\u2022  "}{item.label}
          </Text>
        ))}
        <Text style={{ ...s.bodyText, marginTop: 6 }}>
          {paymentMethodsNote}
        </Text>

        {/* Terms & Conditions */}
        <View style={s.sectionHeaderContainer} minPresenceAhead={100}>
          <Text style={s.sectionHeaderText}>TERMS & CONDITIONS</Text>
          <View style={s.sectionLeaderDots} />
        </View>
        {renderFormattedText(contract.terms.split("\nPayment Schedule\n")[0])}

        {/* Warranty */}
        <View style={s.sectionHeaderContainer} minPresenceAhead={100}>
          <Text style={s.sectionHeaderText}>WARRANTY</Text>
          <View style={s.sectionLeaderDots} />
        </View>
        {renderFormattedText(contract.warranty)}

        {/* Exclusions */}
        <View style={s.sectionHeaderContainer} minPresenceAhead={100}>
          <Text style={s.sectionHeaderText}>EXCLUSIONS</Text>
          <View style={s.sectionLeaderDots} />
        </View>
        {renderFormattedText(
          contract.exclusions.split("\nChange Orders\n")[0]
        )}

        {/* Change Orders */}
        {changeOrders && (
          <>
            <View style={s.sectionHeaderContainer} minPresenceAhead={100}>
              <Text style={s.sectionHeaderText}>CHANGE ORDERS</Text>
              <View style={s.sectionLeaderDots} />
            </View>
            {renderFormattedText(changeOrders)}
          </>
        )}

        {/* Validity */}
        <Text style={{ ...s.bodyText, marginTop: 12, fontFamily: "Cormorant Garamond", fontStyle: "italic" }}>
          This estimate is valid for {validDays} days from the date above.
          After that, material prices and availability may change and we'd want
          to provide you with updated pricing.
        </Text>

        {/* Signature Block */}
        <View style={s.signatureSection} wrap={false}>
          <Text style={s.signatureIntro}>
            By signing below, you're giving us the green light to get started.
          </Text>
          <Text style={s.signatureIntroWarm}>
            We're excited to bring your garden to life!
          </Text>

          {/* Column headers */}
          <View style={s.signatureRow}>
            <View style={s.signatureBlock}>
              <Text style={s.companySignatureName}>{contract.client.name || "Client"}</Text>
            </View>
            <View style={s.signatureBlock}>
              <Text style={s.companySignatureName}>{company.name}</Text>
            </View>
          </View>

          {/* Row 1: Signature */}
          <View style={s.signatureRow}>
            <View style={s.signatureBlock}>
              <Text style={s.signatureLabel}>Signature</Text>
              <View style={{ ...s.signatureLine, width: "100%", height: 28 }} />
            </View>
            <View style={s.signatureBlock}>
              <Text style={s.signatureLabel}>Signature</Text>
              <View style={{ ...s.signatureLine, width: "100%", height: 28 }} />
            </View>
          </View>

          {/* Row 2: Date */}
          <View style={s.signatureRow}>
            <View style={s.signatureBlock}>
              <Text style={s.signatureLabel}>Date</Text>
              <View style={{ ...s.signatureLine, width: "60%", height: 20 }} />
            </View>
            <View style={s.signatureBlock}>
              <Text style={s.signatureLabel}>Date</Text>
              <View style={{ ...s.signatureLine, width: "60%", height: 20 }} />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            {company.name}
          </Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
