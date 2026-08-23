import { updateAuthCredentials } from "@/src/api";
import { useAuth } from "@/src/context/AuthContext";
import { showError, showSuccess } from "@/src/lib/toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SecurityAndPrivacy = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { user } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUpdatePassword = async () => {

        if (!currentPassword.trim()) {
            showError(
                "Validation Error",
                "Please enter your current password."
            );
            return;
        }
        if (!newPassword.trim()) {
            showError(
                "Validation Error",
                "Please enter a new password."
            );
            return;
        }
        if (newPassword.length < 6) {
            showError(
                "Validation Error",
                "New password must be at least 6 characters."
            );
            return;
        }
        if (newPassword !== confirmPassword) {
            showError(
                "Validation Error",
                "Passwords do not match."
            );
            return;
        }
        if (!user?.email) {
            showError(
                "Error",
                "User email not found."
            );
            return;
        }
        setIsSubmitting(true);

        try {
            const updatedUser = await updateAuthCredentials({
                email: user.email,
                currentPassword: currentPassword.trim(),
                newPassword,
            });

            if (!updatedUser) {
                showError(
                    "Update Failed",
                    "Unable to update your password. Please check your current password and try again."
                );
                return;
            }

            showSuccess(
                "Password Updated",
                "Your password has been changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            router.back();

        } catch (error: any) {
            showError(
                "Update Failed",
                error.message || "Unable to update password."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderPasswordInput = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        placeholder: string,
        showPassword: boolean,
        setShowPassword: (value: boolean) => void,
        isLast: boolean = false
    ) => (
        <View className={`flex-col gap-1 ${!isLast ? 'border-b border-border/50 pb-4' : ''}`}>
            <Text className="text-sm font-manrope-semibold text-text">
                {label}
            </Text>
            <View className="mt-1 bg-input border border-border rounded-xl flex-row items-center px-4">
                <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#94A3B8"
                />
                <TextInput
                    className="flex-1 py-3.5 ml-2 text-text"
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    value={value}
                    onChangeText={onChangeText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#94A3B8"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg"
        >
            {/* Header */}
            <View className="px-4 pt-2 pb-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[18px] font-manrope-semibold text-text">
                        Security & Privacy
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 40, paddingHorizontal: 16 }}
            >
                {/* Password Section */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                        Change Password
                    </Text>
                    <View className="bg-card px-5 py-4 rounded-lg">
                        {renderPasswordInput(
                            "Current Password",
                            currentPassword,
                            setCurrentPassword,
                            "Enter current password",
                            showCurrent,
                            setShowCurrent
                        )}
                        {renderPasswordInput(
                            "New Password",
                            newPassword,
                            setNewPassword,
                            "Enter new password (min 6 characters)",
                            showNew,
                            setShowNew
                        )}
                        {renderPasswordInput(
                            "Confirm New Password",
                            confirmPassword,
                            setConfirmPassword,
                            "Re-enter new password",
                            showConfirm,
                            setShowConfirm,
                            true
                        )}
                    </View>
                </View>

                {/* Security Tips */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                        Security Tips
                    </Text>
                    <View className="bg-card px-5 py-4 rounded-lg">
                        <View className="flex-row items-start gap-3 py-2 border-b border-border/50">
                            <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                            <View className="flex-1">
                                <Text className="text-sm font-manrope-semibold text-text">
                                    Use a strong password
                                </Text>
                                <Text className="text-xs text-text-muted font-manrope-light">
                                    Include numbers, symbols, and both uppercase & lowercase letters.
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-start gap-3 py-2 border-b border-border/50">
                            <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                            <View className="flex-1">
                                <Text className="text-sm font-manrope-semibold text-text">
                                    Don&apos;t reuse passwords
                                </Text>
                                <Text className="text-xs text-text-muted font-manrope-light">
                                    Use a unique password for your Repair Hub account.
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-start gap-3 py-2">
                            <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                            <View className="flex-1">
                                <Text className="text-sm font-manrope-semibold text-text">
                                    Enable two-factor authentication
                                </Text>
                                <Text className="text-xs text-text-muted font-manrope-light">
                                    Add an extra layer of security to your account.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Two-Factor Authentication */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                        Two-Factor Authentication
                    </Text>
                    <View className="bg-card px-5 py-4 rounded-lg">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
                                    <Ionicons name="shield-checkmark-outline" size={20} color="#6366F1" />
                                </View>
                                <View>
                                    <Text className="text-sm font-manrope-semibold text-text">
                                        Two-Factor Authentication
                                    </Text>
                                    <Text className="text-xs text-text-muted font-manrope-light">
                                        Add an extra layer of security to your account
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="px-4 py-2 bg-primary rounded-lg"
                                onPress={() => {
                                    showSuccess("Coming Soon", "2FA will be available in the next update.");
                                }}
                            >
                                <Text className="text-white font-manrope-semibold text-xs">
                                    Enable
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Update Password Button */}
                <TouchableOpacity
                    className={`mt-2 py-4 rounded-xl items-center ${isSubmitting
                        ? 'bg-primary/50 border border-primary/50'
                        : 'bg-primary border border-primary'
                        }`}
                    onPress={handleUpdatePassword}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                >
                    <View className="flex-row items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <Ionicons name="reload" size={20} color="#FFFFFF" className="animate-spin" />
                                <Text className="text-white font-manrope-semibold">
                                    Updating...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" />
                                <Text className="text-white font-manrope-semibold">
                                    Update Password
                                </Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Footer Note */}
                <View className="mt-6 px-4 py-3 bg-input/50 rounded-xl">
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="lock-closed-outline" size={16} color="#94A3B8" />
                        <Text className="text-xs text-text-muted font-manrope-light flex-1">
                            Your password is securely encrypted and stored. Never share your password with anyone.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SecurityAndPrivacy;