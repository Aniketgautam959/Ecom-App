import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/context/AppContext";
import { screenToRoute } from "./src/navigation/helpers";
import { navigationRef } from "./src/navigation/ref";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { styles } from "./src/styles";
import type { Screen } from "./src/types";
import type { RootStackParamList } from "./src/navigation/types";

export default function App() {
  const [ready, setReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Auth");

  useEffect(() => {
    (async () => {
      const [seen, savedUser] = await Promise.all([
        AsyncStorage.getItem("onboarding_seen"),
        AsyncStorage.getItem("user"),
      ]);
      let start: Screen = "login";
      if (!seen) start = "onboarding";
      else if (savedUser) start = "home";
      setInitialRoute(screenToRoute(start));
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <AppProvider>
          <RootNavigator initialRouteName={initialRoute} />
        </AppProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
