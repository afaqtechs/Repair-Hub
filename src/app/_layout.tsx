import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { PresenceProvider } from "@/src/context/PresenceContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

import "../../global.css";

import {
  registerPushToken,
  setupNotificationHandler,
} from "../lib/notifications/registerPushNotifications";
import { handleNotification } from "../lib/notifications/notificationHandler";
import { StatusBar } from "expo-status-bar";

// Keep the native splash screen visible
// until fonts and the initial app shell are ready.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function AppContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setupNotificationHandler();

    const receivedSubscription =
      Notifications.addNotificationReceivedListener(
        (notification) => {
          const content =
            notification.request.content;

          const data = content.data;

          console.log("Notification received:", {
            title: content.title,
            body: content.body,
            data,
          });

          // You can later use this to show
          // an in-app notification/toast.
        }
      );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const content =
            response.notification.request.content;

          const data = content.data;

          console.log("Notification tapped:", {
            title: content.title,
            body: content.body,
            data,
          });

          if (data) {
            handleNotification(router, data);
          }
        }
      );

    const handleInitialNotification =
      async () => {
        try {
          const response =
            await Notifications.getLastNotificationResponseAsync();

          if (!response) {
            return;
          }

          const content =
            response.notification.request.content;

          const data = content.data;

          if (data) {
            handleNotification(router, data);
          }
        } catch (error) {
          console.warn(
            "Failed to handle initial notification:",
            error
          );
        }
      };

    handleInitialNotification();

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [router]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    registerPushToken(user.id);
  }, [user?.id]);

  if (!user) {
    return (
      <>
        <Slot />
        <Toast />
      </>
    );
  }

  return (
    <PresenceProvider userId={user.id}>
      <StatusBar
        style="dark"
        translucent
        backgroundColor="transparent"
      />
      <Slot />
      <Toast />
    </PresenceProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "manrope-regular": require("../../assets/fonts/manrope-regular.otf"),
    "manrope-medium": require("../../assets/fonts/manrope-medium.otf"),
    "manrope-semiBold": require("../../assets/fonts/manrope-semibold.otf"),
    "manrope-bold": require("../../assets/fonts/manrope-bold.otf"),
    "manrope-light": require("../../assets/fonts/manrope-light.otf"),
    "manrope-thin": require("../../assets/fonts/manrope-thin.otf"),
  });

  /**
   * Hide the native splash screen only after
   * fonts have finished loading.
   */
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  /**
   * Keep showing the native splash screen
   * while fonts are loading.
   */
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}