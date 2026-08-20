// store/useProfileStore.ts

import {
  ProfileErrors,
  ProfileForm,
  ProfileStore,
} from '@/types/profiles';
import { create } from 'zustand';

const initialForm: ProfileForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',

  bio: '',
  experience_years: 0,

  city: '',
  address: '',

  latitude: null,
  longitude: null,

  verification_status:'',
  legal_document_url: '',
  profile_image_url: '',
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  form: initialForm,

  errors: {},

  /**
   * Update one field
   */
  setField: (key, value) => {
    set((state) => ({
      form: {
        ...state.form,
        [key]: value,
      },

      errors: {
        ...state.errors,
        [key]: undefined,
      },
    }));
  },

  /**
   * Update multiple fields
   */
  setFields: (values) => {
    set((state) => ({
      form: {
        ...state.form,
        ...values,
      },
    }));
  },

  /**
   * Set validation errors
   */
  setErrors: (errors) => {
    set({
      errors,
    });
  },

  /**
   * Clear one validation error
   */
  clearError: (field) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: undefined,
      },
    }));
  },

  /**
   * Validate profile fields
   */
  validate: (fields) => {
    const { form } = get();

    const errors: ProfileErrors = {};

    const fieldsToValidate =
      fields ??
      (Object.keys(form) as (keyof ProfileForm)[]);

    fieldsToValidate.forEach((field) => {
      const value = form[field];

      if (
        value === undefined ||
        value === null ||
        value === ''
      ) {
        errors[field] =
          `${String(field).replaceAll('_', ' ')} is required`;
      }
    });

    set({
      errors,
    });

    return Object.keys(errors).length === 0;
  },

  /**
   * Reset form
   */
  reset: () => {
    set({
      form: { ...initialForm },
      errors: {},
    });
  },

  /**
   * Load technician data into the form
   */
  loadProfile: (profile) => {
    set({
      form: {
        ...initialForm,
        ...profile,
      },

      errors: {},
    });
  },
}));