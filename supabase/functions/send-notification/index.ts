import { createClient } from '@supabase/supabase-js';

interface NotificationRequest {
  userid: string;
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

    const payload =
      (await req.json()) as NotificationRequest;

    const {
      userid,
      type,
      title,
      body,
      data = {},
    } = payload;

    // ------------------------------------------
    // 2. Validate request
    // ------------------------------------------

    if (
      !userid ||
      !type ||
      !title ||
      !body
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "userid, type, title and body are required.",
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
    // 3. Create Supabase admin client
    // ------------------------------------------

    const supabase = createClient(
      Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!,
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      )!
    );

    // ------------------------------------------
    // 4. Check notification setting
    // ------------------------------------------

    const {
      data: setting,
      error: settingError,
    } = await supabase
      .from("notifications_settings")
      .select("enable")
      .eq("userid", userid)
      .eq("type", type)
      .maybeSingle();

    if (settingError) {
      console.log(settingError);
    }

    // Notification disabled or not configured.
    if (!setting || setting.enable !== true) {
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
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 5. Get push tokens
    // ------------------------------------------

    const {
      data: tokens,
      error: tokenError,
    } = await supabase
      .from("push_tokens")
      .select("id, token")
      .eq("userid", userid);

    if (tokenError) {
      console.log(tokenError);
    }

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          sent: false,
          reason: "No push token found.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );
    }

    // ------------------------------------------
    // 6. Create Expo messages
    // ------------------------------------------

    const pushTokens =
      tokens as PushToken[];

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
    // 7. Send notification to Expo
    // ------------------------------------------

    const expoResponse = await fetch(
      "https://exp.host/--/api/v2/push/send",
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(messages),
      }
    );

    const expoResult =
      await expoResponse.json();

    console.log(
      "Expo response:",
      expoResult
    );

    // ------------------------------------------
    // 8. Return result
    // ------------------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        sent: true,
        result: expoResult,
      }),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Notification error:",
      error
    );

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});