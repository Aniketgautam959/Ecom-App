import { FlatList, Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { assetUrl } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";
import type { Category } from "../types";

export function Categories({ back }: { back: () => void }) {
  const { go, cartCount, categories, setSelectedCategory } = useApp();

  const onCategory = (category: Category) => {
    setSelectedCategory(category);
    go("category-products");
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Categories" back={back} go={go} cartCount={cartCount} />
      <FlatList
        data={categories}
        numColumns={2}
        contentContainerStyle={styles.grid}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: Category }) => (
          <Pressable style={styles.grid2Col} onPress={() => onCategory(item)}>
            <View style={styles.card}>
              <View style={[styles.cardImage, { aspectRatio: 1.2 }]}>
                {item.image ? (
                  <Image source={{ uri: assetUrl(item.image) }} style={styles.image} resizeMode="cover" />
                ) : (
                  <Text style={styles.placeholder}>Category</Text>
                )}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.name}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", margin: 24, color: "#6B7280" }}>No categories.</Text>}
      />
    </SafeAreaView>
  );
}
