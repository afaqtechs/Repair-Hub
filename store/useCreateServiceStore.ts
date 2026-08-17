import { CreateServiceDto } from '@/types/services';
import { create } from 'zustand';

export type PendingUpload = {
  uri: string;
  base64: string;
};

export interface CreateServiceForm extends CreateServiceDto {
  technician_id: string;
  localImages: string[];
  removedImages: string[];
  pendingUploads: PendingUpload[];
}

type Errors = Partial<
  Record<keyof CreateServiceForm, string>
>;

const initialState: CreateServiceForm = {
  title: '',
  technician_id: '',
  category_id: '',
  platform_id: '',
  description: '',
  price: 0,
  is_negotiable: false,
  estimated_duration: '',
  images: [],
  localImages: [],
  removedImages: [],
  pendingUploads: [],
};

interface CreateServiceStore {
  form: CreateServiceForm;
  errors: Errors;

  setField: <K extends keyof CreateServiceForm>(
    key: K,
    value: CreateServiceForm[K]
  ) => void;

  initializeForm: (
    data: Partial<CreateServiceForm>
  ) => void;

  validate: () => boolean;
  reset: () => void;
}

export const useCreateServiceStore =
  create<CreateServiceStore>((set, get) => ({
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
        errors.platform_id = 'Platform is required';
      }

      if (!form.category_id) {
        errors.category_id = 'Category is required';
      }

      if (form.price <= 0) {
        errors.price = 'Price is required';
      }

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
          images: [],
          localImages: [],
          removedImages: [],
          pendingUploads: [],
        },
        errors: {},
      }),
  }));