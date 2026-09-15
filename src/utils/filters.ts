
import { FilterType, FilterValues } from "@/types/filters";

export const EMPTY_FILTERS: FilterValues = {
 priceMin: null,
  priceMax: null,
  categoryId:null,
  platformId:null,
  city: null,
};

export type ActiveFilter = {
  key: keyof FilterValues;
  label: string;
};

/**
 * Count currently active filters.
 */
export const getActiveFilterCount = (
  filters: FilterValues,
  type: FilterType
): number => {
  let count = 0;

  if (
    filters.priceMin !== null ||
    filters.priceMax !== null
  ) {
    count++;
  }

  if (filters.categoryId) count++;
  if (filters.platformId) count++;
  if (filters.city) count++;

  return count;
};

/**
 * Convert active filters into display labels.
 */
export const getFilterLabels = (
  filters: FilterValues,
  type: FilterType,
  categories: { id: string; name: string }[] = [],
  platforms: { id: string; name: string }[] = []
): ActiveFilter[] => {
  const result: ActiveFilter[] = [];


  if (
    filters.priceMin !== null ||
    filters.priceMax !== null
  ) {
    result.push({
      key: "priceMin",
      label:
        filters.priceMax === null
          ? `≥ ${filters.priceMin}`
          : filters.priceMin === null
            ? `< ${filters.priceMax}`
            : `${filters.priceMin} - ${filters.priceMax}`,
    });
  }

  if (filters.categoryId) {

    const category = categories.find(
      (item) => item.id === filters.categoryId
    );

    result.push({
      key: "categoryId",
      label: category?.name ?? "Category",
    });
  }

  if (filters.platformId) {
    const platform = platforms.find(
      (item) => item.id === filters.platformId
    );
    result.push({
      key: "platformId",
      label: platform?.name ?? 'Platform',
    });
  }

  if (filters.city) {
    result.push({
      key: "city",
      label: filters.city,
    });
  }

  return result;
};

/**
 * Clear one individual filter.
 *
 * Price and distance are range filters,
 * so both values are cleared together.
 */
export const clearFilter = (
  filters: FilterValues,
  key: keyof FilterValues
): FilterValues => {
  switch (key) {
    case "priceMin":
    case "priceMax":
      return {
        ...filters,
        priceMin: null,
        priceMax: null,
      };

    default:
      return {
        ...filters,
        [key]: null,
      };
  }
};

/**
 * Clear all filters.
 *
 * Returns a fresh object so it can safely be used
 * directly with React setState.
 */
export const clearAllFilters = (): FilterValues => {
  return {
    ...EMPTY_FILTERS,
  };
};
