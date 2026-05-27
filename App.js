import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import axios from "axios";

import AppNavigator from "./AppNavigator";
import { store } from "./src/store/store";
import { getIntegrityToken } from "./utils/integrity";
import { BASE_URL } from "./utils/config";

// Global notification handler - wrapped in try-catch for Expo Go compatibility
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
    }),
  });
} catch (error) {
  console.warn("Notification handler setup failed in Expo Go:", error.message);
}

export default function App() {
  const initRef = useRef(false);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        await Notifications.requestPermissionsAsync();
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
          });
        }
      } catch (error) {
        console.warn("Notification setup failed in Expo Go:", error.message);
      }
    })();
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await AsyncStorage.getItem("access_token");
        if (mounted) setAccessToken(t || null);
        const uid = await AsyncStorage.getItem("user_id");
        if (mounted) setUserId(uid || null);
      } catch {
        if (mounted) {
          setAccessToken(null);
          setUserId(null);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    try {
      const subscription = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content.data;
          console.log("Notification pressed:", data);

          if (data?.zoomus) {
            Linking.openURL(data.zoomus).catch(err =>
              console.warn("Cannot open zoom deep link:", err)
            );
            return;
          }

          if (data?.zoom_url) {
            Linking.openURL(data.zoom_url).catch(err =>
              console.warn("Cannot open zoom web link:", err)
            );
            return;
          }

          if (data?.meet_url) {
            Linking.openURL(data.meet_url).catch(err =>
              console.warn("Cannot open meet link:", err)
            );
            return;
          }

          if (data?.deep_link) {
            Linking.openURL(data.deep_link).catch(err =>
              console.warn("Cannot open deep link:", err)
            );
            return;
          }
        }
      );

      return () => subscription.remove();
    } catch (error) {
      console.warn("Notification listener setup failed in Expo Go:", error.message);
    }
  }, []);

  useEffect(() => {
    const checkIntegrity = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          console.log("No access token found, skipping integrity check.");
          return;
        }
        
        if (__DEV__ || Platform.isTVOS || Platform.OS === 'ios') {
          console.log("Development environment detected, skipping integrity check.");
          return;
        }
        
        const { token: integrityToken, nonce } = await getIntegrityToken();
        const headersObj = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Integrity-Token": integrityToken,
          "X-Integrity-Nonce": nonce,
        };
        
        const res = await axios.post(
          `${BASE_URL}/security/verify-device`,
          {
            integrity_token: integrityToken,
            nonce,
          },
          { headers: headersObj }
        );
        
        if (!res.data.allowed) {
          throw new Error("Device / app failed integrity: " + res.data.reason);
        }

      } catch (error) {
        console.error("Integrity check failed:", error.message);
        if (__DEV__) {
          console.warn("Development mode: Integrity check skipped due to:", error.message);
          return;
        }
        
        if (error.message.includes("Network error") || error.message.includes("Network request failed")) {
          console.warn("Network connectivity issue detected. Please check your internet connection.");
        }
      }
    };
    
    checkIntegrity();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}
