import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function useSavedService(serviceId: string, onUnsave?: () => void) {
    const { user } = useAuth();

    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        checkIfSaved();
    }, [serviceId, user?.id]);

    const checkIfSaved = async () => {
        if (!user?.id) return;
        const { data } = await supabase
            .from("saved_services")
            .select("id")
            .eq("technician_id", user.id)
            .eq("service_id", serviceId)
            .single();
        setIsSaved(!!data);
    };

    const toggleSave = async () => {
        if (!user?.id || saveLoading) return;
        setSaveLoading(true);
        if (isSaved) {
            await supabase
                .from("saved_services")
                .delete()
                .eq("technician_id", user?.id)
                .eq("service_id", serviceId);
            setIsSaved(false);
            onUnsave?.();
        } else {
            await supabase
                .from("saved_services")
                .insert({ technician_id: user?.id, service_id: serviceId });
            setIsSaved(true);
        }
        setSaveLoading(false);
    };

    return { isSaved, saveLoading, toggleSave };
}