import { Category } from "./category";
import { Condition } from "./condition";
import { Platform } from "./platform";
import { Technician } from "./profiles";

export interface Part {
  id: string;
  technician_id: string;
  platform_id?: string | null;
  category_id?: string | null;
  condition_id?: string | null;

  title?: string;
  brand?: string | null;
  model?: string | null;
  description?: string | null;

  price?: number | null;
  quantity?: number | null;
  view_count?: number | null;

  images?: string[] | null;
  is_available?: boolean | null;
  is_negotiable?: boolean | null;
  created_at?: string | null;

  technician?: Technician | null;
  category?: Category | null;
  condition?: Condition | null;
  platform?: Platform | null;
}

export type CreatePartDto = {
  title: string;
  technician_id?:string;
  category_id: string;
  platform_id: string;
  condition_id: string;
  model?: string;
  brand?: string;
  description?: string;
  price: number;
  is_negotiable?: boolean;
  images: string[];
};

export type UpdatePartDto = Partial<{
  title: string;
  category_id: string | null;
  platform_id: string | null;
  condition_id: string | null;
  description: string | null;
  model: string | null;
  brand: string | null;
  price: number | null;
  is_negotiable: boolean | null;
  images: string[] | null;
}>;