import "react-native-gesture-handler"; // for reac-navigation/drawer
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./app/hooks/useCachedResources";
import Navigation from "./app/navigation/RootNavigator";
import React from "react";
import { Provider } from "react-redux";
import { store } from "app/store";
import { useCustomNativeBaseColor } from "hooks/index";

export default function App() {
  const customTheme = useCustomNativeBaseColor();

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NativeBaseProvider theme={customTheme}>
          <Navigation />
          <StatusBar translucent />
        </NativeBaseProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
