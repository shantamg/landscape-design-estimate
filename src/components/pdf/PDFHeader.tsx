import { View, Text, Image } from "@react-pdf/renderer";
import type { CompanyInfo } from "@/types";
import { styles } from "./pdf-styles";

interface PDFHeaderProps {
  company: CompanyInfo;
  isFirstPage: boolean;
}

export function PDFHeader({ company, isFirstPage }: PDFHeaderProps) {
  if (!isFirstPage) {
    return null;
  }

  const logoSrc = company.logo && company.logo.length > 0
    ? company.logo
    : `${window.location.origin}/logo.png`;

  return (
    <View style={styles.headerContainer}>
      <Image style={styles.headerLogo} src={logoSrc} />
      <View style={styles.headerTextBlock}>
        <Text style={styles.headerCompanyName}>
          {company.name.toUpperCase()}
        </Text>
        <Text style={styles.headerContactLine}>
          {[company.phone, company.email].filter(Boolean).join("  |  ")}
        </Text>
        {company.licenseNumber && (
          <Text style={styles.headerContactLine}>
            CSLB #{company.licenseNumber}
          </Text>
        )}
      </View>
    </View>
  );
}
