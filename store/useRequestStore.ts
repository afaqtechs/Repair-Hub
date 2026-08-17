
import {
  CreateRequestDto
} from '@/types/requests';
import { create } from 'zustand';

export type PendingUpload = {
  uri: string;
  base64: string;
};

export interface CreateRequestForm extends CreateRequestDto {
  localImages: string[];
  removedImages: string[];
  pendingUploads: PendingUpload[];
}

export type RequestFormErrors = Partial<
  Record<keyof CreateRequestForm, string>
>;

const initialState: CreateRequestForm = {
  title: '',

  technician_id: '',

  category_id: '',
  platform_id: '',

  description: '',

  priority: 'normal',

  images: [],

  localImages: [],
  removedImages: [],
  pendingUploads: [],
};

interface CreateRequestStore {
  form: CreateRequestForm;

  errors: RequestFormErrors;

  setField: <K extends keyof CreateRequestForm>(
    key: K,
    value: CreateRequestForm[K]
  ) => void;

  initializeForm: (
    data: Partial<CreateRequestForm>
  ) => void;

  validate: () => boolean;

  reset: () => void;
}

export const useCreateRequestStore =
  create<CreateRequestStore>((set, get) => ({
    form: initialState,

    errors: {},

    setField: (key, value) =>
      set((state) => ({
        form: {
          ...state.form,
          [key]: value,
        },

        errors: {
          ...state.errors,
          [key]: undefined,
        },
      })),

    initializeForm: (data) =>
      set(() => ({
        form: {
          ...initialState,

          ...data,

          title: data.title ?? '',

          technician_id:
            data.technician_id ?? '',

          category_id:
            data.category_id ?? '',

          platform_id:
            data.platform_id ?? '',

          description:
            data.description ?? '',

          priority:
            data.priority ?? 'normal',

          images:
            data.images ?? [],

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

      const errors: RequestFormErrors = {};

      if (!form.title.trim()) {
        errors.title = 'Title is required';
      }

      if (!form.platform_id) {
        errors.platform_id = 'Platform is required';
      }

      if (!form.category_id) {
        errors.category_id = 'Category is required';
      }

      if (!form.priority) {
        errors.priority = 'Priority is required';
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

          title: '',

          technician_id: '',

          category_id: '',
          platform_id: '',

          description: '',

          priority: 'normal',

          images: [],

          localImages: [],
          removedImages: [],
          pendingUploads: [],
        },

        errors: {},
      }),
  }));
