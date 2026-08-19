import { supabase } from "@/src/lib/supabase";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Configure how notifications behave while the app
 * is running in the foreground.
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

  console.log("[Notifications] Handler configured");
}

/**
 * Register the current device for push notifications
 * and save the Expo Push Token in Supabase.
 *
 * This function does not throw errors.
 * All failures are logged and null is returned.
 */
export async function registerPushToken(
  userId: string
): Promise<string | null> {
  console.log("[Notifications] Starting push token registration...");

  try {
    // --------------------------------------------------
    // Validate user
    // --------------------------------------------------

    if (!userId) {
      console.log(
        "[Notifications] No user ID provided. Skipping registration."
      );
      return null;
    }

    console.log("[Notifications] User ID:", userId);

    // --------------------------------------------------
    // Check physical device
    // --------------------------------------------------

    if (!Device.isDevice) {
      console.log(
        "[Notifications] Not a physical device. Push notifications skipped."
      );
      return null;
    }

    console.log("[Notifications] Physical device detected.");

    // --------------------------------------------------
    // Check notification permission
    // --------------------------------------------------

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    console.log(
      "[Notifications] Existing permission:",
      existingStatus
    );

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      console.log(
        "[Notifications] Requesting notification permission..."
      );

      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;

      console.log(
        "[Notifications] Permission result:",
        finalStatus
      );
    }

    if (finalStatus !== "granted") {
      console.log(
        "[Notifications] Permission not granted. Registration skipped."
      );
      return null;
    }

    console.log("[Notifications] Permission granted.");

    // --------------------------------------------------
    // Android notification channel
    // --------------------------------------------------

    if (Platform.OS === "android") {
      console.log(
        "[Notifications] Creating Android notification channel..."
      );

      await Notifications.setNotificationChannelAsync(
        "default",
        {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: "default",
        }
      );

      console.log(
        "[Notifications] Android notification channel ready."
      );
    }

    // --------------------------------------------------
    // Get EAS project ID
    // --------------------------------------------------

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.log(
        "[Notifications] EAS project ID not found. Registration skipped."
      );
      return null;
    }

    console.log(
      "[Notifications] EAS project ID:",
      projectId
    );

    // --------------------------------------------------
    // Get Expo Push Token
    // --------------------------------------------------

    console.log(
      "[Notifications] Requesting Expo Push Token..."
    );

    const { data: expoPushToken } =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    if (!expoPushToken) {
      console.log(
        "[Notifications] Expo Push Token was not returned."
      );
      return null;
    }

    console.log(
      "[Notifications] Expo Push Token received:",
      expoPushToken
    );

    // --------------------------------------------------
    // Save token to Supabase
    // --------------------------------------------------

    console.log(
      "[Notifications] Saving push token to Supabase..."
    );

    const { error } = await supabase
      .from("push_tokens")
      .upsert(
        {
          userid: userId,
          token: expoPushToken,
          platform: Platform.OS,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "userid,token",
        }
      );

    if (error) {
      console.log(
        "[Notifications] Failed to save push token:",
        error.message
      );

      return null;
    }

    console.log(
      "[Notifications] Push token saved successfully."
    );

    console.log(
      "[Notifications] Registration completed successfully."
    );

    return expoPushToken;
  } catch (error) {
    console.log(
      "[Notifications] Registration failed:",
      error instanceof Error
        ? error.message
        : error
    );

    return null;
  }
}