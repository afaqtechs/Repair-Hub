import { signOut } from "@/src/api";
import HTMLRenderer from "@/src/components/ui/HTMLRenderer";
import { useAuth } from "@/src/context/AuthContext";
import { useProfileMutations, useTechnician } from "@/src/hooks";
import { requestMediaLibraryPermission } from "@/src/lib/requestMediaLibraryPermission";
import { supabase } from "@/src/lib/supabase";
import { showError, showSuccess } from "@/src/lib/toast";
import { decodeBase64 } from "@/src/utils/decodeBase64";
import { extractFileNameFromUrl } from "@/src/utils/extractFileNameFromUrl";
import { useProfileStore } from "@/store/useProfileStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const ProfileScreen = () => {
    const { user: loggedInUser } = useAuth();
    const router = useRouter();

    const technicianId = String(loggedInUser?.id);
    const [activePopover, setActivePopover] = useState<number | null>(null);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [localImage, setLocalImage] = useState<string | null>(null);

    const {
        data: technician,
        isLoading: loadingTechnician,
        error: technicianError,
        refetch: fetchTechnician
    } = useTechnician(technicianId);

    const licenseStatus = technician?.verification_status || 'pending';

    const menuItems: {
        title: string;
        icon: IconName;
        path: string;
        notification: boolean;
    }[] = [
            {
                title: "My Services",
                icon: "construct-outline",
                path: "/(pages)/profiles/myServices",
                notification: false,
            },
            {
                title: "My Parts",
                icon: "cube-outline",
                path: "/(pages)/profiles/myParts",
                notification: false,
            },
            {
                title: "My Requests",
                icon: "document-outline",
                path: "/(pages)/profiles/myRequests",
                notification: false,
            },
            {
                title: "Saved Items",
                icon: "heart-outline",
                path: "/(pages)/profiles/saved",
                notification: false,
            },
            {
                title: "Legal Documents",
                icon: "document-text-outline",
                path: "/(pages)/profiles/document",
                notification: technician?.legal_document_url ? false : true,
            },
            {
                title: "Settings",
                icon: "settings-outline",
                path: "/(pages)/profiles/settings",
                notification: false,
            },
            {
                title: "FAQ",
                icon: "help-circle-outline",
                path: "/(pages)/profiles/faq",
                notification: false,
            },
        ];

    const {
        setField,
    } = useProfileStore();

    const { updateProfile } = useProfileMutations();

    const handlePickImages = async () => {
        const hasPermission = await requestMediaLibraryPermission();

        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsMultipleSelection: true,
            quality: 0.7,
            base64: true,
            selectionLimit: 1,
        });

        if (result.canceled) return;

        // Set local image for immediate display
        const selectedImageUri = result.assets[0]?.uri;
        if (selectedImageUri) {
            setLocalImage(selectedImageUri);
        }

        setUploadingImages(true);

        try {
            const currentProfileImage = technician?.profile_image_url;

            // Delete old image if exists
            if (currentProfileImage) {
                try {
                    const fileName = extractFileNameFromUrl(currentProfileImage);

                    if (fileName) {
                        const folderPath = `${technicianId}/${fileName}`;

                        const { error: deleteError } = await supabase.storage
                            .from("profile-images")
                            .remove([folderPath]);

                        if (deleteError) {
                            showError("Error deleting old profile image:", deleteError.message);
                        } else {
                            showError("Old profile image deleted successfully");
                        }
                    }
                } catch (deleteError: any) {
                    showError("Error during deletion:", deleteError.message);
                }
            }

            // Upload new image
            const asset = result.assets[0];
            const fileName = `${technicianId}/profile_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2)}.jpg`;

            const base64 = asset.base64!;
            if (!base64) {
                showError("Selected image has no data.");
            }
            const buffer = decodeBase64(base64);

            const { error: uploadError } = await supabase.storage
                .from("profile-images")
                .upload(fileName, buffer, {
                    contentType: "image/jpeg",
                    upsert: false,
                });

            if (uploadError) console.log(uploadError);

            const { data } = supabase.storage
                .from("profile-images")
                .getPublicUrl(fileName);

            // Update local state
            setField("profile_image_url", data.publicUrl);

            // Update profile in database
            if (technicianId) {
                try {
                    await updateProfile.mutateAsync({
                        id: technicianId,
                        payload: {
                            profile_image_url: data.publicUrl,
                        }
                    });

                    // Clear local image and refresh data
                    setLocalImage(null);
                    await fetchTechnician();
                    showSuccess("Upload Successful", "Profile image updated successfully.");
                } catch (saveError) {
                    console.error("Error saving profile:", saveError);
                    setLocalImage(null);
                    showError("Save Failed", "Failed to update profile with new image.");
                }
            }

        } catch (error: any) {
            setLocalImage(null);
            showError("Upload Failed", error.message);
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            showSuccess("Signed out", "Signed out successfully");
            router.push("/(auth)/sign-in")
        } catch (error: any) {
            showError("Failed to logout", error.message)
        }
    };

    if (loadingTechnician) {
        return (
            <View className="flex-1 items-center justify-center bg-bg">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (technicianError) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">{technicianError.message}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => fetchTechnician()}>
                        <Text className="text-text font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!technician) {
        return (
            <View className="flex-1 items-center justify-center bg-bg">
                <Text className="text-gray-500">User not found</Text>
            </View>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return '#10B981';
            case 'pending':
                return '#F59E0B';
            case 'rejected':
                return '#EF4444';
            default:
                return '#94A3B8';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'verified':
                return 'Verified';
            case 'pending':
                return 'Under Review';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Not Uploaded';
        }
    };

    // Determine which image to display
    const displayImage = localImage || technician?.profile_image_url;
    const bio = technician?.bio?.substring(0, 30)

    return (
        <>
            <View className="relative bg-bg h-[250px] px-5 pt-12 pb-8">
                <View className="flex-row justify-between items-center">
                    <Text className="text-text text-2xl font-manrope-bold">
                        Profile
                    </Text>
                    {technician?.role === "admin" ? (
                        <TouchableOpacity
                            onPress={() => Linking.openURL("https://repairhub.vercel.app")}
                            className="bg-primary px-3 py-2 rounded-full items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-manrope">
                                Dashboard
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleSignOut}
                            className="bg-danger w-9 h-9 rounded-full items-center justify-center"
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={20}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    )}

                </View>

                <View className="absolute -bottom-10 left-10 z-10 items-center mt-5">
                    <View className="relative">
                        <Image
                            source={
                                displayImage
                                    ? { uri: displayImage }
                                    : require("@/assets/ui/placeholder_person_photo.png")
                            }
                            className="w-36 h-36 rounded-full"
                        />
                        <TouchableOpacity
                            onPress={handlePickImages}
                            disabled={uploadingImages}
                            className="absolute bottom-1 right-1 w-11 h-11 rounded-2xl items-center justify-center bg-primary/95 shadow-sm"
                        >
                            <Ionicons
                                name="camera-outline"
                                size={20}
                                color="#ffffff"
                            />
                        </TouchableOpacity>
                        {uploadingImages && (
                            <View className="absolute inset-0 bg-black/30 rounded-full items-center justify-center">
                                <ActivityIndicator size="large" color="#FFFFFF" />
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-1 px-5 pb-10">
                    {/* Profile Card */}
                    <View className="-mt-6 bg-card pt-20 px-5 pb-6 shadow-gray-200/40 rounded-xl">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1 pr-2">
                                <Text className="text-2xl font-bold text-text">
                                    {technician?.first_name}  {technician?.last_name}
                                </Text>
                                <View className="flex-row items-center">
                                    <Text numberOfLines={3} className="text-gray-400 text-xs ml-0.5">
                                        <HTMLRenderer html={bio} fontSize={16} lineHeight={24} />
                                    </Text>
                                </View>
                            </View>

                            <View style={{ backgroundColor: getStatusColor(licenseStatus) + '20' }} className="px-2 py-1 rounded-full">
                                <Text style={{ color: getStatusColor(licenseStatus) }} className="text-[10px] font-manrope-medium">
                                    {getStatusText(licenseStatus)}
                                </Text>
                            </View>
                        </View>

                        {/* Rating */}
                        <View className="flex-row items-center mt-3">
                            <View className="flex-row items-center bg-yellow-50 px-3 py-1 rounded-full">
                                <Ionicons name="star" size={14} color="#F59E0B" />
                                <Text className="ml-1.5 text-gray-700 font-medium text-sm">
                                    {technician?.rating_avg}
                                </Text>
                            </View>

                            {/* Location */}
                            {(technician.address || technician.city) && (
                                <View className="flex-row items-center ml-3">
                                    <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                                    <Text className="text-gray-400 text-xs ml-0.5">
                                        {technician?.address}
                                    </Text>
                                    <Text className="text-gray-400 text-xs ml-0.5">
                                        {technician?.city}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="flex-row justify-between mt-5 pt-5 border-t border-border">
                            <View className="items-center flex-1">
                                <View className="bg-bg px-2.5 py-0.5 rounded-xl mb-1">
                                    <Text className="text-text-secondary text-[8px] font-bold uppercase tracking-wider">
                                        Rat.
                                    </Text>
                                </View>
                                <Text className="font-bold text-xl text-text">
                                    {technician?.rating_count}+
                                </Text>
                                <Text className="text-text-muted text-[10px] mt-0.5">
                                    Ratings Count.
                                </Text>
                            </View>
                            <View className="w-px h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent self-center" />
                            <View className="items-center flex-1">
                                <View className="bg-bg px-2.5 py-0.5 rounded-xl mb-1">
                                    <Text className="text-text-secondary text-[8px] font-bold uppercase tracking-wider">
                                        Rat.
                                    </Text>
                                </View>
                                <Text className="font-bold text-xl text-text">
                                    {technician?.rating_avg}
                                </Text>
                                <Text className="text-text-muted text-[10px] mt-0.5">
                                    Ratings
                                </Text>
                            </View>
                            <View className="w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent self-center" />
                            <View className="items-center flex-1">
                                <View className="bg-bg px-2.5 py-0.5 rounded-xl mb-1">
                                    <Text className="text-text-secondary text-[8px] font-bold uppercase tracking-wider">
                                        Exp.
                                    </Text>
                                </View>
                                <Text className="font-bold text-xl text-text">
                                    {technician?.experience_years}+
                                </Text>
                                <Text className="text-text-muted text-[10px] mt-0.5">
                                    Years Exp.
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="bg-card mt-5 p-5 shadow-sm rounded-xl">
                        <Text className="text-xl font-manrope-bold text-text">
                            Quick Links
                        </Text>

                        <Text className="text-sm font-manrope-medium text-text-muted mt-1">
                            Access important options quickly
                        </Text>

                        <View className="mt-5">
                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => router.push(item.path as Href)}
                                    activeOpacity={0.7}
                                    className="relative flex-row items-center justify-between py-4"
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-11 h-11 rounded-2xl bg-bg items-center justify-center">
                                            <Ionicons
                                                name={item.icon}
                                                size={20}
                                                color="#94A3B8"
                                            />
                                        </View>

                                        <Text className="ml-4 text-base font-manrope-semibold text-text">
                                            {item.title}
                                        </Text>
                                    </View>

                                    {item.notification && (
                                        <Popover
                                            isVisible={activePopover === index}
                                            placement={PopoverPlacement.BOTTOM}
                                            onRequestClose={() => setActivePopover(null)}
                                            popoverStyle={{
                                                backgroundColor: "#F8F7FC",
                                                borderRadius: 16,
                                                padding: 0,
                                                shadowColor: "#fff",
                                                shadowOpacity: 0.18,
                                                shadowRadius: 12,
                                                shadowOffset: { width: 0, height: 6 },
                                                elevation: 8,
                                            }}
                                            from={
                                                <TouchableOpacity
                                                    onPress={() => setActivePopover(index)}
                                                    hitSlop={10}
                                                    className="p-1 bg-bg rounded-full"
                                                >
                                                    <Ionicons
                                                        name="alert-outline"
                                                        size={18}
                                                        color="#EF4444"
                                                    />
                                                </TouchableOpacity>
                                            }
                                        >
                                            <View
                                                className="p-4 rounded-xl"
                                                style={{
                                                    width: 260,
                                                    backgroundColor: "#F8F7FC",
                                                }}
                                            >
                                                <View className="flex-row">
                                                    <Ionicons
                                                        name="alert-circle"
                                                        size={18}
                                                        color="#EF4444"
                                                    />

                                                    <View className="ml-2 flex-1">
                                                        <Text className="font-manrope-bold text-text">
                                                            Document Required
                                                        </Text>

                                                        <Text className="text-xs mt-1 text-text-muted">
                                                            Please upload your legal document to access more features.
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </Popover>
                                    )}
                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color="#94A3B8"
                                    />

                                    {index !== menuItems.length - 1 && (
                                        <View className="absolute bottom-0 left-[60px] right-0 h-[1px] bg-bg/50" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

export default ProfileScreen;