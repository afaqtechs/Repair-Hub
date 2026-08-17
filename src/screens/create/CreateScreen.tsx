import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type TabType = 'part' | 'service' | 'request';

const CreateScreen = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('part');

    const tabs = [
        {
            label: 'Spare Part',
            value: 'part' as TabType,
            icon: 'cube-outline',
            description: 'List a spare part for sale and reach potential buyers.',
            href: '/(pages)/create/part'
        },
        {
            label: 'Service',
            value: 'service' as TabType,
            icon: 'construct-outline',
            description: 'Offer repair, maintenance, towing, or other services.',
            href: '/(pages)/create/service'
        },
        {
            label: 'Request',
            value: 'request' as TabType,
            icon: 'help-circle-outline',
            description: 'Request a part or service from nearby sellers and providers.',
            href: '/(pages)/create/request'
        },
    ];

    const selectedTab = tabs.find(tab => tab.value === activeTab);

    return (
        <>
            <View className="px-5 pt-3">
                <Text className="text-text dark:text-text-dark text-2xl font-bold">
                    Create
                </Text>

                <Text className="text-text-secondary dark:text-text-darkMuted mt-2 text-base">
                    Choose what you&apos;d like to create and share with the community.
                </Text>

                <View className="mt-8 gap-4">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.value;

                        return (
                            <TouchableOpacity
                                key={tab.value}
                                onPress={() => setActiveTab(tab.value)}
                                className={`bg-card dark:bg-card-dark border rounded-xl p-5 ${isActive
                                    ? 'border-blue-500'
                                    : 'border-border dark:border-border-dark'
                                    }`}
                            >
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                                        <Ionicons
                                            name={tab.icon as any}
                                            size={24}
                                            color="#3B82F6"
                                        />
                                    </View>

                                    <View className="ml-4 flex-1">
                                        <Text className="text-text dark:text-text-dark text-lg font-semibold">
                                            {tab.label}
                                        </Text>

                                        <Text className="text-text-secondary dark:text-text-darkMuted mt-1">
                                            {tab.description}
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color="#94A3B8"
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (selectedTab) {
                            router.push(selectedTab.href as any);
                        }
                    }}
                    className="mt-8 bg-button-primary dark:bg-button-primary rounded-xl py-4 px-5 flex-row items-center justify-center gap-2 active:opacity-80"
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="#FFFFFF"
                    />

                    <Text className="text-white text-base font-semibold">
                        Create {selectedTab?.label ?? 'Item'}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default CreateScreen;