import { View, Text } from "@react-pdf/renderer";
import { styles } from "./pdf-styles";

interface PDFFooterProps {
  companyName: string;
}

export function PDFFooter({ companyName }: PDFFooterProps) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{companyName}</Text>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}
