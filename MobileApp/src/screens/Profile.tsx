import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { Nav } from "../components/Nav";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { User } from "../types";

export function Profile({ back }: { back: () => void }) {
  const { go, cartCount, user, setUser, logout } = useApp();
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [phone, setPhone] = useState(user?.phone_number ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const save = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.put("/me", { first_name: firstName, last_name: lastName || null, email_id: user?.email_id, phone_number: phone || null });
      const updated = (unwrap(res) as User) ?? (res.data.data as User) ?? user;
      if (updated) {
        setUser(updated);
        await AsyncStorage.setItem("user", JSON.stringify(updated));
      }
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await logout();
    go("login");
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="My Profile" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" }}>
            <Feather name="user" size={28} color="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 17, fontWeight: "600", color: colors.text }}>{user?.first_name} {user?.last_name}</Text>
            <Text style={{ fontSize: 13, color: colors.textLight, marginTop: 2 }}>{user?.email_id}</Text>
          </View>
        </View>

        <Text style={styles.subheading}>Edit Details</Text>
        {message && (
          <View style={[message.includes("success") ? styles.successBox : styles.errorBox, { flexDirection: "row", alignItems: "center", gap: 8 }]}>
            <Feather name={message.includes("success") ? "check-circle" : "alert-circle"} size={16} color={message.includes("success") ? colors.success : colors.error} />
            <Text style={styles.alertText}>{message}</Text>
          </View>
        )}
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Pressable style={styles.primaryButton} onPress={save} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? "Saving..." : "Save Changes"}</Text>
        </Pressable>

        <Pressable style={[styles.menuItem, { marginTop: 16 }]} onPress={() => go("orders")}>
          <Text style={styles.menuText}>My Orders</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("addresses")}>
          <Text style={styles.menuText}>Addresses</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("wishlist")}>
          <Text style={styles.menuText}>Wishlist</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("notifications")}>
          <Text style={styles.menuText}>Notifications</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("account")}>
          <Text style={styles.menuText}>Account Settings</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("support")}>
          <Text style={styles.menuText}>Support</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>

        <Pressable style={[styles.secondaryButton, { marginTop: 24 }]} onPress={signOut}>
          <Text style={styles.secondaryButtonText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
      <Nav go={go} active="profile" />
    </SafeAreaView>
  );
}
