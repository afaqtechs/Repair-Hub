// api/categories.api.ts

import { supabase } from "@/lib/supabase";
import { Category } from "@/types/category";

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;

    return data || [];
  },

  async create(
    payload: Pick<Category, "name" | "description">
  ): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async update(
    id: string,
    payload: Partial<Category>
  ): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async remove(id: string) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};