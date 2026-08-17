import { supabase } from "@/src/lib/supabase";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Register this handler once when the app starts.
 *
 * This controls how notifications behave
 * while the application is in the foreground.
 */
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Register the current device for push notifications
 * and save the Expo push token in Supabase.
 */
export async function registerPushToken(
  userId: string
): Promise<string | null> {
  try {
    // Push notifications require a physical device.
    if (!Device.isDevice) {
      console.log(
        "Push notifications require a physical device."
      );

      return null;
    }

    // Check current permission.
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    // Ask permission if we don't have it.
    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log(
        "Notification permission was not granted."
      );

      return null;
    }

    // Android notification channel.
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        "default",
        {
          name: "Default",
          importance:
            Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: "default",
        }
      );
    }

    // Expo project ID.
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.error(
        "Expo projectId could not be found."
      );

      return null;
    }

    // Get Expo Push Token.
    const tokenResponse =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    const token = tokenResponse.data;

    console.log("Expo Push Token:", token);

    // Save token.
    const { error } = await supabase
      .from("push_tokens")
      .upsert(
        {
          userid: userId,
          token,
          platform: Platform.OS,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "userid,token",
        }
      );

    if (error) {
      console.error(
        "Failed to save push token:",
        error
      );

      return null;
    }

    console.log("Push token saved successfully.");

    return token;
  } catch (error) {
    console.error(
      "registerPushToken error:",
      error
    );

    return null;
  }
}