import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { Screen } from "../types";

const tabs = [
  { key: "home", label: "Home", icon: "home" },
  { key: "shop", label: "Shop", icon: "grid" },
  { key: "wishlist", label: "Wishlist", icon: "heart" },
  { key: "profile", label: "Profile", icon: "user" },
] as const;

export function Nav({ active, go }: { active: Screen; go?: (screen: Screen) => void }) {
  const { go: ctxGo } = useApp();
  const navigate = go ?? ctxGo;

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <Pressable key={tab.key} onPress={() => navigate(tab.key)} style={{ alignItems: "center", paddingHorizontal: 8 }}>
          <Feather
            name={tab.icon}
            size={20}
            color={active === tab.key ? colors.primary : colors.textLight}
          />
          <Text style={active === tab.key ? styles.navActive : styles.navItem}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
