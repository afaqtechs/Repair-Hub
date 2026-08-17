import { getCurrentLocation } from '@/src/lib/location';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get_technician_location, getMyLocation } from '../api';

// Query Keys setup
export const TECHNICIAN_LOCATION_KEYS = {
  all: ['technician-locations'] as const,
  lists: () => [...TECHNICIAN_LOCATION_KEYS.all, 'list'] as const,
  list: (latitude: number, longitude: number) =>
    [...TECHNICIAN_LOCATION_KEYS.lists(), latitude, longitude] as const,
  details: () => [...TECHNICIAN_LOCATION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TECHNICIAN_LOCATION_KEYS.details(), id] as const,
};

// 1. Fetch All Technician Locations (with current location)
export function useTechniciansLocation() {
    const { data: coords } = useQuery({
    queryKey: ['current-location'],
    queryFn: getCurrentLocation,
    staleTime: 1000 * 60,
  });
  return useQuery({
        queryKey: TECHNICIAN_LOCATION_KEYS.list(
      coords?.latitude ?? 0,
      coords?.longitude ?? 0
    ),
    queryFn: async () => {
      try {
        const { latitude, longitude } = await getCurrentLocation();

        const technicians = await get_technician_location(latitude, longitude);

        return technicians;
      } catch (error: any) {
        throw new Error(
          error.message || 'Failed to fetch technician locations'
        );
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// 2. Fetch Single Technician Location by ID
export function useTechnicianLocation(id: string) {
  const { data: allLocations } = useTechniciansLocation();

  return useQuery({
    queryKey: TECHNICIAN_LOCATION_KEYS.detail(id),
    queryFn: async () => {
      if (!allLocations) {
        throw new Error('Locations not loaded');
      }

      const technician = allLocations.find((item: any) => item.id === id);

      if (!technician) {
        throw new Error('Technician location not found');
      }

      return technician;
    },
    enabled: Boolean(id) && Boolean(allLocations),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// fetch my location
export function useMyLocation(userId?: string) {
  return useQuery({
    queryKey: ['my-location', userId],
    queryFn: () => getMyLocation(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 3,
  });
}

// 4. Mutations for Technician Location
export function useTechnicianLocationMutations() {
  const queryClient = useQueryClient();
  const refreshLocation = useMutation({
    mutationFn: async () => {
      const { latitude, longitude } = await getCurrentLocation();
      const technicians = await get_technician_location(latitude, longitude);
      return technicians;
    },
    onSuccess: (data) => {
      // Update the cached data
      queryClient.setQueryData(TECHNICIAN_LOCATION_KEYS.lists(), data);
    },
  });

  return {
    refreshLocation,
  };
}
