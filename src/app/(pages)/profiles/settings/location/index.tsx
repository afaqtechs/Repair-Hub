import { useAuth } from '@/src/context/AuthContext';
import { useMyLocation, useTechnician, useTechnicianLocationMutations } from '@/src/hooks';
import { showError, showSuccess } from '@/src/lib/toast';
import UpdateLocation from '@/src/screens/profiles/settings/location/update_location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

const Location = () => {
    const router = useRouter();
    const { user } = useAuth();
    const insets = useSafeAreaInsets();

    const userId = user?.id ?? "";

    const { data: technician } = useTechnician(userId);

    const {
        data: myLocation,
        isLoading: loading,
        isRefetching,
        error: queryError,
        refetch,
    } = useMyLocation(user?.id);

    const { refreshLocation } = useTechnicianLocationMutations();

    const location = myLocation || null;
    const [updateingLocation, setUpdatingLocation] = useState(false);

    const handleRefresh = async () => {
        try {
            await refreshLocation.mutateAsync();
            showSuccess("Success", "Location refreshed");
        } catch (err: any) {
            showError("Error", err.message || "Failed to refresh location");
        }
    };

    const handleGetDirections = () => {
        if (!location) return;
        const url = `https://www.openstreetmap.org/directions?from=&to=${location.latitude}%2C${location.longitude}`;
        Linking.openURL(url).catch(() => {
            showError("Error", "Could not open directions");
        });
    };

    const mapUrl = location
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.003
        }%2C${location.latitude - 0.003
        }%2C${location.longitude + 0.003
        }%2C${location.latitude + 0.003
        }&layer=mapnik&marker=${location.latitude
        }%2C${location.longitude
        }`
        : null;

    const error = queryError as any;

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg-dark"
        >

            <View className="flex-row justify-between items-center px-4 pt-2 pb-5 bg-bg-dark border-b border-border-dark/50">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color="#F8FAFC"  />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text-dark">
                        My Location
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => refetch()}
                    activeOpacity={0.7}
                    className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
                >
                    {isRefetching ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Ionicons name="refresh" size={20} color="#F8FAFC" />
                    )}
                </TouchableOpacity>
            </View>

            {updateingLocation ? (
                <UpdateLocation technicianId={userId} location={location} setUpdatingLocation={setUpdatingLocation}/>
            ) : (

                <>
                    {loading ? (
                        <View className="flex-1 items-center justify-center bg-bg-dark">
                            <ActivityIndicator size="large" color="#6366F1" />
                            <Text className="mt-4 text-sm font-manrope-medium text-text-darkMuted">
                                Loading location...
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="flex-1 items-center justify-center px-6 bg-bg-dark">
                            <View className="w-20 h-20 bg-red-500/10 rounded-full items-center justify-center">
                                <Ionicons name="location-outline" size={40} color="#EF4444" />
                            </View>
                            <Text className="mt-4 text-lg font-manrope-semibold text-text-dark">
                                Location Unavailable
                            </Text>
                            <Text className="mt-2 text-sm font-manrope-light text-text-darkMuted text-center max-w-xs">
                                {error?.message || "Could not fetch location"}
                            </Text>
                            <View className='mt-6 flex-row gap-3 items-center'>
                                <TouchableOpacity
                                    onPress={handleRefresh}
                                    disabled={refreshLocation.isPending}
                                    className="flex-1 px-8 py-3 bg-primary rounded-xl flex-row items-center gap-2"
                                >
                                    <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                                    <Text className="text-white font-manrope-semibold">
                                        Try Again
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setUpdatingLocation(true)}
                                    className="flex-1 flex-row items-center justify-center gap-2 py-3.5 bg-card-dark rounded-xl border border-border-dark active:opacity-80"
                                >
                                    <Ionicons name="add-outline" size={20} color="#F8FAFC"/>
                                    <Text className="text-text-dark font-manrope-semibold text-sm">
                                        Add Location
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : location ? (
                        <View className="flex-1 p-4">
                            {/* Location Info Card */}
                            <View className="mb-4 px-4 py-3 bg-card-dark rounded-xl flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
                                    <Ionicons name="location" size={20} color="#6366F1" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-manrope-semibold text-text-dark">
                                        {technician?.address || technician?.city || "Current Location"}
                                    </Text>
                                    <Text className="text-xs font-manrope-light text-text-darkMuted">
                                        {location?.latitude?.toFixed(6)}, {location?.longitude?.toFixed(6)}
                                    </Text>
                                </View>
                                <View className="px-2 py-1 bg-green-500/10 rounded-full">
                                    <Text className="text-[10px] font-manrope-medium text-green-500">
                                        Live
                                    </Text>
                                </View>
                            </View>

                            {/* Map */}
                            {mapUrl && (
                                <View className="flex-1 mb-4 bg-card-dark rounded-xl overflow-hidden">
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: "/(pages)/profiles/settings/location/map",
                                                params: {
                                                    latitude: location?.latitude.toString(),
                                                    longitude: location?.longitude.toString(),
                                                    title: [technician?.first_name, technician?.last_name]
                                                        .filter(Boolean)
                                                        .join(" "),
                                                    address: [technician?.address, technician?.city]
                                                        .filter(Boolean)
                                                        .join(", "),
                                                },
                                            })
                                        }
                                        activeOpacity={0.9}
                                        className="flex-1"
                                    >
                                        <WebView
                                            source={{ uri: mapUrl }}
                                            style={{ flex: 1 }}
                                            scrollEnabled={false}
                                            pointerEvents="none"
                                            startInLoadingState={true}
                                            renderLoading={() => (
                                                <View className="absolute inset-0 items-center justify-center bg-card-dark">
                                                    <ActivityIndicator size="small" color="#6366F1" />
                                                    <Text className="mt-2 text-xs font-manrope-medium text-text-darkMuted">
                                                        Loading map...
                                                    </Text>
                                                </View>
                                            )}
                                            onError={() => (
                                                <View className="absolute inset-0 items-center justify-center bg-card-dark">
                                                    <Ionicons name="map-outline" size={32} color="#64748B" />
                                                    <Text className="mt-2 text-xs font-manrope-medium text-text-darkMuted">
                                                        Could not load map
                                                    </Text>
                                                </View>
                                            )}
                                        />
                                        <View className="absolute bottom-3 right-3 bg-dark-card/90 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 shadow-sm">
                                            <Ionicons name="expand-outline" size={14} color= "#94A3B8" />
                                            <Text className="text-xs font-manrope-medium text-text-darkMuted">
                                                Tap to expand
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Action Buttons */}
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    className="flex-1 flex-row items-center justify-center gap-2 py-3.5 bg-primary rounded-xl active:opacity-80"
                                    onPress={handleGetDirections}
                                >
                                    <Ionicons name="navigate-outline" size={20} color="#FFFFFF" />
                                    <Text className="text-white font-manrope-semibold text-sm">
                                        Get Directions
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setUpdatingLocation(true)}
                                    className="flex-1 flex-row items-center justify-center gap-2 py-3.5 bg-card-dark rounded-xl border border-border-dark active:opacity-80"
                                >
                                    <Ionicons name="pencil-outline" size={20} color= "#F8FAFC" />
                                    <Text className="text-text-dark font-manrope-semibold text-sm">
                                        Update Location
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Location Note */}
                            <View className="mt-4 px-4 py-2 bg-input-dark rounded-xl">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="information-circle-outline" size={14} color="#94A3B8" />
                                    <Text className="text-xs font-manrope-light text-text-darkMuted flex-1">
                                        Your location helps other technicians find you and collaborate effectively.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center px-6 bg-bg-dark">
                            <View className="w-20 h-20 bg-gray-500/10 rounded-full items-center justify-center">
                                <Ionicons name="location-outline" size={40} color="#64748B" />
                            </View>
                            <Text className="mt-4 text-lg font-manrope-semibold text-text-dark">
                                No Location Found
                            </Text>
                            <Text className="mt-2 text-sm font-manrope-light text-text-darkMuted text-center">
                                Please set your location in profile settings
                            </Text>
                            <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleRefresh}
                                disabled={refreshLocation.isPending}
                                className="mt-6 px-8 py-3 bg-primary rounded-xl flex-row items-center gap-2"
                            >
                                <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                                <Text className="text-white font-manrope-semibold">
                                    Refresh Location
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setUpdatingLocation(true)}
                                className="flex-1 flex-row items-center justify-center gap-2 py-3.5 bg-card-dark rounded-xl border border-border-dark active:opacity-80"
                            >
                                <Ionicons name="pencil-outline" size={20} color="#F8FAFC"/>
                                <Text className="text-text-dark font-manrope-semibold text-sm">
                                    Update Location
                                </Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

export default Location;