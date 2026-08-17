import { savedServicesApi } from '@/src/api/savedServicesApi';
import { useAuth } from '@/src/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const SAVED_SERVICE_KEYS = {
  all: ['saved-services'] as const,

  lists: () => [...SAVED_SERVICE_KEYS.all, 'list'] as const,

  list: (technicianId: string) =>
    [...SAVED_SERVICE_KEYS.lists(), technicianId] as const,

  status: (userId: string, serviceId: string) =>
    [...SAVED_SERVICE_KEYS.all, 'status', userId, serviceId] as const,
};

export function useSavedServices() {
  const { user } = useAuth();

  return useQuery({
    queryKey: SAVED_SERVICE_KEYS.list(user?.id ?? ''),
    queryFn: () => savedServicesApi.getSavedServicesByTechnician(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSavedService(serviceId: string, onUnsave?: () => void) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = SAVED_SERVICE_KEYS.status(user?.id ?? '', serviceId);

  const { data: isSaved = false, isLoading } = useQuery({
    queryKey,
    queryFn: () => savedServicesApi.isSaved(user!.id, serviceId),
    enabled: !!user?.id && !!serviceId,
    staleTime: 1000 * 60 * 5,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
       return null;
      }

      if (isSaved) {
        await savedServicesApi.unsaveService(user.id, serviceId);
      } else {
        await savedServicesApi.saveService(user.id, serviceId);
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
          queryKey: SAVED_SERVICE_KEYS.list(user.id),
        });
      }
    },
  });

  return {
    isSaved,
    saveLoading: toggleMutation.isPending,
    toggleSave: toggleMutation.mutate,
    refetchSavedStatus: () =>
      queryClient.invalidateQueries({
        queryKey,
      }),
    isLoading,
  };
}
