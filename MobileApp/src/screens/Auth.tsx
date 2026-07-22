import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Button } from "../components/Button";
import { WebHeader } from "../components/WebHeader";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { User } from "../types";

export function Auth({ mode }: { mode: "login" | "register" | "forgot-password" | "reset-password" }) {
  const { go, replace, user, setUser } = useApp();
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot-password" | "reset-password">(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isLogin = authMode === "login";
  const isRegister = authMode === "register";
  const isForgot = authMode === "forgot-password";
  const isReset = authMode === "reset-password";

  const resetFields = () => {
    setName("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
  };

  const switchMode = (next: typeof authMode) => {
    setAuthMode(next);
    resetFields();
  };

  const submit = async () => {
    setError("");
    setMessage("");

    if (isRegister && !name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if ((isLogin || isRegister || isReset) && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if ((isRegister || isReset) && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email_id: email, password });
        const data = unwrap(res) as { user: User; token: string };
        await AsyncStorage.multiSet([
          ["auth_token", data.token],
          ["user", JSON.stringify(data.user)],
        ]);
        setUser(data.user);
        replace("home");
      } else if (isRegister) {
        const res = await api.post("/auth/register", {
          first_name: name,
          email_id: email,
          password,
          password_confirmation: confirmPassword,
        });
        const data = unwrap(res) as { user: User; token: string };
        await AsyncStorage.multiSet([
          ["auth_token", data.token],
          ["user", JSON.stringify(data.user)],
        ]);
        setUser(data.user);
        replace("home");
      } else if (isForgot) {
        await api.post("/auth/forgot-password", { email_id: email });
        setMessage("If an account exists, a reset link has been sent.");
      } else if (isReset) {
        await api.post("/auth/reset-password", {
          token,
          email_id: email,
          password,
          password_confirmation: confirmPassword,
        });
        setMessage("Password reset successful. Redirecting to sign in...");
        setTimeout(() => switchMode("login"), 1500);
      }
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <WebHeader go={go} cartCount={0} />
      <ScrollView contentContainerStyle={[styles.form, { paddingTop: 24 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.center}>
          <View style={styles.webBrandMark}>
            <Text style={styles.webBrandLetter}>E</Text>
          </View>
          <Text style={{ ...styles.webBrandText, marginTop: 12 }}>Ecommerce</Text>
        </View>

        <Text style={styles.heading}>
          {isLogin ? "Welcome back" : isRegister ? "Create account" : isForgot ? "Forgot Password" : "Reset Password"}
        </Text>
        <Text style={styles.body}>
          {isLogin ? "Sign in to your account" : isRegister ? "Join us today" : isForgot ? "Enter your email and we'll send you a reset link." : "Enter your new password below."}
        </Text>

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

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {isReset && (
          <TextInput
            style={styles.input}
            placeholder="Reset token"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
          />
        )}

        {(isLogin || isRegister || isReset) && (
          <View>
            <View style={[styles.row, styles.input]}>
              <TextInput
                style={styles.flex}
                placeholder={isReset ? "New Password" : "Password"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ color: colors.textLight }}>{showPassword ? "Hide" : "Show"}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {(isRegister || isReset) && (
          <View style={[styles.row, styles.input]}>
            <TextInput
              style={styles.flex}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowConfirm(!showConfirm)}>
              <Text style={{ color: colors.textLight }}>{showConfirm ? "Hide" : "Show"}</Text>
            </Pressable>
          </View>
        )}

        <Button
          title={
            isLogin ? "Sign In" : isRegister ? "Create Account" : isForgot ? "Send Reset Link" : "Reset Password"
          }
          onPress={submit}
          loading={loading}
        />

        <View style={[styles.row, { justifyContent: "center", marginTop: 8 }]}>
          {isLogin ? (
            <>
              <Text style={styles.small}>Don't have an account? </Text>
              <Pressable onPress={() => switchMode("register")}>
                <Text style={styles.link}>Sign Up</Text>
              </Pressable>
            </>
          ) : isRegister ? (
            <>
              <Text style={styles.small}>Already have an account? </Text>
              <Pressable onPress={() => switchMode("login")}>
                <Text style={styles.link}>Sign In</Text>
              </Pressable>
            </>
          ) : (
            <Pressable onPress={() => switchMode("login")}>
              <Text style={styles.link}>Back to Sign In</Text>
            </Pressable>
          )}
        </View>
        {isLogin && (
          <Pressable onPress={() => switchMode("forgot-password")} style={{ alignSelf: "center" }}>
            <Text style={[styles.link, { fontSize: 12 }]}>Forgot password?</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
