import { Category } from "./category";
import { Platform } from "./platform";
import { Technician } from "./profiles";

export type Condition = "used" | "new" ;
export interface Part {
  id: string;
  technician_id: string;
  platform_id?: string | null;

  title?: string;
  description?: string | null;

  price?: number | null;
  views_count?: number | null;

  images?: string[] | null;
  is_available?: boolean | null;
  is_negotiable?: boolean | null;
  condition?: Condition | null;
  created_at?: string | null;

  technician?: Technician | null;
  category?: Category | null;
  platform?: Platform | null;
}

export type CreatePartDto = {
  title: string;
  technician_id?:string;
  category_id: string;
  platform_id: string;
  description?: string;
  condition?: Condition | null;
  price: number;
  is_negotiable?: boolean;
  images: string[];
};

export type UpdatePartDto = Partial<{
  title: string;
  category_id: string | null;
  platform_id: string | null;
  description: string | null;
  condition: Condition | null;
  price: number | null;
  is_negotiable: boolean | null;
  views_count: number | null;
  images: string[] | null;
}>;