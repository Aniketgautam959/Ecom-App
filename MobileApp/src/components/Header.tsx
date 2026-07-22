import { Pressable, Text, View } from "react-native";
import { colors, styles } from "../styles";
import type { Screen } from "../types";

export function Header({
  title,
  back,
  go,
  cartCount,
  showCart = true,
}: {
  title: string;
  back?: () => void;
  go: (screen: Screen) => void;
  cartCount: number;
  showCart?: boolean;
}) {
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {back ? (
          <Pressable onPress={back} style={{ marginRight: 12 }}>
            <Text style={styles.headerBack}>‹</Text>
          </Pressable>
        ) : (
          <View style={[styles.webBrandMark, { marginRight: 10 }]}>
            <Text style={styles.webBrandLetter}>E</Text>
          </View>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {showCart ? (
        <Pressable onPress={() => go("cart")} style={{ position: "relative" }}>
          <Text style={styles.headerIcon}>🛒</Text>
          {cartCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -6,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 3,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{cartCount > 99 ? "99+" : cartCount}</Text>
            </View>
          )}
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}
