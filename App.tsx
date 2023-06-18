import "react-native-gesture-handler"; // for reac-navigation/drawer
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, Toast } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./app/hooks/useCachedResources";
import Navigation from "./app/navigation/RootNavigator";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "app/store";
import { useCustomNativeBaseColor } from "hooks/index";
import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid } from "react-native";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

export default function App() {

  async function requestUserPermission() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    const token = await messaging().getToken()
    console.log(token)

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // 
      console.log('Message handled in the background!', remoteMessage);
    });
  }
  const customTheme = useCustomNativeBaseColor();

  useEffect(() => {
    TimeAgo.addDefaultLocale(en);
    requestUserPermission()
  })

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Toast.show()
      Alert.alert(remoteMessage.notification?.title ?? "", remoteMessage.notification?.body ?? "");
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"/
        }
        // setLoading(false);
      });
  }, []);

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
