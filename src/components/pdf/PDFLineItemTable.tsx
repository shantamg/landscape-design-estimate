import { View, Text } from "@react-pdf/renderer";
import type { LineItem } from "@/types";
import { styles, colors } from "./pdf-styles";
import { formatCurrency, computeSectionSubtotal } from "@/lib/estimate-utils";

// --- Column configurations per section type ---

type SectionType = "plantMaterial" | "laborAndServices" | "otherMaterials" | "designFee";

interface ColumnDef {
  label: string;
  width: string | number;
  align: "left" | "right" | "center";
  render: (item: LineItem) => string;
}

function getColumns(sectionType: SectionType): ColumnDef[] {
  switch (sectionType) {
    case "plantMaterial":
      return [
        { label: "QTY", width: "8%", align: "center", render: (i) => String(i.quantity) },
        { label: "UNIT", width: "8%", align: "center", render: (i) => i.unit },
        { label: "DESCRIPTION", width: "52%", align: "left", render: (i) => i.description },
        { label: "UNIT PRICE", width: "16%", align: "right", render: (i) => formatCurrency(i.unitPrice) },
        { label: "TOTAL", width: "16%", align: "right", render: (i) => formatCurrency(i.quantity * i.unitPrice) },
      ];
    case "laborAndServices":
      return [
        { label: "DESCRIPTION", width: "68%", align: "left", render: (i) => i.description },
        { label: "DETAILS", width: "16%", align: "center", render: (i) => (i.unitPrice > 0 ? i.unit : "") },
        { label: "TOTAL", width: "16%", align: "right", render: (i) => (i.quantity * i.unitPrice > 0 ? formatCurrency(i.quantity * i.unitPrice) : "Included") },
      ];
    case "otherMaterials":
      return [
        { label: "QTY", width: "8%", align: "center", render: (i) => String(i.quantity) },
        { label: "UNIT", width: "8%", align: "center", render: (i) => i.unit },
        { label: "DESCRIPTION", width: "52%", align: "left", render: (i) => i.description },
        { label: "UNIT PRICE", width: "16%", align: "right", render: (i) => formatCurrency(i.unitPrice) },
        { label: "TOTAL", width: "16%", align: "right", render: (i) => formatCurrency(i.quantity * i.unitPrice) },
      ];
    case "designFee":
      return [
        { label: "DESCRIPTION", width: "68%", align: "left", render: (i) => i.description },
        { label: "", width: "16%", align: "right", render: () => "" },
        { label: "TOTAL", width: "16%", align: "right", render: (i) => formatCurrency(i.quantity * i.unitPrice) },
      ];
  }
}

// --- Component ---

interface PDFLineItemTableProps {
  title: string;
  items: LineItem[];
  sectionType: SectionType;
}

export function PDFLineItemTable({
  title,
  items,
  sectionType,
}: PDFLineItemTableProps) {
  if (items.length === 0) return null;

  const columns = getColumns(sectionType);
  const subtotal = computeSectionSubtotal(items);

  return (
    <View wrap={false} style={{ marginBottom: 4 }}>
      {/* Category header */}
      <View style={styles.categoryHeaderRow} minPresenceAhead={60}>
        <Text style={styles.categoryHeaderText}>{title.toUpperCase()}</Text>
      </View>

      {/* Column headers */}
      <View style={styles.tableHeader}>
        {columns.map((col, i) => (
          <View key={i} style={{ width: col.width as string }}>
            <Text
              style={{
                ...styles.tableHeaderCell,
                textAlign: col.align,
              }}
            >
              {col.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Data rows */}
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.tableRow,
            index % 2 === 1 ? styles.tableRowAlt : {},
          ]}
        >
          {columns.map((col, colIdx) => (
            <View key={colIdx} style={{ width: col.width as string }}>
              <Text
                style={
                  col.align === "right"
                    ? styles.tableCellRight
                    : col.align === "center"
                    ? { ...styles.tableCell, textAlign: "center" }
                    : styles.tableCell
                }
              >
                {col.render(item)}
              </Text>
            </View>
          ))}
        </View>
      ))}

      {/* Subtotal row */}
      <View style={styles.subtotalRow}>
        <Text style={styles.subtotalLabel}>{title} Subtotal</Text>
        <Text style={styles.subtotalValue}>{formatCurrency(subtotal)}</Text>
      </View>
    </View>
  );
}

// --- Project Section wrapper ---

interface PDFProjectSectionProps {
  sectionName: string;
  plantMaterial: LineItem[];
  laborAndServices: LineItem[];
  otherMaterials: LineItem[];
  sectionTotal: number;
}

export function PDFProjectSection({
  sectionName,
  plantMaterial,
  laborAndServices,
  otherMaterials,
}: PDFProjectSectionProps) {
  const hasContent =
    plantMaterial.length > 0 ||
    laborAndServices.length > 0 ||
    otherMaterials.length > 0;

  if (!hasContent) return null;

  return (
    <View style={{ marginBottom: 6 }}>
      {/* Section name header — minPresenceAhead keeps it with content below */}
      <Text style={styles.sectionHeader} minPresenceAhead={80}>{sectionName}</Text>

      {/* Category tables in specified order: Plant, Labor, Materials */}
      <PDFLineItemTable
        title="Plant Material"
        items={plantMaterial}
        sectionType="plantMaterial"
      />
      <PDFLineItemTable
        title="Labor & Services"
        items={laborAndServices}
        sectionType="laborAndServices"
      />
      <PDFLineItemTable
        title="Other Materials"
        items={otherMaterials}
        sectionType="otherMaterials"
      />
    </View>
  );
}

// --- Design Fee section ---

interface PDFDesignFeeSectionProps {
  items: LineItem[];
}

export function PDFDesignFeeSection({ items }: PDFDesignFeeSectionProps) {
  if (items.length === 0) return null;

  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={styles.sectionHeader} minPresenceAhead={80}>Design Fee</Text>
      <PDFLineItemTable
        title="Design Fee"
        items={items}
        sectionType="designFee"
      />
    </View>
  );
}

// --- Thin separator between major sections ---
export function PDFSectionDivider() {
  return (
    <View
      style={{
        borderBottomWidth: 0.5,
        borderBottomColor: colors.warmStone,
        marginVertical: 4,
      }}
    />
  );
}
