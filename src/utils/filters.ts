
import { FilterType, FilterValues } from "@/types/filters";

export const EMPTY_FILTERS: FilterValues = {
  brand: null,
  model: null,
  priceMin: null,
  priceMax: null,
  categoryId: null,
  platformId: null,
  conditionId: null,
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

  if (type === "parts") {
    if (filters.brand) count++;
    if (filters.model) count++;
    if (filters.conditionId) count++;
  }

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
  type: FilterType
): ActiveFilter[] => {
  const result: ActiveFilter[] = [];

  if (type === "parts") {
    if (filters.brand) {
      result.push({
        key: "brand",
        label: filters.brand,
      });
    }

    if (filters.model) {
      result.push({
        key: "model",
        label: filters.model,
      });
    }

    if (filters.conditionId) {
      result.push({
        key: "conditionId",
        label: "Condition",
      });
    }
  }

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
    result.push({
      key: "categoryId",
      label: "Category",
    });
  }

  if (filters.platformId) {
    result.push({
      key: "platformId",
      label: "Platform",
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
