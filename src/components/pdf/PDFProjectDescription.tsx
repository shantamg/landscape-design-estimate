import { View, Text } from "@react-pdf/renderer";
import { styles } from "./pdf-styles";

interface PDFProjectDescriptionProps {
  description: string;
}

export function PDFProjectDescription({
  description,
}: PDFProjectDescriptionProps) {
  if (!description) return null;

  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={styles.projectDescLabel}>PROJECT DESCRIPTION</Text>
      <Text style={styles.projectDescText}>{description}</Text>
    </View>
  );
}
