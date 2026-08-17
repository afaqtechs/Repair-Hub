import { Category } from '@/types/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api';

// Query Keys setup
export const CATEGORY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_KEYS.all, 'list'] as const,
  details: () => [...CATEGORY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,

  part: () => [...CATEGORY_KEYS.all, 'part'] as const,
  categoryParts: (categoryId: string) =>
    [...CATEGORY_KEYS.part(), categoryId] as const,

  service: () => [...CATEGORY_KEYS.all, 'service'] as const,
  categoryServices: (categoryId: string) =>
    [...CATEGORY_KEYS.service(), categoryId] as const,
};

// 1. Fetch All Categories (Cached indefinitely or per staleTime)
export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.lists(),
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
}

// 2. Fetch Single Category Details
export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => categoriesApi.getSingle(id),
    enabled: Boolean(id),
  });
}

export function usePartsByCategory(categoryId: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.categoryParts(categoryId),
    queryFn: () => categoriesApi.getPartsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 3,
  });
}

export function useServicesByCategory(categoryId: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.categoryServices(categoryId),
    queryFn: () => categoriesApi.getServicesByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 3,
  });
}

// 3. Category Mutations (Create, Update, Delete)
export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: (payload: Pick<Category, 'name' | 'slug' >) =>
      categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Category> }) =>
      categoriesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.part() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.service() });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: CATEGORY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.part() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.service() });
    },  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
