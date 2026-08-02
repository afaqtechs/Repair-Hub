import { signOut } from '@/api';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const accountItems = [
    { icon: 'person', title: 'Account' },
    { icon: 'person-outline', title: 'Edit Profile' },
    { icon: 'lock-closed-outline', title: 'Change Password' },
    { icon: 'document-text-outline', title: 'Legal Documents' },
];

const preferenceItems = [
    { icon: 'notifications-outline', title: 'Notifications' },
    { icon: 'location-outline', title: 'Location' },
    { icon: 'moon-outline', title: 'Appearance', route: "/(root)/profiles/settings/appearance/appearance" },
];

const supportItems = [
    { icon: 'help-circle-outline', title: 'Help Center' },
    { icon: 'chatbubble-ellipses-outline', title: 'Submit Feedback' },
    { icon: 'star-outline', title: 'Rate App' },
    { icon: 'bug-outline', title: 'Report a Problem' },
    { icon: 'information-circle-outline', title: 'About Repair Hub' },
];

const legalItems = [
    { icon: 'document-outline', title: 'Terms & Conditions' },
    { icon: 'shield-outline', title: 'Privacy Policy' },
];

const Setting = () => {
    const router = useRouter();
    const { isDark } = useTheme();

    const handleSignOut = async () => {
        try {
            await signOut();
            Alert.alert("Signed Out", "You have been signed out successfully.");
        } catch (error: any) {
            Alert.alert("Error", error.message);
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
                <Ionicons name={item.icon} size={20} color={isDark ? "#CBD5E1" : "#667085"} />
                <Text className="ml-4 text-[15px] font-manrope-semibold text-text dark:text-text-dark">
                    {item.title}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={isDark ? "#94A3B8" : "#98A2B3"} />
            {index !== length - 1 && (
                <View className="absolute bottom-0 left-9 right-0 h-[1px] bg-border/50 dark:bg-bg-dark/50" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-bg dark:bg-bg-dark">
            {/* Header */}
            <View className="px-5 pt-2 pb-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)/profile")}
                        activeOpacity={0.7}
                        className="w-11 h-11 items-center justify-center rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color={isDark ? "#F8FAFC" : "#171A2B"} />
                    </TouchableOpacity>
                    <Text className="ml-4 text-[24px] font-manrope-semibold text-text dark:text-text-dark">
                        Settings
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 40, paddingHorizontal: 10 }}
            >
                {[
                    ["Account", accountItems],
                    ["Preferences", preferenceItems],
                    ["Support", supportItems],
                    ["Legal", legalItems],
                ].map(([title, items]: any, sectionIndex) => (
                    <React.Fragment key={title}>
                        <Text className={`mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted ${sectionIndex > 0 ? 'mt-6' : ''}`}>
                            {title}
                        </Text>
                        <View className="bg-card dark:bg-card-dark px-5 border border-border dark:border-border-dark rounded-lg">
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
        </SafeAreaView>
    );
};

export default Setting;