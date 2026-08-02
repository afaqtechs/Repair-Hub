import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function useSavedPart(partId: string, onUnsave?: () => void) {
    const { user } = useAuth();

    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        checkIfSaved();
    }, [partId, user?.id]);

    const checkIfSaved = async () => {
        if (!user?.id) return;
        const { data } = await supabase
            .from("saved_parts")
            .select("id")
            .eq("technician_id", user.id)
            .eq("part_id", partId)
            .single();
        setIsSaved(!!data);
    };

    const toggleSave = async () => {
        if (!user?.id || saveLoading) return;
        setSaveLoading(true);
        if (isSaved) {
            await supabase
                .from("saved_parts")
                .delete()
                .eq("technician_id", user?.id)
                .eq("part_id", partId);
            setIsSaved(false);
            onUnsave?.();
        } else {
            await supabase
                .from("saved_parts")
                .insert({ technician_id: user?.id, part_id: partId });
            setIsSaved(true);
        }
        setSaveLoading(false);
    };

    return { isSaved, saveLoading, toggleSave };
}