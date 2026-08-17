import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
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
                        Privacy Policy
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
                            Repair Hub (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application. Please read this policy carefully.
                        </Text>
                    </View>
                </View>

                {/* Information We Collect */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Information We Collect
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-semibold text-text dark:text-text-dark mb-2">
                            Personal Information:
                        </Text>
                        <View className="space-y-2">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="person-outline" size={16} color="#6366F1" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Name, email address, phone number, and profile information
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="location-outline" size={16} color="#6366F1" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Location data and address information
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="briefcase-outline" size={16} color="#6366F1" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Professional information (skills, experience, specialties)
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="images-outline" size={16} color="#6366F1" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Photos and media you upload
                                </Text>
                            </View>
                        </View>

                        <Text className="text-sm font-manrope-semibold text-text dark:text-text-dark mt-4 mb-2">
                            Usage Information:
                        </Text>
                        <View className="space-y-2">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="analytics-outline" size={16} color="#8B5CF6" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    App usage patterns and interaction data
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="phone-portrait-outline" size={16} color="#8B5CF6" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Device information and technical data
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="notifications-outline" size={16} color="#8B5CF6" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Notification preferences and engagement
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* How We Use Your Information */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        How We Use Your Information
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <View className="space-y-3">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <View className="flex-1">
                                    <Text className="text-sm font-manrope-semibold text-text dark:text-text-dark">
                                        Provide and Improve Services
                                    </Text>
                                    <Text className="text-xs font-manrope-light text-text-muted dark:text-text-darkMuted">
                                        To operate, maintain, and enhance our application features
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <View className="flex-1">
                                    <Text className="text-sm font-manrope-semibold text-text dark:text-text-dark">
                                        Facilitate Connections
                                    </Text>
                                    <Text className="text-xs font-manrope-light text-text-muted dark:text-text-darkMuted">
                                        To connect technicians, enable collaboration, and share listings
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <View className="flex-1">
                                    <Text className="text-sm font-manrope-semibold text-text dark:text-text-dark">
                                        Personalize Experience
                                    </Text>
                                    <Text className="text-xs font-manrope-light text-text-muted dark:text-text-darkMuted">
                                        To customize content and recommendations based on your preferences
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <View className="flex-1">
                                    <Text className="text-sm font-manrope-semibold text-text dark:text-text-dark">
                                        Communication
                                    </Text>
                                    <Text className="text-xs font-manrope-light text-text-muted dark:text-text-darkMuted">
                                        To send notifications, updates, and respond to inquiries
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Information Sharing */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Information Sharing
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                        </Text>
                        <View className="mt-3 p-3 bg-input dark:bg-input-dark rounded-lg">
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted">
                                • With other technicians when you choose to connect or collaborate
                            </Text>
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                                • With service providers who assist in app operations
                            </Text>
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                                • When required by law or to protect legal rights
                            </Text>
                            <Text className="text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                                • With your explicit consent
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Data Security */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Data Security
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                        </Text>
                        <View className="mt-3 flex-row items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                            <Text className="flex-1 text-xs font-manrope-medium text-green-600 dark:text-green-400">
                                Your data is encrypted and stored securely
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Your Rights */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Your Rights
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            You have the right to:
                        </Text>
                        <View className="mt-3 space-y-2">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="eye-outline" size={16} color="#6366F1" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Access and view your personal information
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="create-outline" size={16} color="#6366F1" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Update or correct your information
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="trash-outline" size={16} color="#6366F1" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Request deletion of your data
                                </Text>
                            </View>
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="download-outline" size={16} color="#6366F1" />
                                <Text className="flex-1 text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                                    Export your data in a portable format
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Cookies & Tracking */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Cookies & Tracking
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            We use cookies and similar tracking technologies to enhance your experience, analyze usage, and personalize content. You can control cookie preferences through your device settings.
                        </Text>
                    </View>
                </View>

                {/* Third-Party Links */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Third-Party Links
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            Our app may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                        </Text>
                    </View>
                </View>

                {/* Children's Privacy */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Children&apos;s Privacy
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            Repair Hub is not intended for children under 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                        </Text>
                    </View>
                </View>

                {/* Changes to This Policy */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Changes to This Policy
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
                        </Text>
                    </View>
                </View>

                {/* Contact Us */}
                <View className="mb-6">
                    <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                        Contact Us
                    </Text>
                    <View className="bg-card dark:bg-card-dark px-5 py-4 border border-border dark:border-border-dark rounded-lg">
                        <Text className="text-sm font-manrope-regular text-text dark:text-text-dark leading-6">
                            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
                        </Text>
                        <View className="mt-3 p-3 bg-input dark:bg-input-dark rounded-lg space-y-1">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="mail-outline" size={16} color="#6366F1" />
                                <Text className="text-sm font-manrope-medium text-text dark:text-text-dark">
                                    Email: privacy@repairhub.com
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="globe-outline" size={16} color="#6366F1" />
                                <Text className="text-sm font-manrope-medium text-text dark:text-text-dark">
                                    Website: https://repairhub.com/privacy
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="location-outline" size={16} color="#6366F1" />
                                <Text className="text-sm font-manrope-medium text-text dark:text-text-dark">
                                    Address: 123 Tech Street, Innovation City
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View className="mt-2 px-4 py-3 bg-input dark:bg-input-dark rounded-xl">
                    <View className="flex-row items-center justify-center gap-2">
                        <Ionicons name="shield-outline" size={16} color={isDark ? "#94A3B8" : "#64748B"} />
                        <Text className="text-xs text-text-muted dark:text-text-darkMuted font-manrope-light text-center">
                            Your privacy is important to us. We protect your data.
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

export default PrivacyPolicy;