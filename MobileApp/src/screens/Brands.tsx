import { FlatList, Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { assetUrl } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";
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
        ListEmptyComponent={<Text style={{ textAlign: "center", margin: 24, color: "#6B7280" }}>No brands found.</Text>}
        renderItem={({ item }: { item: Brand }) => (
          <Pressable style={styles.grid2Col} onPress={() => onBrand(item)}>
            <View style={styles.card}>
              <View style={[styles.cardImage, { aspectRatio: 1.2 }]}>
                {item.image ? (
                  <Image source={{ uri: assetUrl(item.image) }} style={styles.image} resizeMode="cover" />
                ) : (
                  <Text style={styles.placeholder}>{item.name.charAt(0)}</Text>
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
