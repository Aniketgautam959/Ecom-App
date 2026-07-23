import { FlatList, Image, Pressable, SafeAreaView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { assetUrl } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { Brand } from "../types";

export function Brands({ back }: { back: () => void }) {
  const { go, cartCount, brands, setSelectedBrand } = useApp();

  const onBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    go("brand-products");
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Brands" back={back} go={go} cartCount={cartCount} />
      <FlatList
        data={brands}
        numColumns={2}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Feather name="image" size={48} color={colors.mutedDark} style={{ marginBottom: 16 }} />
              <Text style={{ color: colors.textLight }}>No brands found.</Text>
            </View>
          }
        renderItem={({ item }: { item: Brand }) => (
          <Pressable style={styles.grid2Col} onPress={() => onBrand(item)}>
            <View style={styles.card}>
              <View style={[styles.cardImage, { aspectRatio: 1.2 }]}>
                {item.image ? (
                  <Image source={{ uri: assetUrl(item.image) }} style={styles.image} resizeMode="cover" />
                ) : (
                  <Feather name="image" size={32} color={colors.textLight} />
                )}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
