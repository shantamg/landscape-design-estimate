import { View, Text } from "@react-pdf/renderer";
import type { Estimate } from "@/types";
import { styles } from "./pdf-styles";
import {
  formatCurrency,
  computeProjectSectionSubtotal,
  computeCategoryTotal,
  computeDesignFeeTotal,
  computeTaxableTotal,
  computeTax,
  computeGrandTotal,
} from "@/lib/estimate-utils";

interface PDFSummaryProps {
  estimate: Estimate;
}

export function PDFSummary({ estimate }: PDFSummaryProps) {
  const plantTotal = computeCategoryTotal(estimate, "plantMaterial");
  const laborTotal = computeCategoryTotal(estimate, "laborAndServices");
  const materialsTotal = computeCategoryTotal(estimate, "otherMaterials");
  const designFeeTotal = computeDesignFeeTotal(estimate);
  const taxableTotal = computeTaxableTotal(estimate);
  const tax = computeTax(estimate);
  const grandTotal = computeGrandTotal(estimate);

  return (
    <View wrap={false} style={styles.summaryBox}>
      <Text style={styles.summaryTitle}>COST SUMMARY</Text>

      {/* Per-section subtotals */}
      {estimate.projectSections.map((section) => {
        const sectionTotal = computeProjectSectionSubtotal(section);
        if (sectionTotal === 0) return null;
        return (
          <View key={section.id} style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{section.name}</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(sectionTotal)}
            </Text>
          </View>
        );
      })}

      {/* Design fee */}
      {designFeeTotal > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Design Fee</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(designFeeTotal)}
          </Text>
        </View>
      )}

      <View style={styles.summaryDivider} />

      {/* Category subtotals */}
      {plantTotal > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Plant Material Subtotal</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(plantTotal)}
          </Text>
        </View>
      )}
      {laborTotal > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Labor & Services Subtotal</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(laborTotal)}
          </Text>
        </View>
      )}
      {materialsTotal > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Other Materials Subtotal</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(materialsTotal)}
          </Text>
        </View>
      )}
      {designFeeTotal > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Design Fee</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(designFeeTotal)}
          </Text>
        </View>
      )}

      <View style={styles.summaryDivider} />

      {/* Tax */}
      {taxableTotal > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Taxable Materials Subtotal
          </Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(taxableTotal)}
          </Text>
        </View>
      )}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>
          Tax on Materials ({estimate.taxRate}%)
        </Text>
        <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
      </View>

      {/* Grand total */}
      <View style={styles.grandTotalRow}>
        <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
        <Text style={styles.grandTotalValue}>
          {formatCurrency(grandTotal)}
        </Text>
      </View>
    </View>
  );
}
