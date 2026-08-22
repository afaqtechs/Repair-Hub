import { create } from "zustand";

interface PresenceState {
  onlineUserIds: Set<string>;
  setOnlineUsers: (userIds: string[]) => void;
  isUserOnline: (userId: string) => boolean;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUserIds: new Set(),

  setOnlineUsers: (userIds) => {
    set({
      onlineUserIds: new Set(userIds),
    });
  },

  isUserOnline: (userId) => {
    return get().onlineUserIds.has(userId);
  },
}));