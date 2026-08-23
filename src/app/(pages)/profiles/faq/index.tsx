
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FAQItem {
    title: string;
    content: string;
}

const FAQ_SECTIONS: FAQItem[] = [
    {
        title: 'What is RepairHub?',
        content:
            'RepairHub is a platform that helps you find technicians, repair services, and spare parts for your devices. You can browse available services and parts, view technician profiles, check ratings and availability, and contact technicians directly.',
    },
    {
        title: 'What can I find on RepairHub?',
        content:
            'RepairHub focuses on device repair services and spare parts. You can browse services and parts by platform, category, and other available filters to find what you need.',
    },
    {
        title: 'How do I find a technician?',
        content:
            'You can browse available repair services and spare parts to discover technicians who provide them. You can also view a technician’s profile to see their information, ratings, location, availability, services, and parts.',
    },
    {
        title: 'How do I contact a technician?',
        content:
            'When you find a service or part you are interested in, you can contact the technician through RepairHub. You can start a chat directly from the listing or call the technician if a phone number is available.',
    },
    {
        title: 'Can I chat with a technician before requesting a service?',
        content:
            'Yes. RepairHub allows you to chat with technicians directly. You can use the chat to discuss the repair, ask questions, clarify the service details, and communicate before deciding to proceed.',
    },
    {
        title: 'How do I know if a technician is available?',
        content:
            'Technicians can indicate their availability on their RepairHub profile. Service and part listings also show their current status when applicable. Availability can change, so it is recommended to contact the technician before visiting or arranging a repair.',
    },
    {
        title: 'How do I choose the right repair service?',
        content:
            'Review the service title, description, platform, category, price, availability, negotiability, and technician information. You can also check the technician’s rating and profile before contacting them.',
    },
    {
        title: 'Are service prices negotiable?',
        content:
            'Some technicians allow price negotiation while others do not. Each service indicates whether its price is negotiable, so check the service details before contacting the technician.',
    },
    {
        title: 'Can I find spare parts on RepairHub?',
        content:
            'Yes. RepairHub allows technicians to list spare parts that they have available. You can browse parts, view their details, check the seller’s information, and contact the technician when you are interested.',
    },
    {
        title: 'Can I save services or parts for later?',
        content:
            'Yes. You can save listings that you are interested in so you can easily find them again later without having to search for them again.',
    },
    {
        title: 'How can I report a problem with a listing?',
        content:
            'If you find a listing that appears incorrect, misleading, inappropriate, or otherwise problematic, use the available reporting option on the listing. This helps us keep RepairHub useful and trustworthy for everyone.',
    },
    {
        title: 'Is RepairHub responsible for the repair itself?',
        content:
            'RepairHub connects customers with independent technicians and provides tools for discovering services, parts, and contacting technicians. The actual repair service, price, timing, and agreement are made between the customer and technician.',
    },
    {
        title: 'How do I update my technician profile?',
        content:
            'Technicians can update their profile information from the Profile section. You can manage information such as your name, phone number, location, bio, experience, profile photo, and other available profile details.',
    },
    {
        title: 'How do technicians manage their services and parts?',
        content:
            'Technicians can create and manage their service and spare-part listings. They can update listing information, change availability, and remove listings when they are no longer available.',
    },
    {
        title: 'What should I do if I cannot find the service or part I need?',
        content:
            'Try using the Search feature and available filters to find a suitable service or part. If you still cannot find what you need, you can contact available technicians through RepairHub and ask whether they can provide the required repair or part.',
    },
    {
        title: 'Is RepairHub free to use?',
        content:
            'RepairHub provides the platform for discovering technicians, services, and spare parts. Any repair, service, or spare-part price is determined by the technician and is separate from using the RepairHub platform.',
    },
];

const FAQAccordion = () => {
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const setSections = (sections: number[]) => {
        setActiveSections(sections);
    };

    const renderHeader = (
        section: FAQItem,
        index: number,
        isActive: boolean
    ) => {
        return (
            <View
                style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: isActive ? "#5B3DF5" : "#E5E7EB",
                    borderWidth: 1,
                }}
                className="flex-row justify-between items-center p-4 rounded-xl mb-2"
            >
                <Text className="flex-1 mr-3 text-sm font-manrope-semibold text-text">
                    {section.title}
                </Text>

                <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${isActive ? "bg-primary/10" : "bg-input"
                        }`}
                >
                    <Ionicons
                        name={isActive ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={isActive ? "#5B3DF5" : "#94A3B8"}
                    />
                </View>
            </View>
        );
    };
    const renderContent = (section: FAQItem) => {
        return (
            <View className={`p-4 rounded-xl mb-3 mx-1 bg-input border border-border`}>
                <Text className={`text-sm leading-6 font-manrope-regular text-text`}>
                    {section.content}
                </Text>
            </View>
        );
    };

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg"
        >
            {/* Header */}
            <View className="px-4 pt-2 pb-5 bg-bg border-b border-border/50">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[18px] font-manrope-semibold text-text">
                        Frequently Asked Questions
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 40, paddingHorizontal: 16 }}
            >
                {/* Intro Section */}
                <View className="mb-6 px-4 py-4 bg-card rounded-xl border border-border">
                    <View className="flex-row items-center gap-3">
                        <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
                            <Ionicons name="help-circle" size={24} color="#6366F1" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-manrope-semibold text-text">
                                How can we help?
                            </Text>

                            <Text className="text-xs font-manrope-light text-text-muted">
                                Find answers about finding technicians, repair services, spare parts, and using RepairHub.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* FAQ Accordion */}
                <Accordion
                    activeSections={activeSections}
                    sections={FAQ_SECTIONS}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    onChange={setSections}
                    expandMultiple={false}
                    duration={300}
                    sectionContainerStyle={{
                        marginBottom: 4,
                    }}
                />

                {/* Still Have Questions */}
                <View className="mt-6 px-4 py-4 bg-primary/10 rounded-xl border border-primary/20">
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
                            <Ionicons name="chatbubbles-outline" size={20} color="#6366F1" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-manrope-semibold text-text">
                                Need more help?
                            </Text>

                            <Text className="text-xs font-manrope-light text-text-muted">
                                If you can&apos;t find an answer here, our support team can help you.
                            </Text>
                        </View>
                        <TouchableOpacity
                            className="px-4 py-2 bg-primary rounded-lg"
                            onPress={() => {
                                router.push("/(pages)/profiles/settings/help");
                            }}
                        >
                            <Text className="text-white font-manrope-semibold text-xs">
                                Get support
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View className="mt-4 px-4 py-3 bg-input rounded-xl">
                    <View className="flex-row items-center justify-center gap-2">
                        <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
                        <Text className="text-xs text-text-muted font-manrope-light text-center">
                            Can&apos;t find what you&apos;re looking for? Contact RepairHub support.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default FAQAccordion;