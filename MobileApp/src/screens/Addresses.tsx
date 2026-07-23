import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { Address, AddressFormData } from "../types";

const emptyForm: AddressFormData = {
  label: "Home",
  name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  is_default: false,
};

export function Addresses({ back }: { back: () => void }) {
  const { go, cartCount, user } = useApp();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<AddressFormData>(emptyForm);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    try {
      const res = await api.get("/addresses");
      setAddresses((unwrap(res) as Address[]) ?? []);
    } catch (err) {
      Alert.alert("Addresses", messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const edit = (address: Address) => {
    setEditing(address);
    setForm({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      is_default: address.is_default,
    });
  };

  const save = async () => {
    setBusy(true);
    try {
      if (editing) {
        await api.put(`/addresses/${editing.id}`, form);
      } else {
        await api.post("/addresses", form);
      }
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      Alert.alert("Address", messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.delete(`/addresses/${id}`);
      await load();
    } catch (err) {
      Alert.alert("Address", messageFrom(err));
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Please login to manage addresses.</Text>
        <Pressable style={styles.primaryButton} onPress={() => go("login")}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="My Addresses" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.subheading}>{editing ? "Edit Address" : "Add New Address"}</Text>
        <TextInput style={styles.input} placeholder="Label (Home/Office)" value={form.label} onChangeText={(text) => setForm({ ...form, label: text })} />
        <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} />
        <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={(text) => setForm({ ...form, phone: text })} />
        <TextInput style={[styles.input, styles.textarea]} placeholder="Address line" multiline value={form.address_line} onChangeText={(text) => setForm({ ...form, address_line: text })} />
        <TextInput style={styles.input} placeholder="City" value={form.city} onChangeText={(text) => setForm({ ...form, city: text })} />
        <TextInput style={styles.input} placeholder="State" value={form.state} onChangeText={(text) => setForm({ ...form, state: text })} />
        <TextInput style={styles.input} placeholder="Pincode" keyboardType="number-pad" value={form.pincode} onChangeText={(text) => setForm({ ...form, pincode: text })} />
        <TextInput style={styles.input} placeholder="Country" value={form.country} onChangeText={(text) => setForm({ ...form, country: text })} />
        <Pressable
          style={[styles.row, { gap: 8, marginVertical: 8 }]}
          onPress={() => setForm({ ...form, is_default: !form.is_default })}
        >
          <Feather name={form.is_default ? "check-square" : "square"} size={20} color={colors.primary} />
          <Text style={styles.body}>Set as default address</Text>
        </Pressable>
        <View style={[styles.row, styles.gapMd]}>
          <Pressable style={[styles.primaryButton, styles.flex]} onPress={save} disabled={busy}>
            <Text style={styles.primaryButtonText}>{busy ? "Saving..." : editing ? "Update" : "Save"}</Text>
          </Pressable>
          {editing && (
            <Pressable style={[styles.secondaryButton, styles.flex]} onPress={() => { setEditing(null); setForm(emptyForm); }}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
          )}
        </View>

        <Text style={[styles.subheading, { marginTop: 24 }]}>Saved Addresses</Text>
        {loading ? (
          <Text style={{ textAlign: "center", margin: 24, color: "#6B7280" }}>Loading...</Text>
        ) : addresses.length === 0 ? (
          <Text style={{ textAlign: "center", margin: 24, color: "#6B7280" }}>No addresses saved.</Text>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={[styles.webCard, { marginBottom: 12 }]}>
              <View style={styles.spaceBetween}>
                <Text style={styles.subheading}>{address.label} {address.is_default && "(Default)"}</Text>
                <View style={[styles.row, styles.gapSm]}>
                  <Pressable onPress={() => edit(address)}>
                    <Text style={{ color: colors.primary }}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={() => remove(address.id)}>
                    <Text style={{ color: colors.error }}>Delete</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={styles.body}>{address.name}</Text>
              <Text style={styles.body}>{address.phone}</Text>
              <Text style={styles.body}>{address.address_line}, {address.city}, {address.state} - {address.pincode}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
