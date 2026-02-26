import { View, Text } from "@react-pdf/renderer";
import { styles } from "./pdf-styles";

interface PDFFooterProps {
  companyName: string;
  estimateNumber?: string;
}

export function PDFFooter({ companyName, estimateNumber }: PDFFooterProps) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{companyName}</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          estimateNumber
            ? `Estimate ${estimateNumber}  |  Page ${pageNumber} of ${totalPages}`
            : `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}
