import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
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
            Privacy Policy
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {/* Content */}
        <View className="bg-card rounded-2xl shadow-sm px-5 py-3">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-3">
              <Ionicons name="shield-checkmark-outline" size={32} color="#6366F1" />
            </View>
            <Text className="text-2xl font-manrope-bold text-text">
              Privacy Policy
            </Text>
            <Text className="text-xs text-text-muted font-manrope-light mt-1">
              Repair Hub Mobile Application
            </Text>
          </View>

          <View className="bg-primary/5 rounded-xl px-4 py-3 mb-6">
            <Text className="text-sm font-manrope-medium text-primary text-center">
              Last Updated: August 2026
            </Text>
          </View>

          <Text className="text-sm font-manrope-regular text-text leading-6 mb-6">
            At Repair Hub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application. Please read this privacy policy carefully.
          </Text>

          {/* Section 1 */}
          <View className="mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                <Text className="text-primary font-manrope-bold text-xs">1</Text>
              </View>
              <Text className="text-base font-manrope-semibold text-text">
                Information We Collect
              </Text>
            </View>
            <View className="ml-8">
              <Text className="text-sm font-manrope-semibold text-text mb-1.5">
                Personal Information:
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • Name, email address, phone number
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • Profile information and bio
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • Location data (with your permission)
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6">
                • Device information and app usage data
              </Text>
            </View>
          </View>

          {/* Section 2 */}
          <View className="mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                <Text className="text-primary font-manrope-bold text-xs">2</Text>
              </View>
              <Text className="text-base font-manrope-semibold text-text">
                How We Use Your Information
              </Text>
            </View>
            <View className="ml-8">
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • To provide and maintain our services
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • To connect you with other technicians
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • To send notifications and updates
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • To improve and personalize your experience
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6">
                • To provide customer support
              </Text>
            </View>
          </View>

          {/* Section 3 */}
          <View className="mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                <Text className="text-primary font-manrope-bold text-xs">3</Text>
              </View>
              <Text className="text-base font-manrope-semibold text-text">
                Information Sharing
              </Text>
            </View>
            <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following cases:
            </Text>
            <View className="ml-8 mt-2">
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • With your consent
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • To comply with legal obligations
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6">
                • To protect the rights and safety of users
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
                Data Security
              </Text>
            </View>
            <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </Text>
          </View>

          {/* Section 5 */}
          <View className="mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                <Text className="text-primary font-manrope-bold text-xs">5</Text>
              </View>
              <Text className="text-base font-manrope-semibold text-text">
                Your Rights
              </Text>
            </View>
            <View className="ml-8">
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • Access your personal information
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • Correct inaccurate information
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • Delete your account and data
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6 mb-1.5">
                • Opt-out of marketing communications
              </Text>
              <Text className="text-sm font-manrope-regular text-text leading-6">
                • Withdraw consent at any time
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
                Cookies and Tracking
              </Text>
            </View>
            <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookie settings in your device preferences.
            </Text>
          </View>

          {/* Section 7 */}
          <View className="mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                <Text className="text-primary font-manrope-bold text-xs">7</Text>
              </View>
              <Text className="text-base font-manrope-semibold text-text">
                Data Retention
              </Text>
            </View>
            <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
              We retain your personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account at any time.
            </Text>
          </View>

          {/* Section 8 */}
          <View className="mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                <Text className="text-primary font-manrope-bold text-xs">8</Text>
              </View>
              <Text className="text-base font-manrope-semibold text-text">
                Children&apos;s Privacy
              </Text>
            </View>
            <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
              Repair Hub is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </Text>
          </View>

          {/* Section 9 */}
          <View className="mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                <Text className="text-primary font-manrope-bold text-xs">9</Text>
              </View>
              <Text className="text-base font-manrope-semibold text-text">
                Changes to This Policy
              </Text>
            </View>
            <Text className="text-sm font-manrope-regular text-text leading-6 ml-8">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
            </Text>
          </View>
          
          {/* Footer */}
          <View className="pt-4 border-t border-border">
            <Text className="text-sm font-manrope-light text-text-muted text-center">
              Effective Date: August 2026
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

export default PrivacyPolicy;