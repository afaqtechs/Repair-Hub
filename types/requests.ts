
import { Category } from './category';
import { Platform } from './platform';
import { Technician } from './profiles';

export type RequestPriority = 'normal' | 'urgent';

export interface Request {
  id: string;

  technician_id: string;

  category_id?: string | null;
  platform_id?: string | null;

  title: string;
  description?: string | null;

  priority: RequestPriority;

  is_active: boolean;

  images?: string[] | null;

  created_at?: string | null;
  updated_at?: string | null;

  technician?: Technician | null;
  category?: Category | null;
  platform?: Platform | null;
}

export interface CreateRequestDto {
  title: string;
  technician_id: string;

  category_id: string;
  platform_id: string;

  description?: string | null;

  priority: RequestPriority;

  images: string[];
}

export interface UpdateRequestDto {
  title?: string;
  category_id?: string;
  platform_id?: string;
  description?: string | null;
  priority?: RequestPriority;
  images?: string[] | null;
  is_active?: boolean;
}
