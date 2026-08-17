import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function MapScreen() {
    const { latitude, longitude, title, address } = useLocalSearchParams<{
        latitude: string;
        longitude: string;
        title: string;
        address: string;
    }>();
    const router = useRouter();
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const hasValidCoordinates = Number.isFinite(lat) && Number.isFinite(lng);

    const mapUrl = hasValidCoordinates
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.001
        }%2C${lat - 0.001}%2C${lng + 0.001}%2C${lat + 0.001
        }&layer=mapnik&marker=${lat}%2C${lng}`
        : "";

    const handleOpenGoogleMaps = () => {
        if (hasValidCoordinates) {
            Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`).catch(() => {
                // Fallback to OpenStreetMap
                Linking.openURL(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`);
            });
        }
    };

    const handleOpenAppleMaps = () => {
        if (hasValidCoordinates) {
            Linking.openURL(`http://maps.apple.com/?q=${lat},${lng}`).catch(() => {
                Linking.openURL(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`);
            });
        }
    };

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: 10, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            {/* Header */}
            <View className="flex-row items-center px-4 pt-2 pb-5 border-b border-border dark:border-border-dark bg-bg dark:bg-bg-dark">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                >
                    <Ionicons name="arrow-back" size={20} color={isDark ? "#F8FAFC" : "#171A2B"} />
                </TouchableOpacity>

                <View className="flex-1 mx-2">
                    <Text
                        className="text-text dark:text-text-dark font-manrope-semibold text-[16px]"
                        numberOfLines={1}
                    >
                        {title || "Location"}
                    </Text>
                    <Text className="text-text-muted dark:text-text-darkMuted font-manrope-light text-xs" numberOfLines={1}>
                        {address || "View location on map"}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleOpenGoogleMaps}
                    className="flex-row items-center gap-1.5 px-3 py-2 bg-primary/10 dark:bg-primary/20 rounded-full"
                >
                    <Ionicons name="navigate-outline" size={14} color="#6366F1" />
                    <Text className="text-primary text-xs font-manrope-semibold">
                        Directions
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Full Screen Map */}
            {hasValidCoordinates ? (
                <View className="flex-1 rounded-xl">
                    <WebView
                        source={{ uri: mapUrl }}
                        style={{ flex: 1 }}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View className="absolute inset-0 items-center justify-center bg-bg dark:bg-bg-dark">
                                <ActivityIndicator size="large" color="#6366F1" />
                                <Text className="mt-4 text-sm font-manrope-medium text-text-muted dark:text-text-darkMuted">
                                    Loading map...
                                </Text>
                            </View>
                        )}
                        onError={() => (
                            <View className="absolute inset-0 items-center justify-center bg-bg dark:bg-bg-dark">
                                <Ionicons name="map-outline" size={48} color={isDark ? "#64748B" : "#94A3B8"} />
                                <Text className="mt-3 text-center font-manrope-medium text-text-muted dark:text-text-darkMuted">
                                    Could not load map
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    className="mt-4 px-6 py-2 bg-primary rounded-xl"
                                >
                                    <Text className="text-white font-manrope-semibold text-sm">
                                        Go Back
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {/* Coordinates & Actions Overlay */}
                    <View className="absolute bottom-6 left-4 right-4">
                        {/* Coordinates Card */}
                        <View className="mb-3 px-4 py-3 bg-card/95 dark:bg-card-dark/95 rounded-xl border border-border dark:border-border-dark">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="location" size={16} color="#6366F1" />
                                    <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted">
                                        {lat?.toFixed(6)}, {lng?.toFixed(6)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        // Copy coordinates to clipboard
                                    }}
                                    className="px-2 py-1 bg-bg dark:bg-bg-dark rounded"
                                >
                                    <Text className="text-[10px] font-manrope-medium text-text-muted dark:text-text-darkMuted">
                                        Copy
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={handleOpenGoogleMaps}
                                className="flex-1 flex-row items-center justify-center gap-2 py-3.5 bg-primary rounded-xl active:opacity-80"
                            >
                                <Ionicons name="navigate-outline" size={20} color="#FFFFFF" />
                                <Text className="text-white font-manrope-semibold text-sm">
                                    Open in Maps
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleOpenAppleMaps}
                                className="flex-1 flex-row items-center justify-center gap-2 py-3.5 bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark active:opacity-80"
                            >
                                <Ionicons name="map-outline" size={20} color={isDark ? "#F8FAFC" : "#171A2B"} />
                                <Text className="text-text dark:text-text-dark font-manrope-semibold text-sm">
                                    Apple Maps
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <View className="flex-1 items-center justify-center px-6 bg-bg dark:bg-bg-dark">
                    <View className="w-20 h-20 bg-gray-500/10 rounded-full items-center justify-center">
                        <Ionicons name="location-outline" size={40} color={isDark ? "#64748B" : "#94A3B8"} />
                    </View>
                    <Text className="mt-4 text-lg font-manrope-semibold text-text dark:text-text-dark">
                        Location Unavailable
                    </Text>
                    <Text className="mt-2 text-center font-manrope-light text-text-muted dark:text-text-darkMuted max-w-xs">
                        Location data is unavailable for this technician.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mt-6 px-8 py-3 bg-primary rounded-xl flex-row items-center gap-2"
                    >
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                        <Text className="text-white font-manrope-semibold">
                            Go Back
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}