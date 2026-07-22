import { useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { assetUrl } from "../api";
import { Footer } from "../components/Footer";
import { Nav } from "../components/Nav";
import { ProductCard } from "../components/ProductCard";
import { useApp } from "../context/AppContext";
import { colors, spacing, styles } from "../styles";
import type { Brand, Category, Product } from "../types";

const heroImage = "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=85";

const featuresStrip = [
  { icon: "🚚", title: "Free Shipping", desc: "Upgrade your style today and get FREE shipping on all orders! Don't miss out." },
  { icon: "🏅", title: "Satisfaction Guarantee", desc: "Shop confidently with our Satisfaction Guarantee: Love it or we'll refund." },
  { icon: "🛡", title: "Secure Payment", desc: "Your security is our priority. Your payments are with us." },
];

const trustBadges = [
  { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹500" },
  { icon: "↺", title: "Easy Returns", desc: "7-day return policy" },
  { icon: "🛡", title: "Secure Payment", desc: "100% secure checkout" },
  { icon: "🎧", title: "24/7 Support", desc: "Always here to help" },
];

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={{ alignItems: "center", marginBottom: spacing.xl, paddingHorizontal: spacing.lg }}>
      <Text style={{ fontSize: 11, letterSpacing: 2, color: colors.textLight, textTransform: "uppercase", marginBottom: spacing.sm }}>
        {eyebrow}
      </Text>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>{title}</Text>
    </View>
  );
}

export function Home({ loading }: { loading: boolean }) {
  const { go, cartCount, featured, latest, categories, brands, products, setSelectedProduct, setSelectedCategory, setSelectedBrand, toggleWishlist, wishlist } = useApp();
  const [activeTab, setActiveTab] = useState<"featured" | "latest">("featured");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const select = (product: Product) => {
    setSelectedProduct(product);
    go("product");
  };

  const tabProducts = activeTab === "featured" ? featured : (latest.length ? latest : products);

  return (
    <SafeAreaView style={styles.flex}>
      {/* Header — same as web navbar: round E logo + Ecommerce */}
      <View style={styles.webNav}>
        <View style={styles.webBrand}>
          <View style={styles.webBrandMark}>
            <Text style={styles.webBrandLetter}>E</Text>
          </View>
          <Text style={[styles.webBrandText, { fontSize: 18, fontWeight: "800" }]}>Ecommerce</Text>
        </View>
        <View style={styles.webNavActions}>
          <Pressable onPress={() => go("search")}>
            <Text style={styles.webNavIcon}>⌕</Text>
          </Pressable>
          <Pressable onPress={() => go("cart")} style={{ position: "relative" }}>
            <Text style={styles.webNavIcon}>🛒</Text>
            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -6,
                  right: -8,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{cartCount > 99 ? "99+" : cartCount}</Text>
              </View>
            )}
          </Pressable>
          <Pressable onPress={() => go("profile")}>
            <Text style={styles.webNavIcon}>◯</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero — same as web HeroSection */}
        <View style={{ backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl }}>
          <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 3, textTransform: "uppercase", color: colors.textLight, marginBottom: spacing.lg }}>
            New Collection 2025
          </Text>
          <Text style={{ fontSize: 40, fontWeight: "800", color: colors.text, lineHeight: 46, marginBottom: spacing.lg }}>
            Fresh Arrivals Online
          </Text>
          <Text style={{ fontSize: 15, color: colors.textMuted, marginBottom: spacing.xxl }}>
            Discover Our Newest Collection Today.
          </Text>
          <View style={[styles.row, styles.gapLg, { marginBottom: spacing.xl }]}>
            <Pressable
              style={{ backgroundColor: colors.primary, paddingVertical: 16, paddingHorizontal: 28, flexDirection: "row", alignItems: "center", gap: spacing.sm }}
              onPress={() => go("shop")}
            >
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700", letterSpacing: 0.5 }}>View Collection</Text>
              <Text style={{ color: "#fff", fontSize: 14 }}>→</Text>
            </Pressable>
            <Pressable onPress={() => go("shop")}>
              <Text style={{ fontSize: 13, color: colors.textMuted, textDecorationLine: "underline" }}>Browse all</Text>
            </Pressable>
          </View>

          {/* Hero image with SS 2025 tag + price badge, gray backdrop like web */}
          <View style={{ backgroundColor: colors.muted, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}>
            <View style={{ position: "relative" }}>
              <Image source={{ uri: heroImage }} style={{ width: "100%", height: 420 }} resizeMode="cover" />
              <View style={{ position: "absolute", top: spacing.xl, left: spacing.md, backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 2, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
                <Text style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: colors.textLight }}>Season</Text>
                <Text style={{ fontSize: 13, fontWeight: "800", color: colors.text }}>SS 2025</Text>
              </View>
              <View style={{ position: "absolute", bottom: spacing.xl, right: spacing.md, backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 2 }}>
                <Text style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: "#fff", opacity: 0.6 }}>Starting from</Text>
                <Text style={{ fontSize: 19, fontWeight: "800", color: "#fff" }}>₹999</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features strip — same 3 items as web FeaturesStrip */}
        <View style={{ backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.muted, paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl, gap: spacing.xl }}>
          {featuresStrip.map((f) => (
            <View key={f.title} style={{ gap: spacing.sm }}>
              <Text style={{ fontSize: 24 }}>{f.icon}</Text>
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text }}>{f.title}</Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, lineHeight: 20 }}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Shop Categories — same as web CategoryGrid */}
        <View style={{ backgroundColor: colors.background, paddingVertical: spacing.xxl }}>
          <SectionHeading eyebrow="Browse By" title="Shop Categories" />
          {categories.length === 0 ? (
            <Text style={{ textAlign: "center", color: colors.textLight, paddingVertical: spacing.xl }}>No categories available.</Text>
          ) : (
            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.lg }}
              renderItem={({ item }: { item: Category }) => (
                <Pressable
                  style={{ alignItems: "center", width: 104 }}
                  onPress={() => {
                    setSelectedCategory(item);
                    go("category-products");
                  }}
                >
                  <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.mutedDark, overflow: "hidden", justifyContent: "center", alignItems: "center", marginBottom: spacing.md }}>
                    {item.image ? (
                      <Image source={{ uri: assetUrl(item.image) }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    ) : (
                      <Text style={{ fontSize: 11, color: colors.textLight, textAlign: "center", paddingHorizontal: 6 }}>{item.name}</Text>
                    )}
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text, textAlign: "center" }} numberOfLines={2}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>

        {/* Best Selling — same as web BestSellingSection */}
        <View style={{ backgroundColor: colors.background, paddingVertical: spacing.xxl }}>
          <SectionHeading eyebrow="Shop Now" title="Best Selling" />
          {loading ? (
            <ActivityIndicator style={{ margin: 24 }} />
          ) : featured.length === 0 ? (
            <Text style={{ textAlign: "center", color: colors.textLight, paddingVertical: spacing.xl }}>No products available yet.</Text>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: spacing.sm }}>
              {featured.slice(0, 4).map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onPress={() => select(item)}
                  onWish={() => toggleWishlist(item)}
                  wished={wishlist.some((w) => w.id === item.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Browse Banner — same as web BrowseBanner */}
        <View style={{ backgroundColor: "#F9FAFB", paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl }}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: spacing.md }}>
            Browse Our Fashion Paradise!
          </Text>
          <Text style={{ fontSize: 13, color: colors.textMuted, lineHeight: 20, marginBottom: spacing.xl }}>
            Step into a world of style and explore our diverse collection of clothing categories.
          </Text>
          <Pressable
            style={{ backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: spacing.sm }}
            onPress={() => go("shop")}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>Start Browsing</Text>
            <Text style={{ color: "#fff", fontSize: 14 }}>→</Text>
          </Pressable>
        </View>

        {/* Featured / Latest tabs — same as web FeaturedProductsSection */}
        <View style={{ backgroundColor: colors.background, paddingVertical: spacing.xxl }}>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: spacing.xl, marginBottom: spacing.xl }}>
            <Pressable onPress={() => setActiveTab("featured")} style={{ paddingBottom: 4, borderBottomWidth: 2, borderBottomColor: activeTab === "featured" ? colors.primary : "transparent" }}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: activeTab === "featured" ? colors.text : colors.textLight }}>Featured</Text>
            </Pressable>
            <Pressable onPress={() => setActiveTab("latest")} style={{ paddingBottom: 4, borderBottomWidth: 2, borderBottomColor: activeTab === "latest" ? colors.primary : "transparent" }}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: activeTab === "latest" ? colors.text : colors.textLight }}>Latest</Text>
            </Pressable>
          </View>
          {loading ? (
            <ActivityIndicator style={{ margin: 24 }} />
          ) : tabProducts.length === 0 ? (
            <Text style={{ textAlign: "center", color: colors.textLight, paddingVertical: spacing.xl }}>No products available yet.</Text>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: spacing.sm }}>
              {tabProducts.slice(0, 4).map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onPress={() => select(item)}
                  onWish={() => toggleWishlist(item)}
                  wished={wishlist.some((w) => w.id === item.id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Offers — same as web OffersSection */}
        <View style={{ backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl, gap: spacing.lg }}>
          <View style={{ backgroundColor: colors.primary, borderRadius: 10, padding: 28, minHeight: 200, justifyContent: "center" }}>
            <Text style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#9CA3AF", marginBottom: spacing.sm }}>Summer Sale</Text>
            <Text style={{ fontSize: 26, fontWeight: "800", color: "#fff", marginBottom: spacing.md }}>Up to 50% Off</Text>
            <Text style={{ fontSize: 13, color: "#D1D5DB", marginBottom: spacing.xl }}>On selected styles and new arrivals.</Text>
            <Pressable style={{ backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 4, alignSelf: "flex-start" }} onPress={() => go("shop")}>
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>Shop Now</Text>
            </Pressable>
          </View>
          <View style={{ backgroundColor: colors.muted, borderRadius: 10, borderWidth: 1, borderColor: colors.mutedDark, padding: 28, minHeight: 200, justifyContent: "center" }}>
            <Text style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.textLight, marginBottom: spacing.sm }}>New Arrivals</Text>
            <Text style={{ fontSize: 26, fontWeight: "800", color: colors.text, marginBottom: spacing.md }}>Fresh Collection</Text>
            <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: spacing.xl }}>Discover the latest trends this season.</Text>
            <Pressable style={{ backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 4, alignSelf: "flex-start" }} onPress={() => go("shop")}>
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Explore</Text>
            </Pressable>
          </View>

          {/* Trust badges */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderTopColor: colors.muted, paddingTop: spacing.xl, marginTop: spacing.md }}>
            {trustBadges.map((offer) => (
              <View key={offer.title} style={{ width: "50%", flexDirection: "row", gap: spacing.md, marginBottom: spacing.xl, paddingRight: spacing.sm }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.muted, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ fontSize: 16 }}>{offer.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>{offer.title}</Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted }}>{offer.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Top Brands — same as web BrandGrid */}
        <View style={{ backgroundColor: "#F9FAFB", paddingVertical: spacing.xxl }}>
          <SectionHeading eyebrow="Trusted" title="Top Brands" />
          {brands.length === 0 ? (
            <Text style={{ textAlign: "center", color: colors.textLight, paddingVertical: spacing.xl }}>No brands available.</Text>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: spacing.md }}>
              {brands.map((brand: Brand) => (
                <Pressable
                  key={brand.id}
                  style={{ width: "50%", padding: spacing.xs }}
                  onPress={() => {
                    setSelectedBrand(brand);
                    go("brand-products");
                  }}
                >
                  <View style={{ height: 90, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.mutedDark, borderRadius: 10, justifyContent: "center", alignItems: "center", overflow: "hidden", padding: spacing.md }}>
                    {brand.logo ?? brand.image ? (
                      <Image source={{ uri: assetUrl(brand.logo ?? brand.image) }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                    ) : (
                      <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textMuted }}>{brand.name}</Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Newsletter — same as web NewsletterSection */}
        <View style={{ backgroundColor: colors.muted, paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: spacing.sm }}>Join Our Newsletter</Text>
          <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: spacing.lg }}>
            We love to surprise our subscribers with occasional gifts.
          </Text>
          {subscribed ? (
            <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }}>Thank you for subscribing! 🎉</Text>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder="Your email address"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, borderWidth: 1, borderColor: "#D1D5DB", backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, color: colors.text }}
              />
              <Pressable
                style={{ backgroundColor: colors.primary, paddingHorizontal: 20, justifyContent: "center" }}
                onPress={() => {
                  if (email.trim()) {
                    setSubscribed(true);
                    setEmail("");
                  }
                }}
              >
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Subscribe</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Footer — same as web EcomFooter */}
        <Footer go={go} />
      </ScrollView>
      <Nav go={go} active="home" />
    </SafeAreaView>
  );
}
