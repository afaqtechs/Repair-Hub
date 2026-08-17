import { GetAllPartsParams, partApi } from '@/src/api';
import { CreatePartDto, UpdatePartDto } from '@/types/parts';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const PART_KEYS = {
  all: ['parts'] as const,
  lists: () => [...PART_KEYS.all, 'list'] as const,
  list: (params: GetAllPartsParams) => [...PART_KEYS.lists(), params] as const,
  infinite: (params: Omit<GetAllPartsParams, 'page'>) =>
    [...PART_KEYS.lists(), 'infinite', params] as const,
  details: () => [...PART_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PART_KEYS.details(), id] as const,
  technician: () => [...PART_KEYS.all, 'technician'] as const,
  technicianParts: (technicianId: string) =>
    [...PART_KEYS.technician(), technicianId] as const,
};

export function useParts(params: GetAllPartsParams = {}) {
  return useQuery({
    queryKey: PART_KEYS.list(params),
    queryFn: () => partApi.getAllParts(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3,
  });
}

// Fixed infinite loading hook
export function useInfiniteParts(params: Omit<GetAllPartsParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: PART_KEYS.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      partApi.getAllParts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Prevent pagination if data is empty or end of pages reached
      if (!lastPage || !lastPage.data || lastPage.data.length === 0) {
        return undefined;
      }
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 3,
  });
}

export function usePart(id: string) {
  return useQuery({
    queryKey: PART_KEYS.detail(id),
    queryFn: () => partApi.getSinglePart(id),
    enabled: Boolean(id),
  });
}

export function usePartByTechnician(technicianId: string) {
  return useQuery({
    queryKey: PART_KEYS.technicianParts(technicianId),
    queryFn: () => partApi.getPartsByTechnician(technicianId),
    enabled: !!technicianId,
    staleTime: 1000 * 60 * 3,
  });
}

export function usePartsMutations() {
    const queryClient = useQueryClient();

    const createPart = useMutation({
        mutationFn: (payload: CreatePartDto) =>
            partApi.create(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: PART_KEYS.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: PART_KEYS.technician(),
            });
        },
    });
    
    const updatePart = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: Partial<UpdatePartDto>;
        }) => partApi.update(id, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: PART_KEYS.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: PART_KEYS.technician(),
            });

            queryClient.invalidateQueries({
                queryKey: PART_KEYS.detail(variables.id),
            });
        },
    });

    const updatePartAvailability = useMutation({
        mutationFn: ({
            id,
            isAvailable,
        }: {
            id: string;
            isAvailable: boolean;
        }) => partApi.markAsUnavailable(id, isAvailable),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: PART_KEYS.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: PART_KEYS.technician(),
            });

            queryClient.invalidateQueries({
                queryKey: PART_KEYS.detail(variables.id),
            });
        },
    });

    const deletePart = useMutation({
        mutationFn: (id: string) =>
            partApi.remove(id),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: PART_KEYS.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: PART_KEYS.technician(),
            });

            queryClient.removeQueries({
                queryKey: PART_KEYS.detail(id),
            });
        },
    });

    return {
        createPart,
        updatePart,
        updatePartAvailability,
        deletePart,
    };
}
