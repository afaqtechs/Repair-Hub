import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { usePresenceStatus } from "@/src/context/PresenceContext";
import {
  ConversationWithMember,
  MessageStatus,
} from "@/types/chat";

interface ConversationCardProps {
  conversation: ConversationWithMember;
  currentUserId?: string;
  onPress: () => void;
  onLongPress: () => void;
  selected?: boolean;
}

function getInitials(
  firstName?: string | null,
  lastName?: string | null
) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;
  return initials.toUpperCase() || "?";
}

function getName(
  firstName?: string | null,
  lastName?: string | null
) {
  return (
    `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
    "Unknown user"
  );
}

function formatTime(date: string) {
  const messageDate = new Date(date);
  const now = new Date();

  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return messageDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function getMessagePreview(
  conversation: ConversationWithMember
) {
  const message = conversation.last_message;
  if (!message) return "No messages yet";
  return message.content?.trim() || "Message";
}

function getMessageStatus(
  conversation: ConversationWithMember,
  currentUserId?: string
): MessageStatus | null {
  const message = conversation.last_message;
  if (!message || !currentUserId) return null;
  if (message.sender_id !== currentUserId) return null;

  if (
    conversation.other_user_last_read_at &&
    new Date(conversation.other_user_last_read_at) >= new Date(message.created_at)
  ) {
    return "seen";
  }
  return "sent";
}

const ConversationCard = memo(({
  conversation,
  currentUserId,
  onPress,
  onLongPress,
  selected = false,
}: ConversationCardProps) => {
  const { isUserOnline } = usePresenceStatus();
  const user = conversation.other_user;

  const name = getName(user?.first_name, user?.last_name);
  const initials = getInitials(user?.first_name, user?.last_name);
  const lastMessage = conversation.last_message;
  const unreadCount = conversation.unread_count ?? 0;
  const isLastMessageMine = !!lastMessage && lastMessage.sender_id === currentUserId;
  const status = getMessageStatus(conversation, currentUserId);
  const isOnline = user?.id ? isUserOnline(user.id) : false;

  const handleLongPress = useCallback(() => {
    onLongPress?.();
  }, [onLongPress]);

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={500}
      className={`flex-row items-center px-4 py-3 ${selected ? "bg-primary/20" : ""
        }`}
    >
      {selected && (
        <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-primary">
          <Ionicons name="checkmark" size={15} color="#FFFFFF" />
        </View>
      )}

      <View className="relative mr-3">
        {user?.profile_image_url ? (
          <Image
            source={{ uri: user.profile_image_url }}
            className="h-14 w-14 rounded-full"
          />
        ) : (
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Text className="font-manrope-bold text-base text-white">
              {initials}
            </Text>
          </View>
        )}

        {isOnline && (
          <View className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 bg-green-500 border-gray-900" />
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            className={`mr-2 flex-1 font-manrope-semibold text-[15px] ${unreadCount > 0
                ? "text-white"
                : "text-white"
              }`}
          >
            {name}
          </Text>

          {lastMessage && (
            <Text
              className={`font-manrope text-xs ${unreadCount > 0 ? "text-primary" : "text-gray-400"
                }`}
            >
              {formatTime(lastMessage.created_at)}
            </Text>
          )}
        </View>

        <View className="mt-1 flex-row items-center">
          {isLastMessageMine && status && (
            <View className="mr-1.5 flex-row items-center">
              {status === "sent" && (
                <Ionicons name="checkmark" size={14} color="#9CA3AF" />
              )}
              {status === "seen" && (
                <Ionicons name="checkmark-done" size={15} color="#60A5FA" />
              )}
            </View>
          )}

          <Text
            numberOfLines={1}
            className={`flex-1 font-manrope text-sm ${unreadCount > 0
                ? "font-manrope-semibold text-text-darkMuted"
                : "text-gray-400"
              }`}
          >
            {getMessagePreview(conversation)}
          </Text>

          {unreadCount > 0 && !selected && (
            <View className="ml-2 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-1">
              <Text className="font-manrope-bold text-[10px] text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

ConversationCard.displayName = "ConversationCard";

export default ConversationCard;