import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ConversationCard from "@/src/components/chat/ConversationCard";
import AppRefreshControl from "@/src/components/ui/AppRefreshControl";

import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { useConversations } from "@/src/hooks/chat/useConversations";

import {
  ConversationInboxItem,
  ConversationWithMember,
} from "@/types/chat";
import { showError } from "@/src/lib/toast";

interface ConversationsScreenProps {
  onOpenConversation: (
    conversationId: string
  ) => void;

  onCreateConversation: () => void;
}

const ConversationsScreen = ({
  onOpenConversation,
  onCreateConversation,
}: ConversationsScreenProps) => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const {
    conversations = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
    deleteConversations,
  } = useConversations(user?.id);


  const [
    selectedConversationIds,
    setSelectedConversationIds,
  ] = useState<string[]>([]);


  const selectionMode =
    selectedConversationIds.length > 0;


  /**
   * Convert inbox items into ConversationWithMember.
   */
  const conversationList =
    useMemo<ConversationWithMember[]>(() => {
      return conversations.map(
        (item: ConversationInboxItem) => {
          const lastMessage =
            item.last_message_id
              ? {
                id: item.last_message_id,

                conversation_id:
                  item.conversation_id,

                sender_id:
                  item.last_message_sender_id!,

                content:
                  item.last_message_content ??
                  "",

                created_at:
                  item.last_message_created_at!,

                status: "sent" as const,
              }
              : null;

          return {
            id: item.conversation_id,

            created_at:
              item.created_at,

            direct_key:
              item.direct_key ?? null,

            other_user: {
              id: item.other_user_id,

              first_name:
                item.other_user_first_name,

              last_name:
                item.other_user_last_name,

              profile_image_url:
                item.other_user_profile_image_url,

              role:
                item.other_user_role,
            },

            last_message:
              lastMessage,

            unread_count:
              item.unread_count ?? 0,

            other_user_last_read_at:
              item.other_user_last_read_at,
          };
        }
      );
    }, [conversations]);

  /**
   * Select or deselect a conversation.
   */

  const allSelected =
    conversationList.length > 0 &&
    selectedConversationIds.length ===
    conversationList.length;


  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedConversationIds([]);
      return;
    }

    setSelectedConversationIds(
      conversationList.map(
        (conversation) => conversation.id
      )
    );
  }, [allSelected, conversationList]);

  const toggleConversationSelection =
    useCallback((conversationId: string) => {
      setSelectedConversationIds((prev) => {
        if (prev.includes(conversationId)) {
          return prev.filter(
            (id) => id !== conversationId
          );
        }

        return [
          ...prev,
          conversationId,
        ];
      });
    }, []);

  /**
   * Clear all selections.
   */
  const clearSelection = useCallback(() => {
    setSelectedConversationIds([]);
  }, []);

  /**
   * Handle a normal press.
   *
   * If selection mode is active:
   *   -> select/deselect the conversation.
   *
   * Otherwise:
   *   -> open the conversation.
   */
  const handleConversationPress =
    useCallback(
      (conversationId: string) => {
        if (selectionMode) {
          toggleConversationSelection(
            conversationId
          );
          return;
        }

        onOpenConversation(conversationId);
      },
      [
        selectionMode,
        toggleConversationSelection,
        onOpenConversation,
      ]
    );

  /**
   * Long press always starts/continues selection mode.
   */
  const handleConversationLongPress =
    useCallback(
      (conversationId: string) => {
        toggleConversationSelection(
          conversationId
        );
      },
      [toggleConversationSelection]
    );

  /**
   * Render conversation.
   */

  const handleDeleteSelected =
    useCallback(async () => {
      if (
        selectedConversationIds.length === 0
      ) {
        return;
      }

      try {
        await Promise.all(
          selectedConversationIds.map(
            (conversationId) =>
              deleteConversations.mutateAsync(
                selectedConversationIds
              )
          )
        );

        setSelectedConversationIds([]);
      } catch (error: any) {
        showError(error)
      }
    }, [
      selectedConversationIds,
      deleteConversations,
    ]);

  const renderConversation = useCallback(
    ({
      item,
    }: {
      item: ConversationWithMember;
    }) => {
      const isSelected =
        selectedConversationIds.includes(
          item.id
        );

      return (
        <ConversationCard
          conversation={item}
          currentUserId={user?.id}
          selected={isSelected}
          onPress={() =>
            handleConversationPress(item.id)
          }
          onLongPress={() =>
            handleConversationLongPress(item.id)
          }
        />
      );
    },
    [
      user?.id,
      selectedConversationIds,
      handleConversationPress,
      handleConversationLongPress,
    ]
  );

  /**
   * Loading state.
   */
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
      </View>
    );
  }

  /**
   * Error state.
   */
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-6 dark:bg-bg-dark">
        <Text
          className={`mb-4 text-center font-manrope ${isDark
            ? "text-text-dark"
            : "text-text"
            }`}
        >
          Failed to load conversations.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => refetch()}
          className="rounded-xl bg-danger px-5 py-3"
        >
          <Text className="font-manrope-semibold text-white">
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg dark:bg-bg-dark">
      {/* Header */}
      <View className="mb-2 flex-row items-center justify-between border-b border-border px-5 py-4 dark:border-border-dark/50">
        {selectionMode ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={clearSelection}
                hitSlop={8}
                className="mr-3"
              >
                <Ionicons
                  name="close"
                  size={25}
                  color={
                    isDark
                      ? "#F8FAFC"
                      : "#171A2B"
                  }
                />
              </TouchableOpacity>

              <Text className="font-manrope-bold text-xl text-text dark:text-text-dark">
                {selectedConversationIds.length} selected
              </Text>
            </View>

            <View className="flex-row gap-3 items-center">
              {/* Select all */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleSelectAll}
                className="mr-5"
                hitSlop={8}
              >
                <Text className="font-manrope-semibold text-sm text-primary">
                  {allSelected
                    ? "Deselect All"
                    : "Select All"}
                </Text>
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleDeleteSelected}
                disabled={
                  deleteConversations.isPending
                }
                hitSlop={8}
              >
                {deleteConversations.isPending ? (
                  <ActivityIndicator
                    size="small"
                    color="#EF4444"
                  />
                ) : (
                  <Ionicons
                    name="trash-outline"
                    size={23}
                    color="#EF4444"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text className="font-manrope-bold text-2xl text-text dark:text-text-dark">
              Messages
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={8}
            >
              <Ionicons
                name="search-outline"
                size={25}
                color={
                  isDark
                    ? "#F8FAFC"
                    : "#171A2B"
                }
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Conversations */}
      <FlatList
        data={conversationList}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        refreshControl={
          <AppRefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          conversationList.length === 0
            ? {
              flexGrow: 1,
            }
            : undefined
        }
        extraData={{
          selectedConversationIds,
          selectionMode,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6 py-20">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Ionicons
                name="chatbubbles-outline"
                size={30}
                color="#5B3DF5"
              />
            </View>

            <Text
              className={`mt-5 font-manrope-semibold text-lg ${isDark
                ? "text-text-dark"
                : "text-text"
                }`}
            >
              No conversations
            </Text>

            <Text
              className={`mt-2 text-center font-manrope text-sm ${isDark
                ? "text-text-darkMuted"
                : "text-text-secondary"
                }`}
            >
              Start a conversation
              with a technician
              or admin.
            </Text>
          </View>
        }
      />

      {/* New conversation button */}
      {!selectionMode && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCreateConversation}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary"
          style={{
            elevation: 5,
            shadowOpacity: 0.2,
            shadowRadius: 5,
            shadowOffset: {
              width: 0,
              height: 3,
            },
          }}
        >
          <Ionicons
            name="chatbubble-ellipses-sharp"
            size={27}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ConversationsScreen;