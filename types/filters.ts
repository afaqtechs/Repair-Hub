export type FilterType = 'parts' | 'services' | 'requests';

export type RangeOption = {
  label: string;
  min: number | null;
  max: number | null;
};

export type FilterValues = {
  priceMin: number | null;
  priceMax: number | null;

  categoryId: string | null;
  platformId: string | null;

  city: string | null;

};

export const EMPTY_FILTERS: FilterValues = {
  priceMin: null,
  priceMax: null,
  categoryId: null,
  platformId: null,
  city: null,
};

