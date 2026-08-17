export const CHAT_KEYS = {
  all: ["chat"] as const,

  conversations: () =>
    [...CHAT_KEYS.all, "conversations"] as const,

  conversation: (id: string) =>
    [...CHAT_KEYS.all, "conversation", id] as const,

  messages: (conversationId: string) =>
    [
      ...CHAT_KEYS.all,
      "messages",
      conversationId,
    ] as const,
};