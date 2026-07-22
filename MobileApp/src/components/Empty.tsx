import { Text, View } from "react-native";
import { styles } from "../styles";

export function Empty({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>▢</Text>
      <Text style={styles.emptyText}>{title}</Text>
      {subtitle && <Text style={styles.small}>{subtitle}</Text>}
    </View>
  );
}
