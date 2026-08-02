import { Category } from "./category";
import { Platform } from "./platform";
import { Technician } from "./profiles";

export interface Service {
    id:string;
    technician_id: string;
    platform_id?: string | null;
    category_id?: string | null;

    title?: string | null;
    description?: string | null;

    price?: number | null;
    estimated_duration?:number;

    is_active:boolean;
    images?: string[] | null;
    created_at?: string | null;

    technician?: Technician | null;
    category?: Category | null;
    platform?: Platform | null;
}