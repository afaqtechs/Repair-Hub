export interface Technician {

    // profiles table
    id: string;

    first_name: string;
    last_name: string;

    profile_image_url?: string | null;

    role: "technician" | "admin";

    bio?: string | null;

    email?: string | null;
    phone?: string | null;

    location?: {
        type: "Point";
        coordinates: [
            number,
            number
        ];
    } | null;

    verification_status?:  "pending" | "verified" | "rejected";

    // Technician information
    experience_years?: number | null;

    specialty?: string | null;


    // Computed from reviews table
    rating_avg?: number;

    rating_count?: number;

    legal_document_url: string | null;

    city: string | null;
    address: string | null;
    distance?: number;

    is_available?: boolean | null;
    is_active: boolean | null;

    // timestamps
    created_at?: string;

    updated_at?: string;
}