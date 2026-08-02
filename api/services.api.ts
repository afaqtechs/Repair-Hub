// api/categories.api.ts

import { supabase } from "@/lib/supabase";
import { Service } from "@/types/services";

export const serviceApi = {
  async getAllServices({ from, to,}:{ from:number; to:number;}): Promise<Service[]> {
    const { data, error } = await supabase
      .from("services")
      .select(`
      *,
      technician:profiles(*),
      category:categories(*),
      platform:platforms(*)
    `)
    .range(from,to)
    .order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return data || [];
  },

async getSingleService(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select(`
      *,
      technician:profiles(*),
      category:categories(*),
      platform:platforms(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
},

  async create(
    payload: Pick<Service, "title" | "description">
  ): Promise<Service> {
    const { data, error } = await supabase
      .from("services")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: string,
    payload: Partial<Service>
  ): Promise<Service> {
    const { data, error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};