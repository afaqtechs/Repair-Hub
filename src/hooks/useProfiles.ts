// hooks/useProfile.ts

import { profileApi } from '@/src/api';
import { ProfileDto } from '@/types/profiles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const PROFILE_KEYS = {
  all: ['profiles'] as const,

  technicians: () => [...PROFILE_KEYS.all, 'technicians'] as const,

  details: () => [...PROFILE_KEYS.all, 'detail'] as const,

  detail: (id: string) => [...PROFILE_KEYS.details(), id] as const,
};

// Fetch all technicians
export function useTechnicians() {
  return useQuery({
    queryKey: PROFILE_KEYS.technicians(),
    queryFn: () => profileApi.getTechnicians(),
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch one technician
export function useTechnician(id: string) {
  return useQuery({
    queryKey: PROFILE_KEYS.detail(id),
    queryFn: () => profileApi.getTechnician(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

// Profile mutations
export function useProfileMutations() {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProfileDto }) =>
      profileApi.update(id, payload),

    onSuccess: (updatedProfile, variables) => {
      queryClient.setQueryData(
        PROFILE_KEYS.detail(variables.id),
        updatedProfile
      );

      queryClient.invalidateQueries({
        queryKey: PROFILE_KEYS.technicians(),
      });
    },
  });

  return {
    updateProfile,
  };
}
