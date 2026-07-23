import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { api, unwrap } from "../api";
import { colors, spacing } from "../styles";
import type { Screen } from "../types";

interface FooterMenu {
  id: number;
  label: string;
  url: string;
}

function screenFromUrl(url: string): Screen {
  return (url.replace(/^\//, "").replace(/\/$/, "") as Screen) ?? "home";
}

export function Footer({ go }: { go: (screen: Screen) => void }) {
  const [footerMenus, setFooterMenus] = useState<FooterMenu[]>([]);

  useEffect(() => {
    let active = true;
    api
      .get("/menus/footer")
      .then((res) => {
        if (!active) return;
        setFooterMenus((unwrap(res) as FooterMenu[]) ?? []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const linkStyle = { fontSize: 13, color: colors.textMuted, paddingVertical: 5 };
  const headingStyle = {
    fontSize: 11,
    fontWeight: "700" as const,
    color: colors.textLight,
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  };

  return (
    <View style={{ backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.mutedDark }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl }}>
        {/* Brand column */}
        <View style={{ marginBottom: spacing.xxl }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>E</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>Ecommerce</Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: spacing.md, lineHeight: 20 }}>
            DevCut is a YouTube channel for practical project-based learning.
          </Text>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <Pressable onPress={() => Linking.openURL("https://github.com")}>
              <Feather name="github" size={20} color={colors.textMuted} />
            </Pressable>
            <Pressable onPress={() => Linking.openURL("https://instagram.com")}>
              <Feather name="instagram" size={20} color={colors.textMuted} />
            </Pressable>
            <Pressable onPress={() => Linking.openURL("https://youtube.com")}>
              <Feather name="youtube" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* Support */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={headingStyle}>Support</Text>
          <Pressable onPress={() => go("faq")}>
            <Text style={linkStyle}>FAQ</Text>
          </Pressable>
          <Pressable onPress={() => go("terms-conditions")}>
            <Text style={linkStyle}>Terms of use</Text>
          </Pressable>
          <Pressable onPress={() => go("privacy-policy")}>
            <Text style={linkStyle}>Privacy Policy</Text>
          </Pressable>
        </View>

        {/* Quick Links */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={headingStyle}>Quick Links</Text>
          {footerMenus.length > 0 ? (
            footerMenus.map((menu) => (
              <Pressable key={menu.id} onPress={() => go(screenFromUrl(menu.url))}>
                <Text style={linkStyle}>{menu.label}</Text>
              </Pressable>
            ))
          ) : (
            <>
              <Pressable onPress={() => go("about")}>
                <Text style={linkStyle}>About us</Text>
              </Pressable>
              <Pressable onPress={() => go("contact")}>
                <Text style={linkStyle}>Contact</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Shop */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={headingStyle}>Shop</Text>
          <Pressable onPress={() => go("account")}>
            <Text style={linkStyle}>My Account</Text>
          </Pressable>
          <Pressable onPress={() => go("checkout")}>
            <Text style={linkStyle}>Checkout</Text>
          </Pressable>
          <Pressable onPress={() => go("cart")}>
            <Text style={linkStyle}>Cart</Text>
          </Pressable>
        </View>

        {/* Accepted Payments */}
        <View>
          <Text style={headingStyle}>Accepted Payments</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#EF4444", opacity: 0.9 }} />
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#FB923C",
                  opacity: 0.9,
                  marginLeft: -8,
                }}
              />
            </View>
            <View style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 11, fontWeight: "800", color: "#2563EB" }}>AMEX</Text>
            </View>
            <View style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 11, fontWeight: "800", color: "#1E40AF" }}>VISA</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Copyright */}
      <View style={{ borderTopWidth: 1, borderTopColor: colors.muted, paddingVertical: spacing.lg }}>
        <Text style={{ textAlign: "center", fontSize: 11, color: colors.textLight }}>
          © 2023 DevCut. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
