// src/context/PresenceContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/src/lib/supabase";
import { PresenceUser } from "@/types/chat";
import { usePresenceStore } from "@/store/presenceStore";

interface PresenceContextValue {
  onlineUsers: PresenceUser[];
  isUserOnline: (userId: string) => boolean;
}

const PresenceContext =
  createContext<PresenceContextValue | undefined>(
    undefined
  );

interface PresenceProviderProps {
  userId: string;
  // role?: UserRole;
  children: React.ReactNode;
}

export const PresenceProvider = ({
  userId,
  // role,
  children,
}: PresenceProviderProps) => {
  const [onlineUsers, setOnlineUsers] =
    useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const channel = supabase.channel(
      "online-users",
      {
        config: {
          presence: {
            key: userId,
          },
        },
      }
    );

    const updatePresence = () => {
      const state = channel.presenceState();

      const users: PresenceUser[] =
        Object.entries(state).flatMap(
          ([key, entries]) =>
            entries.map((entry: any) => ({
              user_id: key,
              online_at: entry.online_at,
            }))
        );

      // Existing context state
      setOnlineUsers(users);

      usePresenceStore
        .getState()
        .setOnlineUsers(users.map((user) => user.user_id));
    };

    channel.on(
      "presence",
      {
        event: "sync",
      },
      updatePresence
    );

    channel.on(
      "presence",
      {
        event: "join",
      },
      updatePresence
    );

    channel.on(
      "presence",
      {
        event: "leave",
      },
      updatePresence
    );

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }

      await channel.track({
        user_id: userId,
        // role,
        online_at: new Date().toISOString(),
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const isUserOnline = (targetUserId: string) => {
    return onlineUsers.some(
      (user) => user.user_id === targetUserId
    );
  };

  return (
    <PresenceContext.Provider
      value={{
        onlineUsers,
        isUserOnline,
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresenceStatus = () => {
  const context = useContext(PresenceContext);

  if (!context) {
    throw new Error(
      "usePresenceStatus must be used inside PresenceProvider"
    );
  }

  return context;
};