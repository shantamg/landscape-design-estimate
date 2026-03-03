import { View, Text } from "@react-pdf/renderer";
import type { PriceableDocument } from "@/lib/estimate-utils";
import { styles } from "./pdf-styles";
import {
  formatCurrency,
  computeProjectSectionSubtotal,
  computeCategoryTotal,
  computeDesignFeeTotal,
  computeTaxableTotal,
  computeTax,
  computeGrandTotal,
  computeSectionSubtotal,
} from "@/lib/estimate-utils";

interface PDFSummaryProps {
  estimate: PriceableDocument;
}

export function PDFSummary({ estimate }: PDFSummaryProps) {
  const plantTotal = computeCategoryTotal(estimate, "plantMaterial");
  const laborTotal = computeCategoryTotal(estimate, "laborAndServices");
  const materialsTotal = computeCategoryTotal(estimate, "otherMaterials");
  const designFeeTotal = computeDesignFeeTotal(estimate);
  const tax = computeTax(estimate);
  const grandTotal = computeGrandTotal(estimate);

  const hasMultipleSections = estimate.projectSections.length > 1;
  const subtotalBeforeTax = plantTotal + laborTotal + materialsTotal + designFeeTotal;

  return (
    <View wrap={false} style={styles.summaryBox}>
      <Text style={styles.summaryTitle}>COST SUMMARY</Text>

      {hasMultipleSections ? (
        <>
          {/* Multi-section: per-section breakdown with categories */}
          {estimate.projectSections.map((section) => {
            const sectionPlant = computeSectionSubtotal(section.plantMaterial);
            const sectionLabor = computeSectionSubtotal(section.laborAndServices);
            const sectionMaterials = computeSectionSubtotal(section.otherMaterials);
            const sectionTotal = computeProjectSectionSubtotal(section);
            if (sectionTotal === 0) return null;
            return (
              <View key={section.id} style={{ marginBottom: 6 }}>
                <View style={styles.summaryRow}>
                  <Text style={{ ...styles.summaryLabel, fontWeight: "bold" }}>
                    {section.name}
                  </Text>
                  <Text style={{ ...styles.summaryValue, fontWeight: "bold" }}>
                    {formatCurrency(sectionTotal)}
                  </Text>
                </View>
                {sectionPlant > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={{ ...styles.summaryLabel, paddingLeft: 12 }}>
                      Plant Material
                    </Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(sectionPlant)}
                    </Text>
                  </View>
                )}
                {sectionLabor > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={{ ...styles.summaryLabel, paddingLeft: 12 }}>
                      Labor & Services
                    </Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(sectionLabor)}
                    </Text>
                  </View>
                )}
                {sectionMaterials > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={{ ...styles.summaryLabel, paddingLeft: 12 }}>
                      Other Materials
                    </Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(sectionMaterials)}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          {/* Design fee */}
          {designFeeTotal > 0 && (
            <View style={styles.summaryRow}>
              <Text style={{ ...styles.summaryLabel, fontWeight: "bold" }}>
                Design Fee
              </Text>
              <Text style={{ ...styles.summaryValue, fontWeight: "bold" }}>
                {formatCurrency(designFeeTotal)}
              </Text>
            </View>
          )}

          <View style={styles.summaryDivider} />
        </>
      ) : (
        <>
          {/* Single-section: flat category list */}
          {plantTotal > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plant Material</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(plantTotal)}
              </Text>
            </View>
          )}
          {laborTotal > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Labor & Services</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(laborTotal)}
              </Text>
            </View>
          )}
          {materialsTotal > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Other Materials</Text>
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
        </>
      )}

      {/* Subtotal + Tax */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>
          {formatCurrency(subtotalBeforeTax)}
        </Text>
      </View>
      {tax > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Tax on Materials ({estimate.taxRate}%)
          </Text>
          <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
        </View>
      )}

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
