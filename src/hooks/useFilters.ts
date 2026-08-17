import { useQuery } from '@tanstack/react-query';
import { filtersApi } from '../api';

export function useFilterParts() {
  return useQuery({
    queryKey: ['filter-parts'],
    queryFn: filtersApi.filterParts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFilterServices() {
  return useQuery({
    queryKey: ['filter-services'],
    queryFn: filtersApi.filterServices,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFilterTechnicians() {
  return useQuery({
    queryKey: ['filter-technician'],
    queryFn: filtersApi.filterTechnicians,
    staleTime: 1000 * 60 * 5,
  });
}
