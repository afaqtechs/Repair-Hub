import { profileApi } from "@/api";
import { Technician } from "@/types/profiles";
import { create } from "zustand";

interface UserStore {
  technicians: Technician[];
  technician: Technician | null;

  loadingTechnician: boolean;
  technicianError: string | null;

  fetchTechnicians: () => Promise<void>;
  fetchTechnician: (
    id: string
  ) => Promise<void>;
}

export const userStore =
  create<UserStore>((set) => ({
    technicians: [],
    technician: null,

    loadingTechnician: false,
    technicianError: null,

    fetchTechnicians: async () => {
      try {
        set({
          loadingTechnician: true,
          technicianError: null,
        });

        const technicians =
          await profileApi.getTechnicians();

        set({
          technicians,
          loadingTechnician: false,
        });
      } catch (error: any) {
        set({
          loadingTechnician: false,
          technicianError: error.message,
        });
      }
    },

    fetchTechnician: async (
      id: string
    ) => {
      try {
        set({
          loadingTechnician: true,
          technicianError: null,
        });

        const technician =
          await profileApi.getTechnician(id);

        set({
          technician,
          loadingTechnician: false,
        });
      } catch (error: any) {
        set({
          loadingTechnician: false,
          technicianError: error.message,
        });
      }
    },
  }));