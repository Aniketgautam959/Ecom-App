import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, messageFrom } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";

export function Contact({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    setStatus("");
    try {
      await api.post("/contact", { name, email, message });
      setStatus("Message sent successfully!");
      setName("");
      setEmail("");
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
        <Text style={styles.heading}>Get in touch</Text>
        <Text style={styles.body}>
          Have a question or feedback? Fill out the form and our team will get back to you shortly.
        </Text>

        {status && (
          <View style={status.includes("success") ? styles.successBox : styles.errorBox}>
            <Text style={styles.alertText}>{status}</Text>
          </View>
        )}

        <Text style={styles.inputLabel}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.inputLabel}>Message</Text>
        <TextInput style={[styles.input, styles.textarea]} multiline value={message} onChangeText={setMessage} />
        <Pressable style={styles.primaryButton} onPress={send} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? "Sending..." : "Send Message"}</Text>
        </Pressable>

        <View style={[styles.webCard, { marginTop: 24 }]}>
          <Text style={styles.subheading}>Contact Information</Text>
          <Text style={styles.body}>Email: support@ecommerce.com</Text>
          <Text style={styles.body}>Phone: +91 98765 43210</Text>
          <Text style={styles.body}>Address: 123 Ecommerce Street, Bangalore, India</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
