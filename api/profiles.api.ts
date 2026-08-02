import { supabase } from "@/lib/supabase";
import { Technician } from "@/types/profiles";

export const profileApi = {
  async getTechnicians(): Promise<Technician[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "technician")
      .order("first_name", {
        ascending: true,
      });

    if (error) throw error;

    return data || [];
  },

  async getTechnician(
    id: string
  ): Promise<Technician | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data;
  },
};