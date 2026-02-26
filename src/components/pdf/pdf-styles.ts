import { StyleSheet } from "@react-pdf/renderer";

// --- Brand Colors ---
export const colors = {
  sageGreen: "#6B7F5E",
  deepForest: "#2D3B2D",
  warmStone: "#A89F91",
  parchment: "#F5F1EB",
  terracotta: "#C4745A",
  white: "#FFFFFF",
  lightSage: "#E8EDE4",
  tableBorder: "#D4CCBF",
  tableRowAlt: "#F9F7F3",
};

// --- Page Dimensions (US Letter in points) ---
export const page = {
  width: 612,
  height: 792,
  marginLeft: 54, // 0.75"
  marginRight: 54,
  marginTop: 43, // 0.6"
  marginBottom: 58, // 0.8"
  contentWidth: 504, // 612 - 54 - 54
};

// --- Shared Styles ---
export const styles = StyleSheet.create({
  // Page
  page: {
    width: page.width,
    height: page.height,
    paddingTop: page.marginTop,
    paddingBottom: page.marginBottom,
    paddingLeft: page.marginLeft,
    paddingRight: page.marginRight,
    backgroundColor: colors.parchment,
    fontFamily: "Source Sans 3",
    fontSize: 10,
    color: colors.deepForest,
  },

  // Header (page 1)
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.sageGreen,
  },
  headerLogo: {
    width: 65,
    height: 65,
    marginRight: 14,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerCompanyName: {
    fontFamily: "Cormorant Garamond",
    fontSize: 20,
    fontWeight: "bold",
    color: colors.deepForest,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  headerContactLine: {
    fontSize: 8.5,
    color: colors.warmStone,
    marginBottom: 1,
  },

  // Condensed header (subsequent pages)
  headerCondensed: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 0.75,
    borderBottomColor: colors.sageGreen,
  },
  headerCondensedName: {
    fontFamily: "Cormorant Garamond",
    fontSize: 11,
    fontWeight: "bold",
    color: colors.deepForest,
    letterSpacing: 1,
  },
  headerCondensedPage: {
    fontSize: 8,
    color: colors.warmStone,
  },

  // Title
  estimateTitle: {
    fontFamily: "Cormorant Garamond",
    fontSize: 24,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 18,
  },

  // Client info
  clientSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
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
  estimateNumberLabel: {
    fontFamily: "Cormorant Garamond",
    fontSize: 9,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: "right",
  },
  estimateNumberValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.deepForest,
    textAlign: "right",
    marginBottom: 2,
  },
  estimateDetail: {
    fontSize: 9,
    color: colors.warmStone,
    textAlign: "right",
    marginBottom: 1,
  },

  // Project description
  projectDescLabel: {
    fontFamily: "Cormorant Garamond",
    fontSize: 9,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  projectDescText: {
    fontSize: 9.5,
    color: colors.deepForest,
    lineHeight: 1.5,
    marginBottom: 18,
  },

  // Section header (e.g., "Backyard")
  sectionHeader: {
    fontFamily: "Cormorant Garamond",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.deepForest,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 14,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.sageGreen,
  },

  // Category header (e.g., "Plant Material") with dotted leader
  categoryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginTop: 10,
  },
  categoryHeaderText: {
    fontFamily: "Cormorant Garamond",
    fontSize: 12,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
  },
  categoryLeaderDots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.warmStone,
    borderBottomStyle: "dotted" as const,
    marginLeft: 6,
    marginRight: 6,
    marginBottom: 2,
  },
  categorySubtotalText: {
    fontFamily: "Source Sans 3",
    fontSize: 10,
    fontWeight: "bold",
    color: colors.deepForest,
  },

  // Table
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 0.75,
    borderBottomColor: colors.warmStone,
    paddingBottom: 3,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: colors.warmStone,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 2,
    minHeight: 16,
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: colors.tableRowAlt,
  },
  tableCell: {
    fontSize: 9.5,
    color: colors.deepForest,
  },
  tableCellRight: {
    fontSize: 9.5,
    color: colors.deepForest,
    textAlign: "right",
  },

  // Subtotal row
  subtotalRow: {
    flexDirection: "row",
    borderTopWidth: 0.75,
    borderTopColor: colors.warmStone,
    paddingTop: 4,
    marginTop: 2,
    marginBottom: 6,
  },
  subtotalLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.deepForest,
  },
  subtotalValue: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: colors.deepForest,
    textAlign: "right",
  },

  // Summary box
  summaryBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.sageGreen,
    backgroundColor: colors.white,
    borderRadius: 4,
    padding: 16,
  },
  summaryTitle: {
    fontFamily: "Cormorant Garamond",
    fontSize: 14,
    fontWeight: "bold",
    color: colors.sageGreen,
    letterSpacing: 1.5,
    marginBottom: 10,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 10,
    color: colors.deepForest,
  },
  summaryValue: {
    fontSize: 10,
    color: colors.deepForest,
    textAlign: "right",
  },
  summaryDivider: {
    borderBottomWidth: 0.75,
    borderBottomColor: colors.warmStone,
    marginVertical: 6,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginTop: 4,
    borderTopWidth: 1.5,
    borderTopColor: colors.sageGreen,
  },
  grandTotalLabel: {
    fontFamily: "Cormorant Garamond",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.deepForest,
    letterSpacing: 1,
  },
  grandTotalValue: {
    fontFamily: "Cormorant Garamond",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.terracotta,
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
