import { signOut } from '@/src/api';
import { showError, showSuccess } from '@/src/lib/toast';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const accountItems = [
    { icon: 'person-outline', title: 'Account', route: "/(pages)/profiles/settings/account" },
    { icon: 'lock-closed-outline', title: 'Security and Privacy', route: "/(pages)/profiles/settings/security" },
];

const preferenceItems = [
    { icon: 'notifications-outline', title: 'Notifications', route: "/(pages)/profiles/settings/notifications" },
    { icon: 'location-outline', title: 'Location', route: "/(pages)/profiles/settings/location" },
];

const supportItems = [
    { icon: 'help-circle-outline', title: 'Help Center', route: "/(pages)/profiles/settings/help" },
    { icon: 'chatbubble-ellipses-outline', title: 'Submit Feedback', route: "/(pages)/profiles/settings/feedback" },
    { icon: 'information-circle-outline', title: 'About Repair Hub', route: "/(pages)/profiles/settings/about" },
];

const legalItems = [
    { icon: 'document-outline', title: 'Terms & Conditions', route: "/(pages)/profiles/settings/termsandconditions" },
    { icon: 'shield-outline', title: 'Privacy Policy', route: "/(pages)/profiles/settings/privacypolicy" },
];

const Setting = () => {
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const handleSignOut = async () => {
        try {
            await signOut();
            showSuccess("Signed out", "Signed out successfully");
            router.push("/(auth)/sign-in")
        } catch (error: any) {
            showError("Failed to logout", error.message)
        }
    };

    const renderItem = (item: any, index: number, length: number) => (
        <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => {
                if (item.route) {
                    router.push(item.route);
                }
            }}
            className="flex-row items-center justify-between py-4"
        >
            <View className="flex-row items-center flex-1">
                <Ionicons name={item.icon} size={20} color="#1F2937" />
                <Text className="ml-4 text-[15px] font-manrope-semibold text-text">
                    {item.title}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#1F2937" />
            {index !== length - 1 && (
                <View className="absolute bottom-0 left-9 right-0 h-[1px] bg-bg/50" />
            )}
        </TouchableOpacity>
    );

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg">
            {/* Header */}
            <View className="px-4 pt-2 pb-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)/profile")}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text">
                        Settings
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 40, paddingHorizontal: 16 }}
            >
                {[
                    ["Account & Privacy", accountItems],
                    ["Preferences", preferenceItems],
                    ["Support", supportItems],
                    ["Legal", legalItems],
                ].map(([title, items]: any, sectionIndex) => (
                    <React.Fragment key={title}>
                        <Text className={`mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted ${sectionIndex > 0 ? 'mt-6' : ''}`}>
                            {title}
                        </Text>
                        <View className="bg-card px-5 rounded-lg">
                            {items.map((item: any, index: number) => renderItem(item, index, items.length))}
                        </View>
                    </React.Fragment>
                ))}

                {/* LOGOUT */}
                <TouchableOpacity
                    onPress={handleSignOut}
                    activeOpacity={0.7}
                    className="mt-5 px-5 flex-row items-center py-4"
                >
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text className="ml-4 text-[15px] font-manrope-bold text-danger">
                        Log Out
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Setting;