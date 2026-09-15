import * as Location from "expo-location";
import { supabase } from "./supabase";
import { showError } from "./toast";

export type CurrentLocation = {
    latitude: number;
    longitude: number;
};

export async function registerCurrentLocation(
    technicianId: string
): Promise<CurrentLocation> {
    const { status } =
        await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
        showError("Location permission denied"," Please enable location permissions in your device settings.");
        return null as unknown as CurrentLocation;
    }

    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    // Save directly to profiles.location
    const { error } = await supabase.rpc(
        "update_profile_location",
        {
            p_id: technicianId,
            p_lat: latitude,
            p_lng: longitude,
        }
    );

    if (error) {
        throw error;
    }

    return {
        latitude,
        longitude,
    };
}