import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import type { ComponentType } from "react";

import { useApp } from "../context/AppContext";
import { About } from "../screens/About";
import { Account } from "../screens/Account";
import { Addresses } from "../screens/Addresses";
import { Auth } from "../screens/Auth";
import { BrandProducts } from "../screens/BrandProducts";
import { Brands } from "../screens/Brands";
import { Cart } from "../screens/Cart";
import { Categories } from "../screens/Categories";
import { CategoryProducts } from "../screens/CategoryProducts";
import { Checkout } from "../screens/Checkout";
import { Contact } from "../screens/Contact";
import { Faq } from "../screens/Faq";
import { Home } from "../screens/Home";
import { Notifications } from "../screens/Notifications";
import { Onboarding } from "../screens/Onboarding";
import { OrderDetails } from "../screens/OrderDetails";
import { OrderFailed } from "../screens/OrderFailed";
import { OrderSuccess } from "../screens/OrderSuccess";
import { Orders } from "../screens/Orders";
import { Payment } from "../screens/Payment";
import { PrivacyPolicy } from "../screens/PrivacyPolicy";
import { ProductDetail } from "../screens/ProductDetail";
import { Profile } from "../screens/Profile";
import { Search } from "../screens/Search";
import { Settings } from "../screens/Settings";
import { Shop } from "../screens/Shop";
import { Support } from "../screens/Support";
import { TermsConditions } from "../screens/TermsConditions";
import { Track } from "../screens/Track";
import { Wishlist } from "../screens/Wishlist";
import type { Screen } from "../types";
import type { RootStackParamList } from "./types";

function withBack<P extends object>(
  Component: ComponentType<P & { back: () => void }>
): ComponentType<P> {
  return function Wrapped(props: P) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const back = useCallback(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Home");
      }
    }, [navigation]);
    return <Component {...props} back={back} />;
  };
}

function HomeScreen() {
  const { loading } = useApp();
  return <Home loading={loading} />;
}

function OnboardingScreen() {
  const { go } = useApp();
  const done = async () => {
    await AsyncStorage.setItem("onboarding_seen", "true");
    go("login");
  };
  return <Onboarding done={done} />;
}

function AuthScreen() {
  const route = useRoute<any>();
  const mode = route.params?.mode ?? "login";
  return <Auth mode={mode} />;
}

export const screenComponents: { name: keyof RootStackParamList; component: ComponentType<any> }[] = [
  { name: "Onboarding", component: OnboardingScreen },
  { name: "Auth", component: AuthScreen },
  { name: "Home", component: HomeScreen },
  { name: "Shop", component: withBack(Shop) },
  { name: "Categories", component: withBack(Categories) },
  { name: "CategoryProducts", component: withBack(CategoryProducts) },
  { name: "Brands", component: withBack(Brands) },
  { name: "BrandProducts", component: withBack(BrandProducts) },
  { name: "Search", component: withBack(Search) },
  { name: "Product", component: withBack(ProductDetail) },
  { name: "Wishlist", component: withBack(Wishlist) },
  { name: "Cart", component: withBack(Cart) },
  { name: "Checkout", component: withBack(Checkout) },
  { name: "Payment", component: withBack(Payment) },
  { name: "OrderSuccess", component: withBack(OrderSuccess) },
  { name: "OrderFailed", component: withBack(OrderFailed) },
  { name: "Orders", component: withBack(Orders) },
  { name: "OrderDetails", component: withBack(OrderDetails) },
  { name: "Track", component: withBack(Track) },
  { name: "Profile", component: withBack(Profile) },
  { name: "Account", component: withBack(Account) },
  { name: "Addresses", component: withBack(Addresses) },
  { name: "Notifications", component: withBack(Notifications) },
  { name: "Settings", component: withBack(Settings) },
  { name: "About", component: withBack(About) },
  { name: "Contact", component: withBack(Contact) },
  { name: "Faq", component: withBack(Faq) },
  { name: "PrivacyPolicy", component: withBack(PrivacyPolicy) },
  { name: "TermsConditions", component: withBack(TermsConditions) },
  { name: "Support", component: withBack(Support) },
];
