import { View, Text, Image } from "@react-pdf/renderer";
import type { CompanyInfo } from "@/types";
import { styles, colors } from "./pdf-styles";

interface PDFHeaderProps {
  company: CompanyInfo;
  isFirstPage: boolean;
  pageNumber?: number;
  totalPages?: number;
}

export function PDFHeader({ company, isFirstPage }: PDFHeaderProps) {
  if (!isFirstPage) {
    return null;
  }

  const hasLogo = company.logo && company.logo.length > 0;

  return (
    <View style={styles.headerContainer}>
      {hasLogo && (
        <Image style={styles.headerLogo} src={company.logo} />
      )}
      <View style={styles.headerTextBlock}>
        <Text style={styles.headerCompanyName}>
          {company.name.toUpperCase()}
        </Text>
        {company.address && (
          <Text style={styles.headerContactLine}>
            {company.address}
            {company.city ? `, ${company.city}` : ""}
            {company.state ? `, ${company.state}` : ""}
            {company.zip ? ` ${company.zip}` : ""}
          </Text>
        )}
        <Text style={styles.headerContactLine}>
          {[company.phone, company.email].filter(Boolean).join("  |  ")}
        </Text>
        {company.website && (
          <Text style={styles.headerContactLine}>{company.website}</Text>
        )}
        {company.licenseNumber && (
          <Text
            style={{
              fontSize: 8,
              color: colors.warmStone,
              marginTop: 1,
            }}
          >
            CSLB #{company.licenseNumber}
          </Text>
        )}
      </View>
    </View>
  );
}
