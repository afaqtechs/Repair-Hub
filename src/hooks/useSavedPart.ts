import { savedPartsApi } from '@/src/api/savedPartsApi';
import { useAuth } from '@/src/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const SAVED_PART_KEYS = {
  all: ['saved-parts'] as const,

  lists: () => [...SAVED_PART_KEYS.all, 'list'] as const,

  list: (technicianId: string) =>
    [...SAVED_PART_KEYS.lists(), technicianId] as const,

  status: (userId: string, partId: string) =>
    [...SAVED_PART_KEYS.all, 'status', userId, partId] as const,
};

/**
 * Fetch all saved parts for the current technician.
 */
export function useSavedParts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: SAVED_PART_KEYS.list(user?.id ?? ''),
    queryFn: () => savedPartsApi.getSavedPartsByTechnician(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch and toggle the saved state of a single part.
 */
export function useSavedPart(partId: string, onUnsave?: () => void) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = SAVED_PART_KEYS.status(user?.id ?? '', partId);

  const { data: isSaved = false, isLoading } = useQuery({
    queryKey,
    queryFn: () => savedPartsApi.isSaved(user!.id, partId),
    enabled: !!user?.id && !!partId,
    staleTime: 1000 * 60 * 5,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
       return null;
      }

      if (isSaved) {
        await savedPartsApi.unsavePart(user.id, partId);
      } else {
        await savedPartsApi.savePart(user.id, partId);
      }

      return !isSaved;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey,
      });

      const previous = queryClient.getQueryData<boolean>(queryKey);

      queryClient.setQueryData(queryKey, !previous);

      return { previous };
    },

    onError: (_, __, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },

    onSuccess: (newValue) => {
      queryClient.setQueryData(queryKey, newValue);

      if (!newValue) {
        onUnsave?.();
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: SAVED_PART_KEYS.list(user.id),
        });
      }
    },
  });

  return {
    isSaved,
    isLoading,
    saveLoading: toggleMutation.isPending,
    toggleSave: () => {
      if (toggleMutation.isPending) return;
      toggleMutation.mutate();
    },
    refetchSavedStatus: () =>
      queryClient.invalidateQueries({
        queryKey,
      }),
  };
}
