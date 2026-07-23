import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, messageFrom } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";

export function Contact({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    setStatus("");
    try {
      await api.post("/contact", { name, email, phone, subject, message });
      setStatus("Message sent successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus(messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Contact Us" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.body}>
          Have a question, feedback, or need support? We&apos;d love to hear from you.
        </Text>

        {status && (
          <View style={[status.includes("success") ? styles.successBox : styles.errorBox, { flexDirection: "row", alignItems: "center", gap: 8 }]}>
            <Feather name={status.includes("success") ? "check-circle" : "alert-circle"} size={16} color={status.includes("success") ? colors.success : colors.error} />
            <Text style={styles.alertText}>{status}</Text>
          </View>
        )}

        <Text style={styles.inputLabel}>Name</Text>
        <TextInput style={styles.input} placeholder="Your name" value={name} onChangeText={setName} />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.input} placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.inputLabel}>Phone</Text>
        <TextInput style={styles.input} placeholder="+91 98765 43210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Text style={styles.inputLabel}>Subject</Text>
        <TextInput style={styles.input} placeholder="Subject" value={subject} onChangeText={setSubject} />
        <Text style={styles.inputLabel}>Message</Text>
        <TextInput style={[styles.input, styles.textarea]} placeholder="How can we help you?" multiline value={message} onChangeText={setMessage} />
        <Pressable style={[styles.primaryButton, { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]} onPress={send} disabled={loading}>
          <Feather name="send" size={14} color="#fff" />
          <Text style={styles.primaryButtonText}>{loading ? "Sending..." : "Send Message"}</Text>
        </Pressable>

        <View style={[styles.webCard, { marginTop: 24 }]}>
          <Text style={styles.subheading}>Contact Information</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }}>
              <Feather name="mail" size={18} color={colors.text} />
            </View>
            <View>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }}>Email</Text>
              <Text style={{ fontSize: 13, color: colors.textLight }}>support@example.com</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }}>
              <Feather name="phone" size={18} color={colors.text} />
            </View>
            <View>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }}>Phone</Text>
              <Text style={{ fontSize: 13, color: colors.textLight }}>+91 98765 43210</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }}>
              <Feather name="map-pin" size={18} color={colors.text} />
            </View>
            <View>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }}>Address</Text>
              <Text style={{ fontSize: 13, color: colors.textLight }}>123 Ecommerce Street, New Delhi, India 110001</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
