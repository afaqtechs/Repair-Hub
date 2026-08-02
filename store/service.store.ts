import { serviceApi } from "@/api/services.api";
import { Service } from "@/types/services";
import { create } from "zustand";

interface ServiceStore {
  services: Service[];
  loadingServices: boolean;
  loadingMoreServices: boolean;
  serviceError: string | null;

  currentPage: number;
  hasMore: boolean;

  fetchServices: (page?: number) => Promise<void>;
  loadMoreServices: () => Promise<void>;

  createService: (
    title: string,
    description?: string
  ) => Promise<void>;

  updateService: (
    id: string,
    data: Partial<Service>
  ) => Promise<void>;

  deleteService: (id: string) => Promise<void>;
}

export const serviceStore = create<ServiceStore>((set, get) => ({
    services: [],
    loadingServices: false,
    loadingMoreServices: false,
    serviceError: null,

    currentPage: 0,
    hasMore: true,

     fetchServices: async (page = 0) => {
        try {
            set({
                loadingServices: page === 0,
                loadingMoreServices: page > 0,
                serviceError: null,
            });

            const limit = 10;
            const from = page * limit;
            const to = from + limit - 1;

            const data = await serviceApi.getAllServices({
                from,
                to,
            });


            set((state) => ({
                services:
                    page === 0
                        ? data
                        : [...state.services, ...data],

                currentPage: page,

                hasMore: data.length === limit,

                loadingServices: false,
                loadingMoreServices: false,
            }));

        } catch (error: any) {

            set({
                serviceError: error.message,
                loadingServices: false,
                loadingMoreServices: false,
            });

        }
    },

    loadMoreServices: async () => {
        const {
            currentPage,
            hasMore,
            loadingMoreServices,
        } = get();

        if (!hasMore || loadingMoreServices) return;

        await get().fetchServices(currentPage + 1);
    },

    createService: async (
      title,
      description
    ) => {
      const service =
        await serviceApi.create({
          title,
          description,
        });

      set((state) => ({
        services: [
          service,
          ...state.services,
        ],
      }));
    },

    updateService: async (
      id,
      payload
    ) => {
      const updated =
        await serviceApi.update(
          id,
          payload
        );

      set((state) => ({
        services: state.services.map(
          (item) =>
            item.id === id
              ? updated
              : item
        ),
      }));
    },

    deleteService: async (id) => {
      await serviceApi.remove(id);

      set((state) => ({
        services:
          state.services.filter(
            (item) => item.id !== id
          ),
      }));
    },
  }));