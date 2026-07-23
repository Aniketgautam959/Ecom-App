import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, messageFrom } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";

export function Account({ back }: { back: () => void }) {
  const { go, cartCount, user, logout } = useApp();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const changePassword = async () => {
    setError("");
    setMessage("");
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/me/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Account" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.webCard}>
          <Text style={styles.subheading}>Account Details</Text>
          <Text style={styles.body}>Name: {user?.first_name} {user?.last_name}</Text>
          <Text style={styles.body}>Email: {user?.email_id}</Text>
          <Text style={styles.body}>Phone: {user?.phone_number || "Not provided"}</Text>
        </View>

        <Text style={styles.subheading}>Change Password</Text>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.alertText}>{error}</Text>
          </View>
        )}
        {message && (
          <View style={styles.successBox}>
            <Text style={styles.alertText}>{message}</Text>
          </View>
        )}

        <Text style={styles.inputLabel}>Current Password</Text>
        <View style={[styles.row, styles.input]}>
          <TextInput style={styles.flex} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry={!showCurrent} autoCapitalize="none" />
          <Pressable onPress={() => setShowCurrent(!showCurrent)}>
            <Feather name={showCurrent ? "eye-off" : "eye"} size={18} color={colors.textLight} />
          </Pressable>
        </View>

        <Text style={styles.inputLabel}>New Password</Text>
        <View style={[styles.row, styles.input]}>
          <TextInput style={styles.flex} value={newPassword} onChangeText={setNewPassword} secureTextEntry={!showNew} autoCapitalize="none" />
          <Pressable onPress={() => setShowNew(!showNew)}>
            <Feather name={showNew ? "eye-off" : "eye"} size={18} color={colors.textLight} />
          </Pressable>
        </View>

        <Text style={styles.inputLabel}>Confirm New Password</Text>
        <View style={[styles.row, styles.input]}>
          <TextInput style={styles.flex} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirm} autoCapitalize="none" />
          <Pressable onPress={() => setShowConfirm(!showConfirm)}>
            <Feather name={showConfirm ? "eye-off" : "eye"} size={18} color={colors.textLight} />
          </Pressable>
        </View>

        <Pressable style={styles.primaryButton} onPress={changePassword} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? "Updating..." : "Update Password"}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
