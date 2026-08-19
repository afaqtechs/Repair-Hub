import ConfirmModal from "@/src/components/ui/ConfirmModal";
import HTMLRenderer from "@/src/components/ui/HTMLRenderer";
import { useAuth } from "@/src/context/AuthContext";
import { useTechnician } from "@/src/hooks";
import { showSuccess } from "@/src/lib/toast";
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

    const handleDeleteAccount = () => {
        showSuccess("deleted")
    };

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg-dark"
        >
            {/* Header */}
            <View className="px-4 pt-2 pb-5 bg-bg-dark border-b border-border-dark/50">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text-dark">
                        Account
                    </Text>
                </View>
            </View>

            {loadingTechnician ? (
                <View className="flex-1 items-center justify-center bg-bg-dark">
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
                                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-darkMuted">
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
                            <View className="bg-card-dark px-5 py-4 rounded-lg">
                                <View className="flex-col gap-1 border-b border-border-dark/30 pb-3">
                                    <Text className="text-base text-text-dark font-manrope-semibold">
                                        {technician?.first_name || ""} {technician?.last_name || ""}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-darkMuted">
                                        Full Name
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 border-b border-border-dark/30 pb-3">
                                    <Text className="text-base text-text-dark font-manrope-semibold">
                                        {technician?.phone || "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-darkMuted">
                                        Phone
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 border-b border-border-dark/30 pb-3">
                                    <Text className="text-base text-text-dark font-manrope-semibold">
                                        {technician?.email || "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-darkMuted">
                                        Email Address
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 pt-3">
                                    <Text className="text-base text-text-dark font-manrope-semibold">
                                        {technician?.role || "Not Assigned"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-darkMuted">
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
                                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-darkMuted">
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
                            <View className="bg-card-dark px-5 py-4 rounded-lg">

                                {technician?.bio ? (
                                    <HTMLRenderer
                                        html={technician.bio}
                                        fontSize={16}
                                        lineHeight={24}
                                    />
                                ) : (
                                    <Text className="text-base text-text-darkMuted font-manrope-medium">
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
                                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-darkMuted">
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
                            <View className="bg-card-dark px-5 py-4 rounded-lg">
                                <View className="flex-col gap-1 border-b border-border-dark/30 pb-3">
                                    <Text className="text-base text-text-dark font-manrope-semibold">
                                        {technician?.address || "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-darkMuted">
                                        Physical Address
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 border-b border-border-dark/30 pb-3">
                                    <Text className="text-base text-text-dark font-manrope-semibold">
                                        {technician?.city || "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-darkMuted">
                                        City
                                    </Text>
                                </View>

                                <View className="flex-col gap-1 pt-3">
                                    <Text className="text-base text-text-dark font-manrope-semibold">
                                        {technician?.experience_years ? `${technician.experience_years} years` : "Not Provided"}
                                    </Text>
                                    <Text className="text-xs font-manrope text-text-darkMuted">
                                        Experience
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {/* Account Statistics */}
                    <View className="mb-6">
                        <View className="mb-1 px-3">
                            <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-darkMuted">
                                Account Statistics
                            </Text>
                        </View>
                        <View className="bg-card-dark px-5 py-4 rounded-lg">
                            <View className="flex-row justify-between items-center py-2 border-b border-border-dark/30">
                                <Text className="text-sm font-manrope-medium text-text-darkMuted">
                                    Member Since
                                </Text>
                                <Text className="text-sm font-manrope-semibold text-text-dark">
                                    {technician?.created_at ? new Date(technician.created_at).toLocaleDateString() : "N/A"}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center py-2">
                                <Text className="text-sm font-manrope-medium text-text-darkMuted">
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
                        <View className="bg-card-dark border border-red-500/30 rounded-lg overflow-hidden">
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
                    <View className="mt-2 px-4 py-3 bg-input-dark/30 rounded-xl">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="shield-outline" size={16} color="#94A3B8"  />
                            <Text className="text-xs text-text-darkMuted font-manrope-light flex-1">
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