import { Category } from "./category";
import { Platform } from "./platform";
import { Technician } from "./profiles";

export interface Service {
  id: string;

  technician_id: string;

  platform_id?: string | null;
  category_id?: string | null;

  title: string;
  description?: string | null;

  price?: number | null;
  estimated_duration?: string | null;

  is_active: boolean;

  images?: string[] | null;

  is_negotiable?: boolean | null;

  created_at?: string | null;

  technician?: Technician | null;
  category?: Category | null;
  platform?: Platform | null;
}

export type CreateServiceDto = {
  title: string;
  technician_id?: string;
  category_id: string;
  platform_id: string;
  description: string;
  price: number;
  is_negotiable: boolean;
  estimated_duration: string;
  images: string[];
};

export type UpdateServiceDto = Partial<{
  title: string;
  category_id: string | null;
  platform_id: string | null;
  description: string | null;
  price: number | null;
  is_negotiable: boolean | null;
  estimated_duration: string | null;
  images: string[] | null;
}>;