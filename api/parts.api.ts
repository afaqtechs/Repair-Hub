// api/categories.api.ts

import { supabase } from "@/lib/supabase";
import { Part } from "@/types/parts";

export const partApi = {
  async getAllPart({ from, to,}:{ from:number; to:number;}): Promise<Part[]> {
    const { data, error } = await supabase
      .from("parts")
      .select(`
      *,
      technician:profiles(*),
      category:categories(*),
      condition:conditions(*),
      platform:platforms(*)
    `)
    .range(from,to)
    .order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return data || [];
  },

async getSinglePart(id: string): Promise<Part | null> {
  const { data, error } = await supabase
    .from("parts")
    .select(`
      *,
      technician:profiles(*),
      category:categories(*),
      condition:conditions(*),
      platform:platforms(*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
},

  async create(
    payload: Pick<Part, "title" | "description">
  ): Promise<Part> {
    const { data, error } = await supabase
      .from("parts")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: string,
    payload: Partial<Part>
  ): Promise<Part> {
    const { data, error } = await supabase
      .from("parts")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("parts")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },};