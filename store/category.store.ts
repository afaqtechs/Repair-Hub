// stores/category.store.ts

import { categoriesApi } from "@/api";
import { Category } from "@/types/category";
import { create } from "zustand";

interface CategoryStore {
  categories: Category[];
  loadingCategory: boolean;
  categoryError: string | null;

  fetchCategories: () => Promise<void>;
  createCategory: (
    name: string,
    description?: string
  ) => Promise<void>;

  updateCategory: (
    id: string,
    data: Partial<Category>
  ) => Promise<void>;

  deleteCategory: (id: string) => Promise<void>;
}

export const categoryStore =
  create<CategoryStore>((set) => ({
    categories: [],
    loadingCategory: false,
    categoryError: null,

    fetchCategories: async () => {
      try {
        set({ loadingCategory: true, categoryError: null });

        const categories =
          await categoriesApi.getAll();

        set({
          categories,
          loadingCategory: false,
        });
      } catch (error: any) {
        set({
          loadingCategory: false,
          categoryError: error.message,
        });
      }
    },

    createCategory: async (
      name,
      description
    ) => {
      const category =
        await categoriesApi.create({
          name,
          description,
        });

      set((state) => ({
        categories: [
          category,
          ...state.categories,
        ],
      }));
    },

    updateCategory: async (
      id,
      payload
    ) => {
      const updated =
        await categoriesApi.update(
          id,
          payload
        );

      set((state) => ({
        categories: state.categories.map(
          (item) =>
            item.id === id
              ? updated
              : item
        ),
      }));
    },

    deleteCategory: async (id) => {
      await categoriesApi.remove(id);

      set((state) => ({
        categories:
          state.categories.filter(
            (item) => item.id !== id
          ),
      }));
    },
  }));