import { GetAllRequestsParams, requestApi } from '@/src/api';

import { CreateRequestDto, UpdateRequestDto } from '@/types/requests';

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// ============================================================
// QUERY KEYS
// ============================================================

export const REQUEST_KEYS = {
  all: ['requests'] as const,

  lists: () => [...REQUEST_KEYS.all, 'list'] as const,

  list: (params: GetAllRequestsParams) =>
    [...REQUEST_KEYS.lists(), params] as const,

  infinite: (params: Omit<GetAllRequestsParams, 'page'>) =>
    [...REQUEST_KEYS.lists(), 'infinite', params] as const,

  details: () => [...REQUEST_KEYS.all, 'detail'] as const,

  detail: (id: string) => [...REQUEST_KEYS.details(), id] as const,

  technician: () => [...REQUEST_KEYS.all, 'technician'] as const,

  technicianRequests: (technicianId: string) =>
    [...REQUEST_KEYS.technician(), technicianId] as const,
};

// ============================================================
// 1. PAGINATED REQUESTS
// ============================================================

export function useRequests(params: GetAllRequestsParams = {}) {
  return useQuery({
    queryKey: REQUEST_KEYS.list(params),

    queryFn: () => requestApi.getAllRequests(params),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 2. INFINITE REQUESTS
// ============================================================

export function useInfiniteRequests(
  params: Omit<GetAllRequestsParams, 'page'> = {}
) {
  return useInfiniteQuery({
    queryKey: REQUEST_KEYS.infinite(params),

    queryFn: ({ pageParam = 1 }) =>
      requestApi.getAllRequests({
        ...params,
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
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

// ============================================================
// 3. SINGLE REQUEST
// ============================================================

export function useRequest(id: string) {
  return useQuery({
    queryKey: REQUEST_KEYS.detail(id),

    queryFn: () => requestApi.getSingleRequest(id),

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 4. REQUESTS BY TECHNICIAN
// ============================================================

export function useRequestsByTechnician(technicianId: string) {
  return useQuery({
    queryKey: REQUEST_KEYS.technicianRequests(technicianId),

    queryFn: () => requestApi.getRequestsByTechnician(technicianId),

    enabled: Boolean(technicianId),

    staleTime: 1000 * 60 * 3,
  });
}

// ============================================================
// 5. REQUEST MUTATIONS
// CREATE / UPDATE / DELETE
// ============================================================

export function useRequestMutations() {
  const queryClient = useQueryClient();

  // ==========================================================
  // CREATE
  // ==========================================================

  const createRequest = useMutation({
    mutationFn: (payload: CreateRequestDto) => requestApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.technician(),
      });
    },
  });
  
  // ==========================================================
  // UPDATE
  // ==========================================================

  const updateRequest = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRequestDto }) =>
      requestApi.update(id, payload),

    onSuccess: (updatedRequest, variables) => {
      // Update the cached detail immediately
      if (updatedRequest) {
        queryClient.setQueryData(
          REQUEST_KEYS.detail(variables.id),
          updatedRequest
        );
      }

      // Refresh lists
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.lists(),
      });

      // Refresh technician requests
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.technician(),
      });
    },
  });

  const updateRequestStatus = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      requestApi.markAsInactive(id, isAvailable),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.technician(),
      });

      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.detail(variables.id),
      });
    },
  });

  // ==========================================================
  // DELETE
  // ==========================================================

  const deleteRequest = useMutation({
    mutationFn: (id: string) => requestApi.remove(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: REQUEST_KEYS.technician(),
      });

      // Remove detail from cache
      queryClient.removeQueries({
        queryKey: REQUEST_KEYS.detail(id),
      });
    },
  });

  return {
    createRequest,
    updateRequest,
    updateRequestStatus,
    deleteRequest,
  };
}
