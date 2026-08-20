import { createClient } from "@supabase/supabase-js";

interface NotificationRequest {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface PushToken {
  id: string;
  token: string;
}

Deno.serve(async (req: Request) => {
  try {
   
    // ------------------------------------------
    // 1. Read request body
    // ------------------------------------------

    let payload: NotificationRequest;

    try {
      payload = (await req.json()) as NotificationRequest;
    } catch (error) {
      console.log(
        "[send-notification] Failed to parse request body:",
        error
      );

      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON request body.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const {
      userId,
      type,
      title,
      body,
      data = {},
    } = payload;


    // ------------------------------------------
    // 2. Validate request
    // ------------------------------------------

    if (!userId || !type || !title || !body) {
      console.log(
        "[send-notification] Missing required fields."
      );

      return new Response(
        JSON.stringify({
          success: false,
          error:
            "userId, type, title and body are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 3. Get Supabase environment variables
    // ------------------------------------------

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl) {
      console.log(
        "[send-notification] SUPABASE_URL is missing."
      );

      return new Response(
        JSON.stringify({
          success: false,
          error: "SUPABASE_URL is not configured.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!serviceRoleKey) {
      console.log(
        "[send-notification] SUPABASE_SERVICE_ROLE_KEY is missing."
      );

      return new Response(
        JSON.stringify({
          success: false,
          error:
            "SUPABASE_SERVICE_ROLE_KEY is not configured.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 4. Create Supabase admin client
    // ------------------------------------------

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    );


    // ------------------------------------------
    // 5. Check notification setting
    // ------------------------------------------

    const {
      data: setting,
      error: settingError,
    } = await supabase
      .from("notification_settings")
      .select("enabled")
      .eq("user_id", userId)
      .eq("type", type)
      .maybeSingle();

    if (settingError) {
      console.log(
        "[send-notification] Notification setting error:",
        settingError
      );

      return new Response(
        JSON.stringify({
          success: false,
          sent: false,
          error:
            "Failed to check notification settings.",
          details: settingError.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 6. Notification disabled
    // ------------------------------------------

    if (!setting || setting.enabled !== true) {
      console.log(
        "[send-notification] Notification disabled or not configured."
      );

      return new Response(
        JSON.stringify({
          success: true,
          sent: false,
          reason:
            "Notification disabled or not configured.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const {
      data: tokens,
      error: tokenError,
    } = await supabase
      .from("push_tokens")
      .select("id, token")
      .eq("user_id", userId);

    if (tokenError) {
      console.log(
        "[send-notification] Push token error:",
        tokenError
      );

      return new Response(
        JSON.stringify({
          success: false,
          sent: false,
          error:
            "Failed to retrieve push tokens.",
          details: tokenError.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 8. No push tokens
    // ------------------------------------------

    if (!tokens || tokens.length === 0) {
      console.log(
        "[send-notification] No push token found."
      );

      return new Response(
        JSON.stringify({
          success: true,
          sent: false,
          reason: "No push token found.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 9. Validate tokens
    // ------------------------------------------

    const pushTokens = (
      tokens as PushToken[]
    ).filter(
      (item) =>
        item.token &&
        item.token.trim().length > 0
    );

    if (pushTokens.length === 0) {
      console.log(
        "[send-notification] No valid push tokens found."
      );

      return new Response(
        JSON.stringify({
          success: true,
          sent: false,
          reason: "No valid push tokens found.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 10. Create Expo push messages
    // ------------------------------------------

    const messages = pushTokens.map(
      (item: PushToken) => ({
        to: item.token,
        sound: "default",
        title,
        body,
        data,
      })
    );

    // ------------------------------------------
    // 11. Send notification to Expo
    // ------------------------------------------

    const expoResponse = await fetch(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(messages),
      }
    );


    const expoResult =
      await expoResponse.json();


    // ------------------------------------------
    // 12. Handle Expo failure
    // ------------------------------------------

    if (!expoResponse.ok) {
      console.log(
        "[send-notification] Expo request failed."
      );

      return new Response(
        JSON.stringify({
          success: false,
          sent: false,
          error:
            "Expo push notification request failed.",
          status: expoResponse.status,
          result: expoResult,
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 13. Return success
    // ------------------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        sent: true,
        tokenCount: pushTokens.length,
        result: expoResult,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // ------------------------------------------
    // Global error
    // ------------------------------------------

    console.log(
      "[send-notification] Unexpected error:",
      error
    );

    return new Response(
      JSON.stringify({
        success: false,
        sent: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});