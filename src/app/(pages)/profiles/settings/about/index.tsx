
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AboutRepairHub = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const appVersion = "1.0.0";
  const buildNumber = "100";
  const releaseDate = "January 2026";

  const teamMembers = [
    { name: "Development Team", role: "Core Development" },
    { name: "Design Team", role: "UI/UX Design" },
    { name: "Quality Assurance", role: "Testing & Support" },
  ];

  const features = [
    "🔧 Spare parts management",
    "📱 Repair request tracking",
    "👨‍🔧 Technician management",
    "📊 Real-time notifications",
    "🔒 Secure authentication",
    "🌙 Dark mode support",
  ];

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@repairhub.com');
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://repairhub.com');
  };

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-bg-dark"
    >
      {/* Header */}
      <View className="px-4 pt-2 pb-5 bg-bg-dark">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
          >
            <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
          </TouchableOpacity>
          <Text className="ml-2 text-[20px] font-manrope-semibold text-text-dark">
            About Repair Hub
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40, paddingHorizontal: 16 }}
      >
        {/* App Logo/Icon */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-primary/20 rounded-3xl items-center justify-center mb-4">
            <Ionicons name="build-outline" size={48} color="#6366F1" />
          </View>
          <Text className="text-2xl font-manrope-bold text-text-dark">
            Repair Hub
          </Text>
          <Text className="text-sm font-manrope-light text-text-darkMuted mt-1">
            Version {appVersion} ({buildNumber})
          </Text>
          <View className="mt-2 px-3 py-1 bg-green-500/10 rounded-full">
            <Text className="text-xs font-manrope-medium text-green-500">
              ● Active
            </Text>
          </View>
        </View>

        {/* App Description */}
        <View className="mb-6">
          <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-widertext-text-darkMuted">
            Description
          </Text>
          <View className="bg-card-dark px-5 py-4 border border-border-dark rounded-lg">
            <Text className="text-sm font-manrope-regular text-text-dark leading-6">
              Repair Hub is a comprehensive mobile application designed for
              technicians and repair professionals. It streamlines the process
              of managing spare parts, tracking repair requests, and providing
              efficient service to customers.
            </Text>
          </View>
        </View>

        {/* Key Features */}
        <View className="mb-6">
          <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-darkMuted">
            Key Features
          </Text>
          <View className="bg-card-dark px-5 py-4 border border-border-dark rounded-lg">
            {features.map((feature, index) => (
              <View
                key={index}
                className={`flex-row items-center py-2 ${index !== features.length - 1 ? 'border-b border-border-dark/50' : ''}`}
              >
                <Text className="text-sm font-manrope-medium text-text-dark">
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View className="mb-6">
          <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-darkMuted">
            Team
          </Text>
          <View className="bg-card-dark px-5 py-4 border border-border-dark rounded-lg">
            {teamMembers.map((member, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between py-2.5 ${index !== teamMembers.length - 1 ? 'border-b border-border-dark/50' : ''}`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color="#6366F1"
                    />
                  </View>
                  <View>
                    <Text className="text-sm font-manrope-semibold text-text-dark">
                      {member.name}
                    </Text>
                    <Text className="text-xs font-manrope-light text-text-darkMuted">
                      {member.role}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View className="mb-6">
          <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-darkMuted">
            App Information
          </Text>
          <View className="bg-card-dark px-5 py-4 border border-border-dark rounded-lg">
            <View className="flex-row justify-between py-2 border-b border-border-dark/50">
              <Text className="text-sm font-manrope-medium text-text-darkMuted">
                Version
              </Text>
              <Text className="text-sm font-manrope-semibold text-text-dark">
                {appVersion}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-border-dark/50">
              <Text className="text-sm font-manrope-medium text-text-darkMuted">
                Build
              </Text>
              <Text className="text-sm font-manrope-semibold text-text-dark">
                {buildNumber}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-border-dark/50">
              <Text className="text-sm font-manrope-medium :text-text-darkMuted">
                Release Date
              </Text>
              <Text className="text-sm font-manrope-semibold text-text-dark">
                {releaseDate}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-sm font-manrope-medium text-text-darkMuted">
                Platform
              </Text>
              <Text className="text-sm font-manrope-semibold text-text-dark">
                iOS & Android
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 py-3.5 bg-primary rounded-xl"
            onPress={handleEmailSupport}
          >
            <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
            <Text className="text-white font-manrope-semibold text-sm">
              Email Support
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-2 py-3.5 bg-card-dark rounded-xl border border-border-dark"
            onPress={handleVisitWebsite}
          >
            <Ionicons name="globe-outline" size={20} color="#F8FAFC" />
            <Text className="text-text-dark font-manrope-semibold text-sm">
              Visit Website
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-2 px-4 py-3 bg-input-dark rounded-xl">
          <View className="flex-row items-center gap-2">
            <Ionicons name="heart-outline" size={16} color="#6366F1" />
            <Text className="text-xs text-text-darkMuted font-manrope-light flex-1 text-center">
              Made with ❤️ by Repair Hub Team
            </Text>
          </View>
          <Text className="text-xs text-text-darkMuted font-manrope-light text-center mt-1">
            © 2026 Repair Hub. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutRepairHub;