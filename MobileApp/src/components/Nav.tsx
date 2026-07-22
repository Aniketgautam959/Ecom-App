import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import type { Screen } from "../types";

export function Nav({ go, active }: { go: (screen: Screen) => void; active: Screen }) {
  const tabs: { key: Screen; label: string; icon: string }[] = [
    { key: "home", label: "Home", icon: "⌂" },
    { key: "shop", label: "Shop", icon: "▦" },
    { key: "wishlist", label: "Wishlist", icon: "♡" },
    { key: "profile", label: "Profile", icon: "◉" },
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <Pressable key={tab.key} onPress={() => go(tab.key)}>
          <Text style={active === tab.key ? styles.navActive : styles.navItem}>
            {tab.icon}
            {"\n"}
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
