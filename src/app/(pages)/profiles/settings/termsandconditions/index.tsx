import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TermsAndConditions = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg"
        >
            {/* Header */}
            <View className="px-4 pt-2 pb-5 bg-bg">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="ml-3 text-[18px] font-manrope-semibold text-text">
                        Terms & Conditions
                    </Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            >
                {/* Content */}
                <View className="bg-card rounded-xl shadow-sm px-5 py-3">
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-3">
                            <Ionicons name="document-text-outline" size={32} color="#6366F1" />
                        </View>
                        <Text className="text-2xl font-manrope-bold text-text">
                            Terms and Conditions
                        </Text>
                        <Text className="text-xs text-text-muted font-manrope-light mt-1">
                            Repair Hub Mobile Application
                        </Text>
                    </View>

                    <View className="bg-primary/5 rounded-xl px-4 py-3 mb-6">
                        <Text className="text-sm font-manrope-medium text-primary text-center">
                            Last Updated: January 2026
                        </Text>
                    </View>

                    <Text className="text-sm font-manrope-regular text-text leading-6 mb-6">
                        Welcome to Repair Hub. By downloading, installing, or using our mobile application, you agree to be bound by these Terms and Conditions. Please read them carefully before using the app.
                    </Text>

                    {/* Section 1 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">1</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Acceptance of Terms
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            By using Repair Hub, you agree to comply with and be bound by these terms. If you do not agree to these terms, please do not use the application.
                        </Text>
                    </View>

                    {/* Section 2 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">2</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Description of Service
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            Repair Hub is a mobile application that connects technicians and repair professionals, facilitating the management of spare parts, repair requests, services, and professional networking.
                        </Text>
                    </View>

                    {/* Section 3 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">3</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                User Accounts
                            </Text>
                        </View>
                        <View className="ml-8">
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • You must create an account to use the full features of the application.
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • You are responsible for maintaining the confidentiality of your account credentials.
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • You agree to provide accurate and complete information during registration.
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6">
                                • You are solely responsible for all activities that occur under your account.
                            </Text>
                        </View>
                    </View>

                    {/* Section 4 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">4</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                User Conduct
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8 mb-2">
                            You agree to use Repair Hub only for lawful purposes and in a way that does not infringe the rights of others. You must not:
                        </Text>
                        <View className="ml-8">
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • Post false, misleading, or fraudulent information
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • Harass, threaten, or abuse other users
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • Upload malicious code or viruses
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • Attempt to gain unauthorized access to other accounts
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6">
                                • Use the app for any illegal activities
                            </Text>
                        </View>
                    </View>

                    {/* Section 5 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">5</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Spare Parts and Services
                            </Text>
                        </View>
                        <View className="ml-8">
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • Users may list spare parts and services for other technicians to view and request.
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • All listings must be accurate and truthful.
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                                • Transactions between users are private agreements. Repair Hub is not responsible for disputes.
                            </Text>
                            <Text className="text-sm font-manrope-regular text-text leading-6">
                                • We reserve the right to remove any listing that violates our policies.
                            </Text>
                        </View>
                    </View>

                    {/* Section 6 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">6</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Intellectual Property
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            All content, features, and functionality of Repair Hub, including but not limited to text, graphics, logos, icons, and software, are the exclusive property of Afaq Techs and are protected by copyright and other intellectual property laws.
                        </Text>
                    </View>

                    {/* Section 7 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">7</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Privacy Policy
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            Your use of Repair Hub is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                        </Text>
                    </View>

                    {/* Section 8 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">8</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Third-Party Services
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            Repair Hub may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party services.
                        </Text>
                    </View>

                    {/* Section 9 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">9</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Termination
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            We reserve the right to suspend or terminate your account at any time, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users of the app.
                        </Text>
                    </View>

                    {/* Section 10 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">10</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Disclaimer of Warranties
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            Repair Hub is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the app will be uninterrupted or error-free.
                        </Text>
                    </View>

                    {/* Section 11 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">11</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Limitation of Liability
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            To the maximum extent permitted by law, Afaq Techs shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the app.
                        </Text>
                    </View>

                    {/* Section 12 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">12</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Changes to Terms
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Your continued use of the app after any changes indicates your acceptance of the updated terms.
                        </Text>
                    </View>

                    {/* Section 13 */}
                    <View className="mb-5">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">13</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Governing Law
                            </Text>
                        </View>
                        <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
                            These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Afaq Techs operates, without regard to its conflict of law provisions.
                        </Text>
                    </View>

                    {/* Section 14 */}
                    <View className="mb-6">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                                <Text className="text-primary font-manrope-bold text-xs">14</Text>
                            </View>
                            <Text className="text-base font-manrope-semibold text-text">
                                Contact Information
                            </Text>
                        </View>
                        <View className="ml-8">
                            <Text className="text-sm font-manrope-regular text-text leading-6 mb-1">
                                If you have any questions about these Terms and Conditions, please contact us at:
                            </Text>
                            <Text className="text-sm font-manrope-semibold text-text leading-6">
                                📧 support@repairhub.com
                            </Text>
                            <Text className="text-sm font-manrope-semibold text-text leading-6">
                                🌐 www.repairhub.com
                            </Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="pt-4 border-t border-border">
                        <Text className="text-sm font-manrope-light text-text-muted text-center">
                            Effective Date: January 2026
                        </Text>
                        <Text className="text-xs font-manrope-light text-text-muted text-center mt-2">
                            © 2026 Repair Hub. All rights reserved.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default TermsAndConditions;