import { partApi } from "@/api";
import { Part } from "@/types/parts";
import { create } from "zustand";

interface PartStore {
  parts: Part[];
  loadingParts: boolean;
  loadingMoreParts: boolean;
  partError: string | null;

  currentPage: number;
  hasMore: boolean;

  fetchParts: (page?: number) => Promise<void>;
  loadMoreParts: () => Promise<void>;

  createPart: (
    title: string,
    description?: string
  ) => Promise<void>;

  updatePart: (
    id: string,
    data: Partial<Part>
  ) => Promise<void>;

  deletePart: (id: string) => Promise<void>;
}

export const partStore = create<PartStore>((set, get) => ({
    parts: [],
    loadingParts: false,
    loadingMoreParts: false,
    partError: null,

    currentPage: 0,
    hasMore: true,

     fetchParts: async (page = 0) => {
        try {
            set({
                loadingParts: page === 0,
                loadingMoreParts: page > 0,
                partError: null,
            });

            const limit = 10;
            const from = page * limit;
            const to = from + limit - 1;

            const data = await partApi.getAllPart({
                from,
                to,
            });


            set((state) => ({
                parts:
                    page === 0
                        ? data
                        : [...state.parts, ...data],

                currentPage: page,

                hasMore: data.length === limit,

                loadingParts: false,
                loadingMoreParts: false,
            }));

        } catch (error: any) {

            set({
                partError: error.message,
                loadingParts: false,
                loadingMoreParts: false,
            });

        }
    },

    loadMoreParts: async () => {
        const {
            currentPage,
            hasMore,
            loadingMoreParts,
        } = get();

        if (!hasMore || loadingMoreParts) return;

        await get().fetchParts(currentPage + 1);
    },

    createPart: async (
      title,
      description
    ) => {
      const part =
        await partApi.create({
          title,
          description,
        });

      set((state) => ({
        parts: [
          part,
          ...state.parts,
        ],
      }));
    },

    updatePart: async (
      id,
      payload
    ) => {
      const updated =
        await partApi.update(
          id,
          payload
        );

      set((state) => ({
        parts: state.parts.map(
          (item) =>
            item.id === id
              ? updated
              : item
        ),
      }));
    },

    deletePart: async (id) => {
      await partApi.remove(id);

      set((state) => ({
        parts:
          state.parts.filter(
            (item) => item.id !== id
          ),
      }));
    },
  }));