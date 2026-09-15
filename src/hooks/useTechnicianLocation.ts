import { registerCurrentLocation } from '@/src/lib/registerCurrentLocation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get_technician_location, getMyLocation } from '../api';
import { useAuth } from '../context/AuthContext';

// Query Keys setup
export const TECHNICIAN_LOCATION_KEYS = {
  all: ['technician-locations'] as const,

  lists: () =>
    [...TECHNICIAN_LOCATION_KEYS.all, 'list'] as const,

  list: (latitude: number, longitude: number) =>
    [...TECHNICIAN_LOCATION_KEYS.lists(), latitude, longitude] as const,

  details: () =>
    [...TECHNICIAN_LOCATION_KEYS.all, 'detail'] as const,

  detail: (id: string) =>
    [...TECHNICIAN_LOCATION_KEYS.details(), id] as const,
};


// 1. Fetch All Technician Locations
export function useTechniciansLocation() {
  const { user } = useAuth();

  const technicianId = user?.id;

  const {
    data: coords,
  } = useQuery({
    queryKey: ['current-location', technicianId],

    queryFn: () => {
      if (!technicianId) {
        throw new Error('User not authenticated');
      }

      return registerCurrentLocation(technicianId);
    },

    enabled: Boolean(technicianId),

    staleTime: 1000 * 60,

    retry: 1,

    refetchOnWindowFocus: false,
  });

  return useQuery({
    queryKey: TECHNICIAN_LOCATION_KEYS.list(
      coords?.latitude ?? 0,
      coords?.longitude ?? 0
    ),

    queryFn: async () => {
      if (!coords) {
        throw new Error('Current location is not available');
      }

      try {
        return await get_technician_location(
          coords.latitude,
          coords.longitude
        );
      } catch (error: any) {
        throw new Error(
          error?.message ||
            'Failed to fetch technician locations'
        );
      }
    },

    enabled: Boolean(coords),

    staleTime: 1000 * 60 * 5,

    retry: 1,

    refetchOnWindowFocus: false,
  });
}


// 2. Fetch Single Technician Location by ID
export function useTechnicianLocation(id: string) {
  const { data: allLocations } =
    useTechniciansLocation();

  return useQuery({
    queryKey:
      TECHNICIAN_LOCATION_KEYS.detail(id),

    queryFn: async () => {
      if (!allLocations) {
        throw new Error('Locations not loaded');
      }

      const technician = allLocations.find(
        (item: any) => item.id === id
      );

      if (!technician) {
        throw new Error(
          'Technician location not found'
        );
      }

      return technician;
    },

    enabled:
      Boolean(id) &&
      Boolean(allLocations),

    staleTime: 1000 * 60 * 5,
  });
}


// 3. Fetch my saved location
export function useMyLocation(userId?: string) {
  return useQuery({
    queryKey: ['my-location', userId],

    queryFn: () =>
      getMyLocation(userId!),

    enabled: Boolean(userId),

    staleTime: 1000 * 60 * 3,
  });
}


// 4. Refresh Technician Locations
export function useTechnicianLocationMutations() {
  const queryClient = useQueryClient();

  const refreshLocation = useMutation({
    mutationFn: async () => {
      // Get fresh data from the existing
      // current-location query
      const coords =
        queryClient.getQueryData<{
          latitude: number;
          longitude: number;
        }>(['current-location']);

      if (!coords) {
        throw new Error(
          'Current location is not available'
        );
      }

      return await get_technician_location(
        coords.latitude,
        coords.longitude
      );
    },

    onSuccess: (data) => {
      queryClient.setQueryData(
        TECHNICIAN_LOCATION_KEYS.lists(),
        data
      );

      queryClient.invalidateQueries({
        queryKey:
          TECHNICIAN_LOCATION_KEYS.all,
      });
    },
  });

  return {
    refreshLocation,
  };
}