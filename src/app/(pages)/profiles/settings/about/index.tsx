import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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
    "Spare parts management",
    "Repair request tracking",
    "Technician management",
    "Real-time Chat Support",
    "Real-time notifications",
    "Secure authentication",
  ];

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
          <Text className="ml-3 text-[20px] font-manrope-semibold text-text">
            About Repair Hub
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40, paddingHorizontal: 16 }}
      >
               {/* App Description */}
        <View className="mb-6">
          <Text className="mb-2 px-1 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
            Description
          </Text>
          <View className="bg-card px-5 py-4 rounded-2xl shadow-sm">
            <Text className="text-sm font-manrope-regular text-text leading-6">
              Repair Hub is a comprehensive mobile application designed for
              technicians and repair professionals. It streamlines the process
              of managing spare parts, tracking repair requests, and providing
              efficient service to customers.
            </Text>
          </View>
        </View>

        {/* Key Features */}
        <View className="mb-6">
          <Text className="mb-2 px-1 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
            Key Features
          </Text>
          <View className="bg-card px-5 py-3 rounded-2xl shadow-sm">
            {features.map((feature, index) => (
              <View
                key={index}
                className={`flex-row items-center py-2.5 ${index !== features.length - 1 ? 'border-b border-border' : ''}`}
              >
                <View className="w-5 h-5 bg-primary/10 rounded-full items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={12} color="#6366F1" />
                </View>
                <Text className="text-sm font-manrope-medium text-text">
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View className="mb-6">
          <Text className="mb-2 px-1 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
            Team
          </Text>
          <View className="bg-card px-5 py-3 rounded-2xl shadow-sm">
            {teamMembers.map((member, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between py-2.5 ${index !== teamMembers.length - 1 ? 'border-b border-border' : ''}`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 bg-primary/10 rounded-full items-center justify-center">
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color="#6366F1"
                    />
                  </View>
                  <View>
                    <Text className="text-sm font-manrope-semibold text-text">
                      {member.name}
                    </Text>
                    <Text className="text-xs font-manrope-light text-text-muted">
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
          <Text className="mb-2 px-1 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
            App Information
          </Text>
          <View className="bg-card px-5 py-3 rounded-2xl shadow-sm">
            <View className="flex-row justify-between py-2.5 border-b border-border">
              <Text className="text-sm font-manrope-medium text-text-muted">
                Version
              </Text>
              <Text className="text-sm font-manrope-semibold text-text">
                {appVersion}
              </Text>
            </View>
            <View className="flex-row justify-between py-2.5 border-b border-border">
              <Text className="text-sm font-manrope-medium text-text-muted">
                Build
              </Text>
              <Text className="text-sm font-manrope-semibold text-text">
                {buildNumber}
              </Text>
            </View>
            <View className="flex-row justify-between py-2.5 border-b border-border">
              <Text className="text-sm font-manrope-medium text-text-muted">
                Release Date
              </Text>
              <Text className="text-sm font-manrope-semibold text-text">
                {releaseDate}
              </Text>
            </View>
            <View className="flex-row justify-between py-2.5">
              <Text className="text-sm font-manrope-medium text-text-muted">
                Platform
              </Text>
              <Text className="text-sm font-manrope-semibold text-text">
                iOS & Android
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-2 px-5 py-4 bg-card rounded-2xl shadow-sm">
          <Text className="text-sm text-text-muted font-manrope-medium text-center">
            Made with ❤️ by Afaq Techs
          </Text>
          <Text className="text-xs text-text-muted font-manrope-light text-center mt-1.5">
            © 2026 Repair Hub. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutRepairHub;