import { supabase } from "../lib/supabase";

export const getMyReview = async (technicianId: string) => {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, created_at")
        .eq("reviewer_id", user.id)
        .eq("technician_id", technicianId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

export const createReview = async (
    technicianId: string,
    rating: number
) => {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in to rate a technician.");
    }

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }

    const { data, error } = await supabase
        .from("reviews")
        .upsert(
            {
                reviewer_id: user.id,
                technician_id: technicianId,
                rating,
            },
            {
                onConflict: "reviewer_id,technician_id",
            }
        )
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};