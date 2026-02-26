import { View, Text } from "@react-pdf/renderer";
import type { ClientInfo } from "@/types";
import { styles } from "./pdf-styles";
import { formatDate } from "@/lib/estimate-utils";

interface PDFClientInfoProps {
  client: ClientInfo;
  estimateNumber: string;
  createdAt: string;
  validDays: number;
}

export function PDFClientInfo({
  client,
  estimateNumber,
  createdAt,
  validDays,
}: PDFClientInfoProps) {
  const validUntil = createdAt
    ? new Date(
        new Date(createdAt).getTime() + validDays * 24 * 60 * 60 * 1000
      ).toISOString()
    : "";

  const projectAddr = client.projectAddressSameAsClient
    ? null
    : client.projectAddress;

  return (
    <View style={styles.clientSection}>
      <View style={styles.clientLeft}>
        <Text style={styles.clientLabel}>PREPARED FOR</Text>
        {client.name && <Text style={styles.clientName}>{client.name}</Text>}
        {client.address && (
          <Text style={styles.clientDetail}>{client.address}</Text>
        )}
        {(client.city || client.state || client.zip) && (
          <Text style={styles.clientDetail}>
            {[client.city, client.state].filter(Boolean).join(", ")}
            {client.zip ? ` ${client.zip}` : ""}
          </Text>
        )}
        {client.phone && (
          <Text style={styles.clientDetail}>{client.phone}</Text>
        )}
        {client.email && (
          <Text style={styles.clientDetail}>{client.email}</Text>
        )}
        {projectAddr && (
          <View style={{ marginTop: 6 }}>
            <Text style={styles.clientLabel}>PROJECT ADDRESS</Text>
            <Text style={styles.clientDetail}>{projectAddr}</Text>
          </View>
        )}
      </View>

      <View style={styles.clientRight}>
        <Text style={styles.estimateNumberValue}>{estimateNumber}</Text>
        {createdAt && (
          <Text style={styles.estimateDetail}>
            {formatDate(createdAt)}
          </Text>
        )}
        {validUntil && (
          <Text style={styles.estimateDetail}>
            Valid until {formatDate(validUntil)}
          </Text>
        )}
      </View>
    </View>
  );
}
