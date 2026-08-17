import { CreatePartDto } from '@/types/parts';
import { create } from 'zustand';

export type PendingUpload = {
  uri: string;
  base64: string;
};

export interface CreatePartForm extends CreatePartDto {
  technician_id: string;
  model: string;
  brand: string;
  localImages: string[];
  removedImages: string[];
  pendingUploads: PendingUpload[];
}

type Errors = Partial<
  Record<keyof CreatePartForm, string>
>;

const initialState: CreatePartForm = {
  title: '',
  technician_id: '',

  category_id: '',
  platform_id: '',
  condition_id: '',

  model: '',
  brand: '',
  description: '',

  price: 0,
  is_negotiable: false,

  images: [],

  localImages: [],
  removedImages: [],
  pendingUploads: [],
};

interface CreatePartStore {
  form: CreatePartForm;
  errors: Errors;

  setField: <K extends keyof CreatePartForm>(
    key: K,
    value: CreatePartForm[K]
  ) => void;

  /**
   * Used when editing an existing part.
   */
  initializeForm: (
    data: Partial<CreatePartForm>
  ) => void;

  validate: () => boolean;

  reset: () => void;
}

export const useCreatePartStore =
  create<CreatePartStore>((set, get) => ({
    form: initialState,

    errors: {},

    setField: (key, value) =>
      set((state) => ({
        form: {
          ...state.form,
          [key]: value,
        },
      })),

    initializeForm: (data) =>
      set(() => ({
        form: {
          ...initialState,
          ...data,

          images: data.images ?? [],

          localImages:
            data.localImages ??
            data.images ??
            [],

          removedImages:
            data.removedImages ?? [],

          pendingUploads:
            data.pendingUploads ?? [],
        },

        errors: {},
      })),

    validate: () => {
      const { form } = get();

      const errors: Errors = {};

      if (!form.title?.trim()) {
        errors.title = 'Title is required';
      }

      if (!form.platform_id) {
        errors.platform_id =
          'Platform is required';
      }

      if (!form.category_id) {
        errors.category_id =
          'Category is required';
      }

      if (!form.condition_id) {
        errors.condition_id =
          'Condition is required';
      }

      if (!form.model?.trim()) {
        errors.model = 'Model is required';
      }

      if (!form.brand?.trim()) {
        errors.brand = 'Brand is required';
      }

      if (form.price <= 0) {
        errors.price = 'Price is required';
      }

      // Validate what the user actually selected,
      // not only what has already been uploaded.
      if (form.localImages.length === 0) {
        errors.images =
          'Select at least one image';
      }

      set({ errors });

      return Object.keys(errors).length === 0;
    },

    reset: () =>
      set({
        form: {
          ...initialState,

          title: '',
          technician_id: '',

          category_id: '',
          platform_id: '',
          condition_id: '',

          model: '',
          brand: '',
          description: '',

          price: 0,
          is_negotiable: false,

          images: [],
          localImages: [],
          removedImages: [],
          pendingUploads: [],
        },

        errors: {},
      }),
  }));