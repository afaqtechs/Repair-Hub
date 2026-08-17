import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { PresenceProvider } from "@/src/context/PresenceContext";
import { ThemeProvider } from "@/src/context/ThemeContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../../global.css";
import { registerPushToken, setupNotificationHandler } from "../lib/notifications/registerPushNotifications";

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

    // Notification received while app is open.
    const receivedSubscription =
      Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log(
            "Notification received:",
            notification
          );
        }
      );

    // User taps notification.
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data =
            response.notification.request.content
              .data;

          console.log(
            "Notification tapped:",
            data
          );

          if (data?.type === "new_request") {
            const requestId =
              data?.request_id;

            if (requestId) {
              // router.push(
              //   `/requests/${requestId}`
              // );
            }
          }
        }
      );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [router]);

  useEffect(() => {
    if (!user?.id) return;

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
    <PresenceProvider
      userId={user.id}
    >

      <Slot />
      <Toast />
    </PresenceProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "manrope-regular": require("../../assets/fonts/manrope-regular.otf"),
    "manrope-medium": require("../../assets/fonts/manrope-medium.otf"),
    "manrope-semiBold": require("../../assets/fonts/manrope-semibold.otf"),
    "manrope-bold": require("../../assets/fonts/manrope-bold.otf"),
    "manrope-light": require("../../assets/fonts/manrope-light.otf"),
    "manrope-thin": require("../../assets/fonts/manrope-thin.otf"),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}