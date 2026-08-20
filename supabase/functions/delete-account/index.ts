import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req:any) => {
    try {
        const authHeader = req.headers.get("Authorization");

        if (!authHeader) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized",
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        // Client authenticated as the current user
        const supabase = createClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                global: {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            }
        );

        // Admin client - service role NEVER goes to the mobile app
        const supabaseAdmin = createClient(
            supabaseUrl,
            serviceRoleKey
        );

        // Verify the user from their JWT
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized",
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // Because your DB uses ON DELETE CASCADE,
        // deleting auth.users will cascade to profiles
        // and all related user-owned records.
        const { error: deleteError } =
            await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteError) {
            throw deleteError;
        }

        return new Response(
            JSON.stringify({
                success: true,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Delete account error:", error);

        return new Response(
            JSON.stringify({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete account",
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