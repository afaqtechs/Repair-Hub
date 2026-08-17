import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TermsAndConditions = () => {
    const router = useRouter();
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const lastUpdated = "January 15, 2026";

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            {/* Header */}
            <View className="px-4 pt-2 pb-5 bg-bg dark:bg-bg-dark">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color={isDark ? "#F8FAFC" : "#171A2B"} />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text dark:text-text-dark">
                        Terms & Conditions
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 40, paddingHorizontal: 16 }}
            >
                {/* Last Updated */}
                <View className="mb-6 px-4 py-2 bg-input dark:bg-input-dark rounded-xl self-start">
                    <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted">
                        Last Updated: {lastUpdated}
                    </Text>
                </View>

                {/* Introduction */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Introduction
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            Welcome to Repair Hub. By using our mobile application, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using the app.
                        </Text>
                    </View>
                </View>

                {/* Agreement to Terms */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Agreement to Terms
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            By accessing or using Repair Hub, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the application.
                        </Text>
                    </View>
                </View>

                {/* User Accounts */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        User Accounts
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            When you create an account with us, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account, and you must keep your password secure.
                        </Text>
                        <View className="mt-3 p-3 bg-input dark:bg-input-dark rounded-lg">
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted">
                                • You must be at least 18 years old to use this application
                            </Text>
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                                • You are responsible for maintaining the confidentiality of your account
                            </Text>
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                                • You must notify us immediately of any unauthorized use of your account
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Technician Services */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Technician Services
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            As a technician using Repair Hub, you agree to:
                        </Text>
                        <View className="mt-3 space-y-2">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Provide accurate information about your skills, experience, and services
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Honor commitments made to other technicians and clients
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Maintain professional conduct and communication
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Comply with all applicable laws and regulations
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Spare Parts & Services */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Spare Parts & Services
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            When listing spare parts or services:
                        </Text>
                        <View className="mt-3 p-3 bg-input dark:bg-input-dark rounded-lg">
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted">
                                • All listings must be accurate and truthful
                            </Text>
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                                • Prices must be clearly stated and transparent
                            </Text>
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                                • You are responsible for fulfilling transactions
                            </Text>
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                                • Misleading or fraudulent listings will result in account termination
                            </Text>
                        </View>
                    </View>
                </View>

                {/* User Conduct */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        User Conduct
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            You agree not to:
                        </Text>
                        <View className="mt-3 space-y-2">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="close-circle" size={16} color="#EF4444" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Use the app for any illegal or unauthorized purpose
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="close-circle" size={16} color="#EF4444" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Harass, threaten, or abuse other users
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="close-circle" size={16} color="#EF4444" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Post false, misleading, or fraudulent content
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="close-circle" size={16} color="#EF4444" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Attempt to gain unauthorized access to other accounts
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Intellectual Property */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Intellectual Property
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            The content, features, and functionality of Repair Hub are owned by Repair Hub and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any content without prior written consent.
                        </Text>
                    </View>
                </View>

                {/* Limitation of Liability */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Limitation of Liability
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            Repair Hub is provided &quot;as is&quot; without any warranties. We are not liable for any damages arising from the use of our application, including but not limited to direct, indirect, incidental, or consequential damages.
                        </Text>
                    </View>
                </View>

                {/* Termination */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Termination
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            We reserve the right to terminate or suspend your account immediately, without prior notice, for conduct that we determine to be inappropriate or in violation of these terms.
                        </Text>
                    </View>
                </View>

                {/* Changes to Terms */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Changes to Terms
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            We reserve the right to update these terms at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the app after changes constitutes acceptance of the updated terms.
                        </Text>
                    </View>
                </View>

                {/* Contact Information */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Contact Us
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            If you have any questions about these Terms & Conditions, please contact us at:
                        </Text>
                        <View className="mt-3 p-3 bg-input dark:bg-input-dark rounded-lg">
                            <Text className="text-sm font-manrope-medium text-text dark:text-text-dark">
                                Email: support@repairhub.com
                            </Text>
                            <Text className="text-sm font-manrope-medium text-text dark:text-text-dark mt-1">
                                Website: https://repairhub.com
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View className="mt-2 px-4 py-3 bg-input dark:bg-input-dark rounded-xl">
                    <View className="flex-row items-center justify-center gap-2">
                        <Ionicons name="document-text-outline" size={16} color={isDark ? "#94A3B8" : "#64748B"} />
                        <Text className="text-xs text-text-muted dark:text-text-darkMuted font-manrope-light text-center">
                            By using Repair Hub, you agree to these Terms & Conditions
                        </Text>
                    </View>
                    <Text className="text-xs text-text-muted dark:text-text-darkMuted font-manrope-light text-center mt-1">
                        © 2026 Repair Hub. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default TermsAndConditions;