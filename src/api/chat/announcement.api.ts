import { supabase } from "@/src/lib/supabase";
import { Announcement } from "@/types/announcement";

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[announcementApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Announcements API
// ─────────────────────────────────────────────

export const announcementsApi = {
  // ─────────────────────────────────────────────
  // Get all announcements
  // RLS automatically excludes announcements where
  // delete_for_me = logged-in user's ID
  // ─────────────────────────────────────────────

  async getAll(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        logApiError("getAll", error);
        return [];
      }

      return (data || []) as Announcement[];
    } catch (error) {
      logApiError("getAll", error);
      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Get single announcement
  // ─────────────────────────────────────────────

  async getSingle(id: string): Promise<Announcement | null> {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        logApiError("getSingle", error);
        return null;
      }

      return data as Announcement | null;
    } catch (error) {
      logApiError("getSingle", error);
      return null;
    }
  },

};
