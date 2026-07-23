import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, SafeAreaView, ScrollView, Switch, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";

export function Settings({ back }: { back: () => void }) {
  const { go, cartCount, user, logout } = useApp();
  const [promo, setPromo] = useState(true);

  const signOut = async () => {
    await logout();
    go("login");
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Settings" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.subheading}>Preferences</Text>
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Receive promotional emails</Text>
          <Switch value={promo} onValueChange={setPromo} />
        </View>

        <Text style={[styles.subheading, { marginTop: 24 }]}>Information</Text>
        <Pressable style={styles.menuItem} onPress={() => go("about")}>
          <Text style={styles.menuText}>About Us</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("contact")}>
          <Text style={styles.menuText}>Contact</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("faq")}>
          <Text style={styles.menuText}>FAQ</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("privacy-policy")}>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("terms-conditions")}>
          <Text style={styles.menuText}>Terms & Conditions</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>

        {user && (
          <Pressable style={[styles.secondaryButton, { marginTop: 24 }]} onPress={signOut}>
            <Text style={styles.secondaryButtonText}>Sign Out</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
