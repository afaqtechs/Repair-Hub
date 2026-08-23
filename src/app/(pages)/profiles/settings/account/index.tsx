import { deleteAccount } from "@/src/api";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import HTMLRenderer from "@/src/components/ui/HTMLRenderer";
import { useAuth } from "@/src/context/AuthContext";
import { useTechnician } from "@/src/hooks";
import { supabase } from "@/src/lib/supabase";
import { showError, showSuccess } from "@/src/lib/toast";
import UpdateAdditionalInfo from "@/src/screens/profiles/settings/account/update_additional_info";
import UpdateBio from "@/src/screens/profiles/settings/account/update_bio";
import UpdateGeneralInfo from "@/src/screens/profiles/settings/account/update_general_info";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AccountSettings = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const userId = user?.id ?? "";
    const [editingGeneralInfo, setEditingGeneralInfo] = useState(false);
    const [editingBio, setEditingBio] = useState(false);
    const [editingAdditionalInfo, setEditingAdditionalInfo] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        data: technician,
        isLoading: loadingTechnician,
    } = useTechnician(userId);

    const handleDeleteAccount = async () => {
        try {

            await deleteAccount();

            await supabase.auth.signOut();

            router.replace("/(auth)/sign-in");
            showSuccess("Deleted", "Acount deleted successfully, you need to register again.")
        } catch (error: any) {
            showError(
                "Delete account failed",
                error?.message || "Unable to delete your account"
            );
        }
    };

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg"
        >
            {/* Header */}
            <View className="px-4 pt-2 pb-5 bg-bg border-b border-border/50">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[18px] font-manrope-semibold text-text">
                        Account
                    </Text>
                </View>
            </View>

            {loadingTechnician ? (
                <View className="flex-1 items-center justify-center bg-bg">
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 40, paddingHorizontal: 16 }}
                >
                    {/* Personal Information */}
                    {editingGeneralInfo && technician ? (
                        <UpdateGeneralInfo setEditingGeneralInfo={setEditingGeneralInfo} technician={technician} />
                    ) : (

                        <View className="mb-6">
                            <View className="flex-row items-center justify-between mb-1 px-3">
                                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                                    Personal Information
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setEditingGeneralInfo(true)}
                                    activeOpacity={0.7}
                                    className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-primary/20"
                                >
                                    <Ionicons name="pencil-outline" size={14} color="#6366F1" />
                                    <Text className="text-xs font-manrope-medium text-primary">Update</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="bg-card px-5 py-4 rounded-lg">
                                <View className="flex-col gap-1 border-b border-border/30 pb-3">
                                    <Text className="text-base text-text font-manrope-semibold">
                                        {technician?.first_name || ""} {technician?.last_name || ""}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-muted">
                                        Full Name
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 border-b border-border/30 pb-3">
                                    <Text className="text-base text-text font-manrope-semibold">
                                        {technician?.phone || "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-muted">
                                        Phone
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 border-b border-border/30 pb-3">
                                    <Text className="text-base text-text font-manrope-semibold">
                                        {technician?.email || "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-muted">
                                        Email Address
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 pt-3">
                                    <Text className="text-base text-text font-manrope-semibold">
                                        {technician?.role || "Not Assigned"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-muted">
                                        Assigned Role
                                    </Text>
                                </View>
                            </View>
                        </View >
                    )}

                    {/* Bio */}
                    {editingBio && technician ? (
                        <UpdateBio setEditingBio={setEditingBio} technician={technician} />
                    ) : (
                        <View className="mb-6">
                            <View className="flex-row items-center justify-between mb-1 px-3">
                                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                                    Bio
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setEditingBio(true)}
                                    activeOpacity={0.7}
                                    className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-primary/20"
                                >
                                    <Ionicons name="pencil-outline" size={14} color="#6366F1" />
                                    <Text className="text-xs font-manrope-medium text-primary">Update</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="bg-card px-5 py-4 rounded-lg">

                                {technician?.bio ? (
                                    <HTMLRenderer
                                        html={technician.bio}
                                        fontSize={16}
                                        lineHeight={24}
                                    />
                                ) : (
                                    <Text className="text-base text-text-muted font-manrope-medium">
                                        No bio provided
                                    </Text>
                                )}

                            </View>
                        </View >
                    )}

                    {/* Additional Information */}
                    {editingAdditionalInfo && technician ? (
                        <UpdateAdditionalInfo setEditingAdditionalInfo={setEditingAdditionalInfo} technician={technician} />
                    ) : (
                        <View className="mb-6">
                            <View className="flex-row items-center justify-between mb-1 px-3">
                                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                                    Additional Information
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setEditingAdditionalInfo(true)}
                                    activeOpacity={0.7}
                                    className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-primary/20"
                                >
                                    <Ionicons name="pencil-outline" size={14} color="#6366F1" />
                                    <Text className="text-xs font-manrope-medium text-primary">Update</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="bg-card px-5 py-4 rounded-lg">
                                <View className="flex-col gap-1 border-b border-border/30 pb-3">
                                    <Text className="text-base text-text font-manrope-semibold">
                                        {technician?.address || "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-muted">
                                        Physical Address
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 border-b border-border/30 pb-3">
                                    <Text className="text-base text-text font-manrope-semibold">
                                        {technician?.city || "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-muted">
                                        City
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 pt-3">
                                    <Text className="text-base text-text font-manrope-semibold">
                                        {technician?.experience_years ? `${technician.experience_years} years` : "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-muted">
                                        Experience
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {/* Account Statistics */}
                    <View className="mb-6">
                        <View className="mb-1 px-3">
                            <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                                Account Statistics
                            </Text>
                        </View>
                        <View className="bg-card px-5 py-4 rounded-lg">
                            <View className="flex-row justify-between items-center py-2 border-b border-border/30">
                                <Text className="text-sm font-manrope-medium text-text-muted">
                                    Member Since
                                </Text>
                                <Text className="text-sm font-manrope-semibold text-text">
                                    {technician?.created_at ? new Date(technician.created_at).toLocaleDateString() : "N/A"}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-sm font-manrope-medium text-text-muted">
                                    Account Status
                                </Text>
                                <View className="px-3 py-1 bg-green-500/10 rounded-full">
                                    <Text className="text-xs font-manrope-semibold text-green-500">
                                        Active
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Danger Zone */}
                    <View className="mb-4">
                        <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-red-500">
                            Danger Zone
                        </Text>
                        <View className="bg-card border border-red-500/30 rounded-lg overflow-hidden">
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(true)}
                                activeOpacity={0.7}
                                className="flex-row items-center justify-between px-5 py-4"
                            >
                                <View className="flex-row items-center">
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    <Text className="ml-4 text-[15px] font-manrope-semibold text-red-500">
                                        Delete Account
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer Note */}
                    <View className="mt-2 px-4 py-3 bg-input/30 rounded-xl">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="shield-outline" size={16} color="#94A3B8" />
                            <Text className="text-xs text-text-muted font-manrope-light flex-1">
                                Your personal information is securely stored and protected.
                            </Text>
                        </View>
                    </View>
                </ScrollView >
            )}

            <ConfirmModal
                visible={showDeleteModal}
                title="Delete Account"
                message="Are you sure you want delete your account, your info including all your data will be removed"
                confirmText="Delete Account"
                destructive
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
            />
        </View >
    );
};

export default AccountSettings;