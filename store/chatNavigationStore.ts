// src/store/chatNavigationStore.ts

import { create } from "zustand";

type ChatNavigationState = {
    isChatOpen: boolean;
    setChatOpen: (value: boolean) => void;
};

export const useChatNavigationStore =
    create<ChatNavigationState>((set) => ({
        isChatOpen: false,

        setChatOpen: (value) =>
            set({
                isChatOpen: value,
            }),
    }));