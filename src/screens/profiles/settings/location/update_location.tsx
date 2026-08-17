import { getCurrentLocation } from '@/src/lib/location';
import { supabase } from '@/src/lib/supabase';
import { showError, showSuccess } from '@/src/lib/toast';
import { useProfileStore } from '@/store/useProfileStore';
import { TechnicianLocation } from '@/types/technicianLocation';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    setUpdatingLocation: React.Dispatch<React.SetStateAction<boolean>>;
    location: TechnicianLocation | null;
    isDark: boolean;
    technicianId: string
};

const UpdateLocation = ({ technicianId, location, setUpdatingLocation, isDark }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    useEffect(() => {
        setField("latitude", location?.latitude?.toString() ?? "");
        setField("longitude", location?.longitude?.toString() ?? "");
    }, [location]);

    const {
        form,
        setField,
    } = useProfileStore();

    const handleInputChange = (
        field: "latitude" | "longitude",
        value: string
    ) => {
        setField(field, value);
    };


    const handleGetCurrentLocation = async () => {
        setIsFetchingLocation(true);
        try {
            const currentLocation = await getCurrentLocation();

            if (currentLocation) {
                setField("latitude", currentLocation.latitude.toString());
                setField("longitude", currentLocation.longitude.toString());
                showSuccess(
                    "Location Found",
                    "Current location has been fetched successfully."
                );
            } else {
                showError(
                    "Location Failed",
                    "Unable to fetch current location. Please try again."
                );
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            showError(
                "Location Error",
                "Failed to get current location. Please check your GPS settings."
            );
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const handleSubmit = async () => {

        const lat = Number(form.latitude);
        const lng = Number(form.longitude);

        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
            showError("Validation Error", "Latitude must be a number between -90 and 90."); return;
        }

        if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
            showError("Validation Error", "Longitude must be a number between -180 and 180.")
        }
        setIsLoading(true);

        try {
            const { error } = await supabase.rpc(
                "update_profile_location",
                {
                    p_id: technicianId,
                    p_lat: lat,
                    p_lng: lng,
                }
            );

            if (error) console.log(error);

            showSuccess("Success", "Location updated");
            setUpdatingLocation(false);
        } catch (error) {
            console.log(error);
            showError("Error", "Failed to update location");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setUpdatingLocation(false);
    };

    return (
        <View className='p-4'>
            <View className="bg-card dark:bg-card-dark p-4 rounded-xl shadow-sm">
                <Text className="text-text dark:text-text-dark text-lg font-bold mb-3">
                    Update Location
                </Text>

                {/* Current Location Button */}
                <TouchableOpacity
                    onPress={handleGetCurrentLocation}
                    disabled={isFetchingLocation}
                    className="bg-primary rounded-xl py-3 px-4 mb-4 flex-row items-center justify-center"
                >
                    {isFetchingLocation ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="locate-outline" size={20} color="#FFFFFF" />
                            <Text className="text-white font-semibold ml-2">
                                Get Current Location
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                <View className="h-px bg-border dark:bg-border-dark my-2" />

                {/* Latitude Input */}
                <View className="bg-input dark:bg-input-dark border border-border dark:border-border-dark rounded-xl flex-row items-center px-4 mb-3">
                    <Ionicons
                        name="navigate-outline"
                        size={20}
                        color={isDark ? "#94A3B8" : "#9CA3AF"}
                    />
                    <TextInput
                        value={form.latitude ?? ""}
                        onChangeText={(text) => handleInputChange("latitude", text)}
                        placeholder="Latitude"
                        placeholderTextColor={isDark ? "#94A3B8" : "#9CA3AF"}
                        className="flex-1 py-3.5 ml-2 text-text dark:text-text-dark"
                        keyboardType="numbers-and-punctuation"
                        editable={!isLoading}
                    />
                </View>

                {/* Longitude Input */}
                <View className="bg-input dark:bg-input-dark border border-border dark:border-border-dark rounded-xl flex-row items-center px-4 mb-3">
                    <Ionicons
                        name="navigate-outline"
                        size={20}
                        color={isDark ? "#94A3B8" : "#9CA3AF"}
                    />
                    <TextInput
                        value={form.longitude ?? ""}
                        onChangeText={(text) => handleInputChange('longitude', text)}
                        placeholder="Longitude"
                        placeholderTextColor={isDark ? "#94A3B8" : "#9CA3AF"}
                        className="flex-1 py-3.5 ml-2 text-text dark:text-text-dark"
                        keyboardType="numeric"
                        editable={!isLoading}
                    />
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-2">
                    <TouchableOpacity
                        onPress={handleCancel}
                        disabled={isLoading}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl py-3 px-4"
                    >
                        <Text className="text-text dark:text-text-dark font-semibold text-center">
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 bg-primary rounded-xl py-3 px-4"
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text className="text-white font-semibold text-center">
                                Save Location
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default UpdateLocation;