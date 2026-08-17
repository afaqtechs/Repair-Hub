import { GetAllServicesParams, serviceApi } from '@/src/api';
import { CreateServiceDto, UpdateServiceDto } from '@/types/services';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// Query keys structure for clear invalidation boundaries
export const SERVICE_KEYS = {
  all: ['services'] as const,
  lists: () => [...SERVICE_KEYS.all, 'list'] as const,
  list: (params: GetAllServicesParams) =>
    [...SERVICE_KEYS.lists(), params] as const,
  infinite: (params: Omit<GetAllServicesParams, 'page'>) =>
    [...SERVICE_KEYS.lists(), 'infinite', params] as const,
  details: () => [...SERVICE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SERVICE_KEYS.details(), id] as const,
  technician: () => [...SERVICE_KEYS.all, 'technician'] as const,
  technicianServices: (technicianId: string) =>
    [...SERVICE_KEYS.technician(), technicianId] as const,
};

// 1. Fetch Paginated & Searched Services (Standard Page-by-Page)
export function useServices(params: GetAllServicesParams = {}) {
  return useQuery({
    queryKey: SERVICE_KEYS.list(params),
    queryFn: () => serviceApi.getAllServices(params),
    placeholderData: keepPreviousData, // Smooth UX while typing/paginating
    staleTime: 1000 * 60 * 3, // Cache data for 3 minutes
  });
}

// 2. Fetch Infinite Scrolling Services
export function useInfiniteServices(
  params: Omit<GetAllServicesParams, 'page'> = {}
) {
  return useInfiniteQuery({
    queryKey: SERVICE_KEYS.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      serviceApi.getAllServices({ ...params, page: pageParam }),
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

// 3. Fetch Single Service Details
export function useService(id: string) {
  return useQuery({
    queryKey: SERVICE_KEYS.detail(id),
    queryFn: () => serviceApi.getSingleService(id),
    enabled: Boolean(id), // Only run query if ID is present
  });
}

export function useServicesByTechnician(technicianId: string) {
  return useQuery({
    queryKey: SERVICE_KEYS.technicianServices(technicianId),
    queryFn: () => serviceApi.getServicesByTechnician(technicianId),
    enabled: !!technicianId,
    staleTime: 1000 * 60 * 3,
  });
}

// 4. Service Mutations (Create, Update, Delete)
export function useServiceMutations() {
  const queryClient = useQueryClient();

  const createService = useMutation({
    mutationFn: (payload: CreateServiceDto) => serviceApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.technician() });
    },
  });
  
  const updateService = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateServiceDto>;
    }) => serviceApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.technician() });
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.detail(variables.id),
      });
    },
  });

  const updateServiceStatus = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      serviceApi.markAsInactive(id, isAvailable),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.technician(),
      });

      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.detail(variables.id),
      });
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => serviceApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.technician() });
      queryClient.removeQueries({ queryKey: SERVICE_KEYS.detail(id) });
    },
  });
  return {
    createService,
    updateService,
    updateServiceStatus,
    deleteService,
  };
}
