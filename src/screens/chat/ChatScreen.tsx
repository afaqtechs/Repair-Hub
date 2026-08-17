import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/context/ThemeContext';
import { CHAT_KEYS } from '@/src/hooks/chat/chatKeys';
import { useChatRealtime } from '@/src/hooks/chat/useChatRealtime';
import { useConversations } from '@/src/hooks/chat/useConversations';
import { useMessages } from '@/src/hooks/chat/useMessages';
import { showError } from '@/src/lib/toast';
import {
  Message,
  MessageDeletedPayload,
  MessageStatus,
  ReadPayload,
  TypingPayload,
} from '@/types/chat';
import { useQueryClient } from '@tanstack/react-query';

interface ChatScreenProps {
  conversationId: string;
  currentUserId: string;
  otherUserName: string;
  otherUserImage?: string | null;
  otherUserLastReadAt?: string | null;
  isOnline?: boolean;
  onBack: () => void;
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  );
}

function getMessageStatus(
  message: Message,
  currentUserId: string,
  otherUserLastReadAt?: string | null
): MessageStatus {
  if (message.status === 'pending') {
    return 'pending';
  }

  if (message.sender_id !== currentUserId) {
    return 'sent';
  }

  if (
    otherUserLastReadAt &&
    new Date(message.created_at) <= new Date(otherUserLastReadAt)
  ) {
    return 'seen';
  }

  return 'sent';
}

function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isSameDay(first: string, second: string) {
  const firstDate = new Date(first);
  const secondDate = new Date(second);

  if (Number.isNaN(firstDate.getTime()) || Number.isNaN(secondDate.getTime())) {
    return false;
  }

  return firstDate.toDateString() === secondDate.toDateString();
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

interface MessageItemProps {
  item: Message;
  showDate: boolean;
  currentUserId: string;
  otherUserLastReadAt?: string | null;
  isDark: boolean;
  chatSelected: Set<string>;
  isSelectionMode: boolean;
  onLongPress: (id: string) => void;
  onPress: (id: string) => void;
}

const MessageItem = memo(
  ({
    item,
    showDate,
    currentUserId,
    otherUserLastReadAt,
    isDark,
    chatSelected,
    isSelectionMode,
    onLongPress,
    onPress,
  }: MessageItemProps) => {
    const isMine = item.sender_id === currentUserId;

    const status = isMine
      ? getMessageStatus(item, currentUserId, otherUserLastReadAt)
      : null;

    const isSelected = chatSelected.has(item.id);

    return (
      <TouchableOpacity
        onLongPress={() => onLongPress(item.id)}
        onPress={() => onPress(item.id)}
        activeOpacity={0.7}
        className={`py-1 ${isSelected ? 'bg-primary/10' : 'bg-transparent'}`}
      >
        {showDate && (
          <View className="my-4 items-center">
            <View className="rounded-full bg-card px-3 py-1 dark:bg-card-dark">
              <Text className="font-manrope text-[10px] text-gray-500 dark:text-gray-400">
                {formatDateLabel(item.created_at)}
              </Text>
            </View>
          </View>
        )}

        <View
          className={`flex-row px-4 ${isMine ? 'justify-end' : 'justify-start'
            }`}
        >
          <View
            className={`max-w-[80%] rounded-xl px-4 py-1 ${isMine
              ? 'rounded-br-none bg-primary'
              : 'rounded-bl-none bg-primary/30'
              }`}
          >
            <View className="flex-row items-center">
              {isSelected && (
                <View className="mr-2">
                  <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                </View>
              )}

              <View className="flex-shrink">
                <Text
                  className={`font-manrope text-[11px] leading-5 ${isMine ? 'text-white' : 'text-text dark:text-text-dark'
                    }`}
                  style={{
                    flexWrap: 'wrap',
                    flexShrink: 1,
                  }}
                >
                  {item.content}
                </Text>
              </View>
            </View>

            {/* Time + status */}
            <View className="mt-1 flex-row items-center justify-end gap-1">
              <Text
                className={`font-manrope text-[9px] ${isMine ? 'text-white/70' : 'text-gray-400'
                  }`}
              >
                {formatMessageTime(item.created_at)}
              </Text>

              {isMine && status === 'pending' && (
                <Ionicons
                  name="time-outline"
                  size={11}
                  color={isDark ? '#CBD5E1' : '#E5E7EB'}
                />
              )}

              {isMine && status === 'sent' && (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              )}

              {isMine && status === 'seen' && (
                <Ionicons name="checkmark-done" size={14} color="#60A5FA" />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

MessageItem.displayName = 'MessageItem';

export default function ChatScreen({
  conversationId,
  currentUserId,
  otherUserName,
  otherUserImage,
  otherUserLastReadAt,
  isOnline = false,
  onBack,
}: ChatScreenProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [text, setText] = useState('');
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  const [chatSelected, setChatSelected] = useState<Set<string>>(
    () => new Set()
  );

  const isSelectionMode = chatSelected.size > 0;

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMarkedInitialReadRef = useRef(false);

  const markReadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendReadRef = useRef<((lastReadAt: string) => Promise<void>) | null>(
    null
  );

  const flatListRef = useRef<FlatList<Message>>(null);
  const previousMessageCountRef = useRef(0);
  const hasLoadedInitialMessagesRef = useRef(false);
  const queryClient = useQueryClient();

  const {
    messages = [],
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    sendMessage,
    isSending,
    addRealtimeMessage,
    removeRealtimeMessage,
    deleteMessages,
  } = useMessages(conversationId);

  const { markAsRead } = useConversations(currentUserId, conversationId);

  const handleMessageDeleted = useCallback(
    (payload: MessageDeletedPayload) => {
      if (payload.conversation_id !== conversationId) {
        return;
      }

      removeRealtimeMessage(payload.message_id);
    },
    [conversationId, removeRealtimeMessage]
  );

  const markConversationAsRead = useCallback(() => {
    if (!conversationId || !currentUserId) {
      return;
    }

    if (markReadTimeoutRef.current) {
      clearTimeout(markReadTimeoutRef.current);
    }

    markReadTimeoutRef.current = setTimeout(async () => {
      try {
        const lastReadAt = await markAsRead.mutateAsync(conversationId);

        if (lastReadAt) {
          await sendReadRef.current?.(lastReadAt);
        }

        queryClient.invalidateQueries({
          queryKey: CHAT_KEYS.conversations(),
        });
      } catch (error: any) {
        showError(error?.message ?? 'Unable to mark conversation as read.');
      }
    }, 100);
  }, [conversationId, currentUserId, markAsRead, queryClient]);

  useEffect(() => {
    if (
      !conversationId ||
      !currentUserId ||
      isLoadingMessages ||
      hasMarkedInitialReadRef.current
    ) {
      return;
    }

    hasMarkedInitialReadRef.current = true;

    markConversationAsRead();
  }, [
    conversationId,
    currentUserId,
    isLoadingMessages,
    markConversationAsRead,
  ]);

  const handleTyping = useCallback(
    (payload: TypingPayload) => {
      if (payload.user_id === currentUserId) {
        return;
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = null;
      }

      setIsOtherUserTyping(payload.is_typing);

      if (payload.is_typing) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsOtherUserTyping(false);

          typingTimeoutRef.current = null;
        }, 3000);
      }
    },
    [currentUserId]
  );

  const [remoteLastReadAt, setRemoteLastReadAt] = useState<string | null>(
    otherUserLastReadAt ?? null
  );

  const handleRead = useCallback(
    (payload: ReadPayload) => {
      if (payload.user_id === currentUserId) {
        return;
      }

      setRemoteLastReadAt(payload.last_read_at);
    },
    [currentUserId]
  );

  useEffect(() => {
    setRemoteLastReadAt(otherUserLastReadAt ?? null);
  }, [otherUserLastReadAt]);

  const handleRealtimeMessage = useCallback(
    (incomingMessage: Message) => {
      if (incomingMessage.conversation_id !== conversationId) {
        return;
      }

      addRealtimeMessage(incomingMessage);

      if (incomingMessage.sender_id !== currentUserId) {
        markConversationAsRead();
      }
    },
    [conversationId, currentUserId, addRealtimeMessage, markConversationAsRead]
  );

  const {
    sendMessage: broadcastMessage,
    sendTyping,
    sendRead,
    sendMessageDeleted,
  } = useChatRealtime({
    conversationId,
    currentUserId,
    onMessage: handleRealtimeMessage,
    onTyping: handleTyping,
    onRead: handleRead,
    onDelete: handleMessageDeleted,
  });

  useEffect(() => {
    sendReadRef.current = sendRead;
  }, [sendRead]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = null;
      }
    };
  }, []);

  const scrollToBottom = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({
          animated,
        });
      });
    });
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        scrollToBottom(true);
      }
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        requestAnimationFrame(() => {
          scrollToBottom(false);
        });
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [scrollToBottom]);

  useEffect(() => {
    if (isLoadingMessages) {
      return;
    }

    if (messages.length === 0) {
      previousMessageCountRef.current = 0;
      return;
    }

    if (!hasLoadedInitialMessagesRef.current) {
      hasLoadedInitialMessagesRef.current = true;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToEnd({
            animated: false,
          });
        });
      });

      previousMessageCountRef.current = messages.length;

      return;
    }
    if (messages.length > previousMessageCountRef.current) {
      scrollToBottom(true);
    }

    previousMessageCountRef.current = messages.length;
  }, [messages.length, isLoadingMessages, scrollToBottom]);

  const handleChangeText = useCallback(
    (value: string) => {
      setText(value);

      if (!conversationId || !currentUserId) {
        return;
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = null;
      }

      if (!value.trim()) {
        sendTyping(false);
        return;
      }

      sendTyping(true);

      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false);
        typingTimeoutRef.current = null;
      }, 1000);
    },
    [conversationId, currentUserId, sendTyping]
  );

  const handleSend = useCallback(async () => {
    const content = text.trim();

    if (!content || isSending || !conversationId || !currentUserId) {
      return;
    }

    const message: Message = {
      id: Crypto.randomUUID(),
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
      status: 'pending',
    };

    setText('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    sendTyping(false);

    addRealtimeMessage(message);

    try {
      const result = await sendMessage({
        id: message.id,
        content: message.content,
      });

      if (!result) {
        showError('Message could not be sent. It will remain pending.');

        return;
      }

      const savedMessage: Message = {
        ...result,
        status: 'sent',
      };

      removeRealtimeMessage(message.id);
      addRealtimeMessage(savedMessage);

      await broadcastMessage(savedMessage);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToEnd({
            animated: true,
          });
        });
      });
    } catch (error: any) {
      showError(
        error?.message ?? 'Unable to send message. It will remain pending.'
      );
    }
  }, [
    text,
    conversationId,
    currentUserId,
    isSending,
    addRealtimeMessage,
    removeRealtimeMessage,
    sendMessage,
    broadcastMessage,
    sendTyping,
  ]);

  const handleLongPressChats = useCallback((messageId: string) => {
    setChatSelected((previous) => {
      if (previous.has(messageId)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(messageId);

      return next;
    });
  }, []);

  const handlePressChats = useCallback((messageId: string) => {
    setChatSelected((previous) => {
      if (previous.size === 0) {
        return previous;
      }

      const next = new Set(previous);

      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }

      return next;
    });
  }, []);

  const exitSelectionMode = useCallback(() => {
    setChatSelected(new Set());
  }, []);

  const selectAllMessages = useCallback(() => {
    setChatSelected(new Set(messages.map((message) => message.id)));
  }, [messages]);

  const deleteSelectedMessages = useCallback(async () => {
    const selectedIds = [...chatSelected];

    const selectedMessageIds = messages
      .filter((message) => selectedIds.includes(message.id))
      .map((message) => message.id);

    if (!selectedMessageIds.length) {
      return;
    }

    try {
      await deleteMessages(selectedMessageIds);

      for (const messageId of selectedMessageIds) {
        await sendMessageDeleted({
          message_id: messageId,
          conversation_id: conversationId,
          deleted_by: currentUserId,
        });
      }

      setChatSelected(new Set());
    } catch (error: any) {
      showError(error);
    }
  }, [
    chatSelected,
    messages,
    deleteMessages,
    sendMessageDeleted,
    conversationId,
    currentUserId,
  ]);

  const renderItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const previousMessage = messages[index - 1];

      const showDate =
        index === 0 ||
        !isSameDay(previousMessage?.created_at || '', item.created_at);

      return (
        <MessageItem
          item={item}
          showDate={showDate}
          currentUserId={currentUserId}
          otherUserLastReadAt={remoteLastReadAt}
          isDark={isDark}
          chatSelected={chatSelected}
          isSelectionMode={isSelectionMode}
          onLongPress={handleLongPressChats}
          onPress={handlePressChats}
        />
      );
    },
    [
      messages,
      currentUserId,
      remoteLastReadAt,
      isDark,
      chatSelected,
      isSelectionMode,
      handleLongPressChats,
      handlePressChats,
    ]
  );

  return (
    <View
      className="flex-1 bg-bg dark:bg-bg-dark"
      style={{
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between border-b border-border px-4 py-3 dark:border-border-dark">
          {isSelectionMode ? (
            <>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={exitSelectionMode}
                  activeOpacity={0.7}
                  className="h-10 w-10 items-center justify-center rounded-2xl"
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={isDark ? '#F8FAFC' : '#171A2B'}
                  />
                </TouchableOpacity>

                <Text className="font-manrope-semibold text-base text-text dark:text-text-dark">
                  {chatSelected.size} selected
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={selectAllMessages}
                  activeOpacity={0.7}
                  className="h-10 w-10 items-center justify-center rounded-full"
                >
                  <Ionicons
                    name="checkmark-done-outline"
                    size={21}
                    color={isDark ? '#F8FAFC' : '#171A2B'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={deleteSelectedMessages}
                  activeOpacity={0.7}
                  className="h-10 w-10 items-center justify-center rounded-full"
                >
                  <Ionicons name="trash-outline" size={21} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View className="flex-1 flex-row items-center gap-3">
              <TouchableOpacity
                onPress={onBack}
                activeOpacity={0.7}
                className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-bg dark:border-border-dark dark:bg-bg-dark"
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={isDark ? '#F8FAFC' : '#171A2B'}
                />
              </TouchableOpacity>

              {otherUserImage ? (
                <Image
                  source={{
                    uri: otherUserImage,
                  }}
                  className="h-11 w-11 rounded-full"
                />
              ) : (
                <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
                  <Text className="font-manrope-bold text-sm text-white">
                    {getInitials(otherUserName)}
                  </Text>
                </View>
              )}

              <View className="flex-1">
                <Text
                  numberOfLines={1}
                  className="font-manrope-semibold text-base text-text dark:text-text-dark"
                >
                  {otherUserName}
                </Text>

                <View className="mt-0.5 flex-row items-center">
                  <View
                    className={`mr-1.5 h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                  />

                  {isOtherUserTyping ? (
                    <Text className="font-manrope text-xs text-success">
                      Typing...
                    </Text>
                  ) : (
                    <Text className="font-manrope text-xs text-gray-400">
                      {isOnline ? 'Online' : 'Offline'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: 12,
            flexGrow: messages.length === 0 ? 1 : undefined,
          }}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={20}
          removeClippedSubviews
          ListEmptyComponent={
            isLoadingMessages ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="small" />
              </View>
            ) : isMessagesError ? (
              <View className="flex-1 items-center justify-center px-8">
                <Ionicons
                  name="alert-circle-outline"
                  size={42}
                  color="#9CA3AF"
                />

                <Text className="mt-4 font-manrope-semibold text-base text-text dark:text-text-dark">
                  Unable to load messages
                </Text>

                <Text className="mt-1 text-center font-manrope text-sm text-gray-400">
                  Please try again.
                </Text>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center px-8">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={42}
                  color="#9CA3AF"
                />

                <Text className="mt-4 font-manrope-semibold text-base text-text dark:text-text-dark">
                  Start the conversation
                </Text>

                <Text className="mt-1 text-center font-manrope text-sm text-gray-400">
                  Send a message to get started.
                </Text>
              </View>
            )
          }
        />

        {!isSelectionMode && (
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 48}
          >
            <View className="border-t border-border bg-bg px-3 pt-2 dark:border-border-dark dark:bg-bg-dark">
              <View className="flex-row items-end rounded-3xl bg-card px-2 py-1.5 dark:bg-card-dark">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="h-10 w-10 items-center justify-center"
                  hitSlop={8}
                  onPress={() => { }}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                </TouchableOpacity>

                <TextInput
                  value={text}
                  onChangeText={handleChangeText}
                  placeholder="Write a message..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  maxLength={5000}
                  textAlignVertical="center"
                  className="max-h-28 min-h-10 flex-1 px-2 py-2.5 font-manrope text-[14px] text-text dark:text-text-dark"
                />

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSend}
                  disabled={!text.trim()}
                  className={`h-10 w-10 items-center justify-center rounded-full ${text.trim() ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                >
                  <Ionicons name="send" size={17} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </View>
  );
}
