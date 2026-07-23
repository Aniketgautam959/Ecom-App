import { FlatList, Image, Pressable, SafeAreaView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { assetUrl } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
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
                  <Feather name="grid" size={32} color={colors.textLight} />
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
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 60 }}>
            <Feather name="grid" size={48} color={colors.mutedDark} style={{ marginBottom: 16 }} />
            <Text style={{ color: colors.textLight }}>No categories found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
