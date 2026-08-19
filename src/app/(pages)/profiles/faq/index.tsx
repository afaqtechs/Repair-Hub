
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
        title: 'Is Repair Hub free to use?',
        content: 'Yes, Repair Hub is completely free for customers. We connect you with trusted repair professionals who provide transparent quotes. However, repair services themselves may have costs depending on the provider.',
    },
    {
        title: 'How do I find a trusted repair professional?',
        content: 'You can browse through our curated list of verified repair experts. Each professional has a profile with reviews, ratings, and their area of expertise, helping you make an informed choice.',
    },
    {
        title: 'What if I am not satisfied with the repair service?',
        content: 'Customer satisfaction is our priority. If you are not happy with the service, you can contact our support team within 7 days. We will mediate and work towards a fair resolution with the repair professional.',
    },
    {
        title: 'How does the quoting process work?',
        content: 'You describe your repair needs, and professionals will provide you with a transparent quote. You can compare quotes and choose the best fit before committing to the service.',
    },
    {
        title: 'Can I schedule a repair immediately?',
        content: 'You can request a repair at any time. Availability depends on the schedules of our professionals, but many offer flexible booking options. You\'ll receive confirmation once your request is accepted.',
    },
    {
        title: 'What types of repairs are covered?',
        content: 'Repair Hub covers a wide range of services including electronics, appliances, vehicles, home repairs, and more. You can browse different categories to find the right professional for your specific needs.',
    },
];

const FAQAccordion = () => {
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const router = useRouter();
   const insets = useSafeAreaInsets();

    const setSections = (sections: number[]) => {
        setActiveSections(sections);
    };

    const renderHeader = (section: FAQItem,
        index: number,
        isActive: boolean) => {
        return (
            <View
                className={`flex-row justify-between items-center p-4 rounded-xl mb-2 bg-card-dark border border-border-dark ${isActive ? 'border-primary' : ''}`}
            >
                <Text className='flex-1 mr-3 text-sm font-manrope-semibold text-text-dark'>
                    {section.title}
                </Text>
                <View className={`w-8 h-8 rounded-full items-center justify-center ${isActive ? 'bg-primary/10' : 'bg-input-dark'}`}>
                    <Ionicons
                        name={isActive ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={isActive ? '#6366F1' : '#94A3B8'}
                    />
                </View>
            </View>
        );
    };

    const renderContent = (section: FAQItem) => {
        return (
            <View className={`p-4 rounded-xl mb-3 mx-1 bg-input-dark border border-border-dark`}>
                <Text className={`text-sm leading-6 font-manrope-regular text-text-dark`}>
                    {section.content}
                </Text>
            </View>
        );
    };

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg-dark"
        >
            {/* Header */}
            <View className="px-4 pt-2 pb-5 bg-bg-dark border-b border-border-dark/50">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text-dark">
                        Frequently Asked Questions
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 40, paddingHorizontal: 16 }}
            >
                {/* Intro Section */}
                <View className="mb-6 px-4 py-4 bg-card-dark rounded-xl border border-border-dark">
                    <View className="flex-row items-center gap-3">
                        <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
                            <Ionicons name="help-circle" size={24} color="#6366F1" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-manrope-semibold text-text-dark">
                                Got Questions?
                            </Text>
                            <Text className="text-xs font-manrope-light text-text-darkMuted">
                                Find answers to the most frequently asked questions
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
                            <Text className="text-sm font-manrope-semibold text-text-dark">
                                Still have questions?
                            </Text>
                            <Text className="text-xs font-manrope-light text-text-darkMuted">
                                Contact our support team for personalized assistance
                            </Text>
                        </View>
                        <TouchableOpacity
                            className="px-4 py-2 bg-primary rounded-lg"
                            onPress={() => {
                                // Navigate to help center or contact
                                // router.push("/(pages)/profiles/help");
                            }}
                        >
                            <Text className="text-white font-manrope-semibold text-xs">
                                Contact
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View className="mt-4 px-4 py-3 bg-input-dark rounded-xl">
                    <View className="flex-row items-center justify-center gap-2">
                        <Ionicons name="information-circle-outline" size={16} color="#94A3B8"/>
                        <Text className="text-xs text-text-darkMuted font-manrope-light text-center">
                            Can&apos;t find what you&apos;re looking for? Visit our Help Center.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default FAQAccordion;