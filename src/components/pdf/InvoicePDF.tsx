import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Invoice, CompanyInfo } from "@/types";
import { PDFHeader } from "./PDFHeader";
import { PDFFooter } from "./PDFFooter";
import {
  PDFProjectSection,
  PDFDesignFeeSection,
} from "./PDFLineItemTable";
import { colors, page } from "./pdf-styles";
import {
  formatCurrency,
  formatDate,
  computeProjectSectionSubtotal,
  computeCategoryTotal,
  computeDesignFeeTotal,
  computeTaxableTotal,
  computeTax,
  computeGrandTotal,
  computeBalanceRemaining,
} from "@/lib/estimate-utils";

// Register fonts
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

Font.registerHyphenationCallback((word) => [word]);

interface InvoicePDFProps {
  invoice: Invoice;
  company: CompanyInfo;
  estimateNumber?: string;
}

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
  invoiceNumberLabel: {
    fontFamily: "Cormorant Garamond",
    fontSize: 9,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: "right",
  },
  invoiceNumberValue: {
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
  metaDetailBold: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: colors.deepForest,
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
  // Summary box
  summaryBox: {
    borderWidth: 1,
    borderColor: colors.sageGreen,
    borderRadius: 6,
    padding: 16,
    marginTop: 20,
  },
  summaryTitle: {
    fontFamily: "Cormorant Garamond",
    fontSize: 14,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  summaryLabel: {
    fontSize: 9.5,
    color: colors.deepForest,
  },
  summaryValue: {
    fontSize: 9.5,
    fontWeight: 600,
    color: colors.deepForest,
    textAlign: "right",
  },
  summaryDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.warmStone,
    marginVertical: 6,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: colors.sageGreen,
    marginTop: 8,
    paddingTop: 8,
  },
  grandTotalLabel: {
    fontFamily: "Cormorant Garamond",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.deepForest,
  },
  grandTotalValue: {
    fontFamily: "Cormorant Garamond",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.terracotta,
    textAlign: "right",
  },
  // Payment history
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  paymentLabel: {
    fontSize: 9.5,
    color: colors.deepForest,
  },
  paymentValue: {
    fontSize: 9.5,
    fontWeight: 600,
    color: colors.sageGreen,
    textAlign: "right",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: colors.terracotta,
    marginTop: 6,
    paddingTop: 6,
  },
  balanceLabel: {
    fontFamily: "Cormorant Garamond",
    fontSize: 14,
    fontWeight: "bold",
    color: colors.deepForest,
  },
  balanceValue: {
    fontFamily: "Cormorant Garamond",
    fontSize: 14,
    fontWeight: "bold",
    color: colors.terracotta,
    textAlign: "right",
  },
  // Payment instructions
  instructionsText: {
    fontSize: 9.5,
    color: colors.deepForest,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9.5,
    color: colors.warmStone,
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  // Simple line items (standalone invoices)
  simpleTableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.sageGreen,
    paddingBottom: 4,
    marginBottom: 4,
  },
  simpleTableHeaderDesc: {
    flex: 1,
    fontFamily: "Cormorant Garamond",
    fontSize: 9,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1,
  },
  simpleTableHeaderAmt: {
    width: 90,
    fontFamily: "Cormorant Garamond",
    fontSize: 9,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1,
    textAlign: "right",
  },
  simpleTableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.warmStone,
  },
  simpleTableDesc: {
    flex: 1,
    fontSize: 10,
    color: colors.deepForest,
  },
  simpleTableAmt: {
    width: 90,
    fontSize: 10,
    fontWeight: 600,
    color: colors.deepForest,
    textAlign: "right",
  },
});

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  check: "Check",
  venmo: "Venmo",
  zelle: "Zelle",
  credit_card: "Credit Card",
  cash: "Cash",
  other: "Other",
};

function PDFSimpleLineItems({ invoice }: { invoice: Invoice }) {
  return (
    <View style={{ marginTop: 12 }}>
      <View style={s.sectionHeaderContainer}>
        <Text style={s.sectionHeaderText}>LINE ITEMS</Text>
        <View style={s.sectionLeaderDots} />
      </View>
      <View style={s.simpleTableHeader}>
        <Text style={s.simpleTableHeaderDesc}>DESCRIPTION</Text>
        <Text style={s.simpleTableHeaderAmt}>AMOUNT</Text>
      </View>
      {invoice.standaloneItems.map((item) => (
        <View key={item.id}>
          <View style={s.simpleTableRow}>
            <Text style={s.simpleTableDesc}>{item.description}</Text>
            <Text style={s.simpleTableAmt}>{formatCurrency(item.amount)}</Text>
          </View>
          {item.subItems && item.subItems.filter((si) => si.trim()).length > 0 && (
            <View style={{ paddingLeft: 16, paddingBottom: 3 }}>
              {item.subItems.filter((si) => si.trim()).map((sub, idx) => (
                <Text
                  key={idx}
                  style={{
                    fontSize: 8.5,
                    color: "#A89F91",
                    lineHeight: 1.5,
                  }}
                >
                  {"\u00B7"}  {sub.trim()}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

export function InvoicePDF({ invoice, company, estimateNumber }: InvoicePDFProps) {
  const isStandalone = invoice.standaloneItems && invoice.standaloneItems.length > 0;
  const grandTotal = computeGrandTotal(invoice);
  const balanceRemaining = computeBalanceRemaining(invoice);

  // Estimate-linked totals (only computed when needed)
  const plantTotal = isStandalone ? 0 : computeCategoryTotal(invoice, "plantMaterial");
  const laborTotal = isStandalone ? 0 : computeCategoryTotal(invoice, "laborAndServices");
  const materialsTotal = isStandalone ? 0 : computeCategoryTotal(invoice, "otherMaterials");
  const designFeeTotal = isStandalone ? 0 : computeDesignFeeTotal(invoice);
  const taxableTotal = isStandalone ? 0 : computeTaxableTotal(invoice);
  const tax = isStandalone ? 0 : computeTax(invoice);

  return (
    <Document
      title={`Invoice ${invoice.invoiceNumber}`}
      author={company.name}
      subject={`Invoice for ${invoice.client.name}`}
    >
      <Page size="LETTER" style={s.page} wrap>
        {/* Company Header */}
        <PDFHeader company={company} isFirstPage={true} />

        {/* Title */}
        <Text style={s.title}>INVOICE</Text>

        {/* Client Info + Invoice Meta */}
        <View style={s.clientSection}>
          <View style={s.clientLeft}>
            <Text style={s.clientLabel}>BILL TO</Text>
            <Text style={s.clientName}>{invoice.client.name}</Text>
            {invoice.client.address && (
              <Text style={s.clientDetail}>{invoice.client.address}</Text>
            )}
            <Text style={s.clientDetail}>
              {[invoice.client.city, invoice.client.state, invoice.client.zip]
                .filter(Boolean)
                .join(", ")}
            </Text>
            {invoice.client.phone && (
              <Text style={s.clientDetail}>{invoice.client.phone}</Text>
            )}
            {invoice.client.email && (
              <Text style={s.clientDetail}>{invoice.client.email}</Text>
            )}
          </View>
          <View style={s.clientRight}>
            <Text style={s.invoiceNumberLabel}>INVOICE</Text>
            <Text style={s.invoiceNumberValue}>{invoice.invoiceNumber}</Text>
            <Text style={s.metaDetail}>
              Date: {formatDate(invoice.invoiceDate)}
            </Text>
          </View>
        </View>

        {isStandalone ? (
          <>
            {/* Standalone: description + simple line items */}
            {invoice.projectDescription && (
              <View style={s.referenceBox}>
                <Text style={s.referenceText}>{invoice.projectDescription}</Text>
              </View>
            )}
            <PDFSimpleLineItems invoice={invoice} />
          </>
        ) : (
          <>
            {/* Estimate-linked: reference + full line items */}
            <View style={s.referenceBox}>
              <Text style={s.referenceText}>
                For work described in Estimate{" "}
                <Text style={s.referenceBold}>{estimateNumber}</Text>.
                {invoice.projectDescription ? ` ${invoice.projectDescription}` : ""}
              </Text>
            </View>

            {invoice.projectSections.map((section) => (
              <PDFProjectSection
                key={section.id}
                sectionName={section.name}
                plantMaterial={section.plantMaterial}
                laborAndServices={section.laborAndServices}
                otherMaterials={section.otherMaterials}
                sectionTotal={computeProjectSectionSubtotal(section)}
              />
            ))}

            <PDFDesignFeeSection items={invoice.designFee} />
          </>
        )}

        {/* Cost Summary */}
        <View wrap={false} style={s.summaryBox}>
          <Text style={s.summaryTitle}>INVOICE SUMMARY</Text>

          {isStandalone ? (
            <>
              {/* Standalone: just show each item and total */}
              {invoice.standaloneItems.map((item) => (
                <View key={item.id} style={s.summaryRow}>
                  <Text style={s.summaryLabel}>{item.description}</Text>
                  <Text style={s.summaryValue}>{formatCurrency(item.amount)}</Text>
                </View>
              ))}
            </>
          ) : (
            <>
              {/* Estimate-linked: full category breakdown */}
              {invoice.projectSections.map((section) => {
                const sectionTotal = computeProjectSectionSubtotal(section);
                if (sectionTotal === 0) return null;
                return (
                  <View key={section.id} style={s.summaryRow}>
                    <Text style={s.summaryLabel}>{section.name}</Text>
                    <Text style={s.summaryValue}>{formatCurrency(sectionTotal)}</Text>
                  </View>
                );
              })}

              {designFeeTotal > 0 && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Design Fee</Text>
                  <Text style={s.summaryValue}>{formatCurrency(designFeeTotal)}</Text>
                </View>
              )}

              <View style={s.summaryDivider} />

              {plantTotal > 0 && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Plant Material Subtotal</Text>
                  <Text style={s.summaryValue}>{formatCurrency(plantTotal)}</Text>
                </View>
              )}
              {laborTotal > 0 && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Labor & Services Subtotal</Text>
                  <Text style={s.summaryValue}>{formatCurrency(laborTotal)}</Text>
                </View>
              )}
              {materialsTotal > 0 && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Other Materials Subtotal</Text>
                  <Text style={s.summaryValue}>{formatCurrency(materialsTotal)}</Text>
                </View>
              )}

              <View style={s.summaryDivider} />

              {taxableTotal > 0 && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Taxable Materials Subtotal</Text>
                  <Text style={s.summaryValue}>{formatCurrency(taxableTotal)}</Text>
                </View>
              )}
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  Tax on Materials ({invoice.taxRate}%)
                </Text>
                <Text style={s.summaryValue}>{formatCurrency(tax)}</Text>
              </View>
            </>
          )}

          {/* Grand total */}
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>TOTAL DUE</Text>
            <Text style={s.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
          </View>

          {/* Payments received */}
          {invoice.payments.length > 0 && (
            <>
              <View style={{ ...s.summaryDivider, marginTop: 10 }} />
              {invoice.payments.map((payment) => (
                <View key={payment.id} style={s.paymentRow}>
                  <Text style={s.paymentLabel}>
                    Payment — {formatDate(payment.date)} ({PAYMENT_METHOD_LABELS[payment.method] || payment.method})
                    {payment.note ? ` — ${payment.note}` : ""}
                  </Text>
                  <Text style={s.paymentValue}>
                    -{formatCurrency(payment.amount)}
                  </Text>
                </View>
              ))}
              <View style={s.balanceRow}>
                <Text style={s.balanceLabel}>BALANCE REMAINING</Text>
                <Text style={s.balanceValue}>
                  {formatCurrency(Math.max(0, balanceRemaining))}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Payment Instructions */}
        {invoice.paymentInstructions && (
          <>
            <View style={s.sectionHeaderContainer} minPresenceAhead={60}>
              <Text style={s.sectionHeaderText}>PAYMENT INSTRUCTIONS</Text>
              <View style={s.sectionLeaderDots} />
            </View>
            <Text style={s.instructionsText}>{invoice.paymentInstructions}</Text>
          </>
        )}

        {/* Notes */}
        {invoice.notes && (
          <>
            <View style={s.sectionHeaderContainer} minPresenceAhead={60}>
              <Text style={s.sectionHeaderText}>NOTES</Text>
              <View style={s.sectionLeaderDots} />
            </View>
            <Text style={s.notesText}>{invoice.notes}</Text>
          </>
        )}

        {/* Footer */}
        <PDFFooter companyName={company.name} />
      </Page>
    </Document>
  );
}
