
import {
  useQuery,
} from "@tanstack/react-query";

import { Announcement } from "@/types/announcement";
import { announcementsApi } from "@/src/api/chat/announcement.api";

// ─────────────────────────────────────────────
// Query keys
// ─────────────────────────────────────────────

export const ANNOUNCEMENT_KEYS = {
  all: ["announcements"] as const,

  single: (id: string) =>
    ["announcements", id] as const,
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useAnnouncements = () => {
 
  const announcementsQuery = useQuery({
    queryKey: ANNOUNCEMENT_KEYS.all,

    queryFn: () => announcementsApi.getAll(),

    staleTime: Infinity,
  });

  // ─────────────────────────────────────────────
  // Announcements data
  // ─────────────────────────────────────────────

  const announcements: Announcement[] =
    announcementsQuery.data ?? [];


  // ─────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────

  return {
    // Announcements
    announcements,

    // Query state
    isLoading:
      announcementsQuery.isLoading,

    isError:
      announcementsQuery.isError,

    error:
      announcementsQuery.error,

    refetch:
      announcementsQuery.refetch,

    isRefetching:
      announcementsQuery.isRefetching,
  };
};