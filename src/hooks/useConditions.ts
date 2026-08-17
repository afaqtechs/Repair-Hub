import { conditionsApi } from '@/src/api';
import { Condition } from '@/types/condition';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query Keys setup
export const CONDITION_KEYS = {
  all: ['conditions'] as const,
  lists: () => [...CONDITION_KEYS.all, 'list'] as const,
  details: () => [...CONDITION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CONDITION_KEYS.details(), id] as const,
};

// 1. Fetch All Conditions (Cached indefinitely or per staleTime)
export function useConditions() {
  return useQuery({
    queryKey: CONDITION_KEYS.lists(),
    queryFn: () => conditionsApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
}

// 2. Fetch Single Condition Details
export function useCondition(id: string) {
  return useQuery({
    queryKey: CONDITION_KEYS.detail(id),
    queryFn: () => conditionsApi.getSingle(id),
    enabled: Boolean(id),
  });
}

// 3. Condition Mutations (Create, Update, Delete)
export function useConditionMutations() {
  const queryClient = useQueryClient();

  const createCondition = useMutation({
    mutationFn: (payload: Pick<Condition, 'name' | 'description'>) =>
      conditionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONDITION_KEYS.lists() });
    },
  });

  const updateCondition = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Condition>;
    }) => conditionsApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CONDITION_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CONDITION_KEYS.detail(variables.id),
      });
    },
  });

  const deleteCondition = useMutation({
    mutationFn: (id: string) => conditionsApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CONDITION_KEYS.lists() });
      queryClient.removeQueries({ queryKey: CONDITION_KEYS.detail(id) });
    },
  });

  return {
    createCondition,
    updateCondition,
    deleteCondition,
  };
}
