// types/profiles.ts

export type UserRole = "admin" | "technician" ;
export interface Technician {
  // Database
  id: string;

  first_name: string;
  last_name: string;

  email?: string | null;
  phone?: string | null;

  profile_image_url?: string | null;

  role?: UserRole;

  bio?: string | null;

  experience_years?: number | null;

  specialty?: string | null;

  legal_document_url: string | null;

  city: string | null;
  address: string | null;

  // PostGIS / database location
  location?: {
    type: 'Point';
    coordinates: [number, number];
  } | null;

  // Computed from reviews
  rating_avg?: number;
  rating_count?: number;

  verification_status?: 'pending' | 'verified' | 'rejected';

  is_available?: boolean | null;
  is_active: boolean | null;

  distance?: number | null;

  created_at?: string;
  updated_at?: string;
  last_seen_at?:string;
}

/**
 * Form state used by the profile screens.
 *
 * This represents what the UI edits.
 */
export interface ProfileForm {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;

  bio: string | null;
  experience_years: number | null;

  city: string | null;
  address: string | null;

  latitude: string | null;
  longitude: string | null;

  verification_status?:string | null;
  legal_document_url: string | null;
  profile_image_url: string | null;
}

/**
 * Payload sent to Supabase when updating a profile.
 *
 * All fields are optional because profile updates are partial.
 */
export type ProfileDto = Partial<{
  first_name: string | null;
  last_name: string | null;
  phone: string | null;

  bio: string | null;
  experience_years: number | null;

  city: string | null;
  address: string | null;

  latitude: number | null;
  longitude: number | null;

  verification_status?:string | null;
  legal_document_url: string | null;
  profile_image_url: string | null;
}>;

export type ProfileErrors = Partial<
  Record<keyof ProfileForm, string>
>;

export interface ProfileStore {
  form: ProfileForm;
  errors: ProfileErrors;

  setField: <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K]
  ) => void;

  setFields: (values: Partial<ProfileForm>) => void;

  setErrors: (errors: ProfileErrors) => void;

  clearError: (field: keyof ProfileForm) => void;

  validate: (fields?: (keyof ProfileForm)[]) => boolean;

  reset: () => void;

  loadProfile: (profile: Partial<ProfileForm>) => void;
}