export type FilterType = 'parts' | 'services' | 'requests';

export type RangeOption = {
  label: string;
  min: number | null;
  max: number | null;
};

export type FilterValues = {
  brand?: string | null;
  model?: string | null;

  priceMin: number | null;
  priceMax: number | null;

  categoryId: string | null;
  platformId: string | null;
  conditionId?: string | null;

  city: string | null;

};

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

