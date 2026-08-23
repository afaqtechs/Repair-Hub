import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'getting_started' | 'spare_parts' | 'requests' | 'services' | 'technicians' | 'account';
}

const HelpCenter = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 'getting_started_1',
      category: 'getting_started',
      question: 'How do I get started with Repair Hub?',
      answer: 'Create your technician profile, complete your bio, and start exploring available spare parts, repair requests, and services in your area.'
    },
    {
      id: 'getting_started_2',
      category: 'getting_started',
      question: 'How do I set up my technician profile?',
      answer: 'Go to Account > Settings > Account, fill in your personal information, bio, experience, and location details. Make sure to add your specialties.'
    },
    {
      id: 'spare_parts_1',
      category: 'spare_parts',
      question: 'How do I upload spare parts?',
      answer: 'Navigate to the Create Tab or My Parts section, tap the "+" button, add part details (name, description, price, quantity, and images), then publish. Other technicians can view and request your parts.'
    },
    {
      id: 'spare_parts_2',
      category: 'spare_parts',
      question: 'How do I manage my spare parts inventory?',
      answer: 'You can edit part details, mark items as available/unavailable, and remove your spare parts.'
    },
    {
      id: 'requests_1',
      category: 'requests',
      question: 'How do I create a repair request?',
      answer: 'Go to Create Tab or My Requests, tap the "+" button, describe the issue, specify the device/service type, set urgency level, and submit. Other technicians can respond to your request.'
    },
    {
      id: 'requests_2',
      category: 'requests',
      question: 'How do I respond to repair requests?',
      answer: 'Browse available requests, tap on any request to view details, and use the "Respond" button to offer your services. You can also message the requester for more details.'
    },
    {
      id: 'services_1',
      category: 'services',
      question: 'How do I offer my repair services?',
      answer: 'Go to Create Tab or My Services, tap the "+" button, create a service listing (title, description, pricing, availability), and publish it. Clients and technicians can book your services.'
    },
    {
      id: 'technicians_1',
      category: 'technicians',
      question: 'How can I contact other technicians?',
      answer: 'Visit a technician\'s profile, tap the "Message" button to start a conversation. You can discuss spare parts, collaborate on repairs, or share expertise.'
    },
    {
      id: 'technicians_2',
      category: 'technicians',
      question: 'How do I collaborate with other technicians?',
      answer: 'Connect through the messaging system, share parts or services, refer clients to each other, and build a professional network within the Repair Hub community.'
    },
    {
      id: 'account_1',
      category: 'account',
      question: 'How do I manage my account settings?',
      answer: 'Go to Settings from your profile, where you can update personal information, change password, manage notifications, and adjust appearance preferences.'
    },
    {
      id: 'account_2',
      category: 'account',
      question: 'How do I get notification updates?',
      answer: 'Go to Settings > Notifications, customize your preferences for spare parts, repair requests, services, and general updates. Toggle notifications on/off as needed.'
    }
  ];

  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'getting_started':
        return 'Getting Started';
      case 'spare_parts':
        return 'Spare Parts';
      case 'requests':
        return 'Repair Requests';
      case 'services':
        return 'Services';
      case 'technicians':
        return 'Technicians';
      case 'account':
        return 'Account Settings';
      default:
        return '';
    }
  };

  const categories = ['getting_started', 'spare_parts', 'requests', 'services', 'technicians', 'account'];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

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
            Help Center
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40, paddingHorizontal: 16 }}
      >
        {/* Search/Intro */}
        <View className="mb-6 px-4 py-5 bg-card rounded-2xl shadow-sm">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
              <Ionicons name="help-circle" size={24} color="#6366F1" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-manrope-semibold text-text">
                How can we help you?
              </Text>
              <Text className="text-sm text-text-muted font-manrope-light mt-0.5">
                Find answers to common questions and learn how to use Repair Hub
              </Text>
            </View>
          </View>
        </View>

        {/* FAQ Sections */}
        {categories.map((category) => {
          const categoryFAQs = faqs.filter(f => f.category === category);
          if (categoryFAQs.length === 0) return null;

          return (
            <View key={category} className="mb-6">

              <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                {getCategoryTitle(category)}
              </Text>

              <View className="bg-card rounded-xl overflow-hidden shadow-sm">
                {categoryFAQs.map((faq, index) => (
                  <TouchableOpacity
                    key={faq.id}
                    activeOpacity={0.7}
                    onPress={() => toggleFAQ(faq.id)}
                    className={`px-4 py-3.5 ${index !== categoryFAQs.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="flex-1 text-sm font-manrope-semibold text-text mr-3">
                        {faq.question}
                      </Text>
                      <Ionicons
                        name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#94A3B8"
                      />
                    </View>
                    {expandedFAQ === faq.id && (
                      <Text className="mt-2.5 text-sm font-manrope-light text-text-muted leading-5">
                        {faq.answer}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}

        {/* How It Works */}
        <View className="mb-6">
          <Text className="mb-2 px-1 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
            How Repair Hub Works
          </Text>
          <View className="bg-card px-5 py-4 rounded-2xl shadow-sm">
            {[
              { num: '1', title: 'Create Your Profile', desc: 'Sign up as a technician, complete your profile with skills and experience' },
              { num: '2', title: 'Explore & Connect', desc: 'Browse spare parts, repair requests, and services from other technicians' },
              { num: '3', title: 'Share & Collaborate', desc: 'Upload your own parts, services, or requests and collaborate with peers' },
              { num: '4', title: 'Build Your Network', desc: 'Connect with technicians, grow your professional network, and expand your business' }
            ].map((step, idx, arr) => (
              <View
                key={step.num}
                className={`flex-row items-start gap-3 py-3 ${idx !== arr.length - 1 ? 'border-b border-border' : ''}`}
              >
                <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center flex-shrink-0">
                  <Text className="text-primary font-manrope-bold text-sm">{step.num}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-manrope-semibold text-text">
                    {step.title}
                  </Text>
                  <Text className="text-xs text-text-muted font-manrope-light mt-0.5">
                    {step.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="mt-1 px-4 py-3 bg-input rounded-2xl">
          <View className="flex-row items-center justify-center gap-2">
            <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
            <Text className="text-xs text-text-muted font-manrope-light text-center">
              Can&apos;t find what you&apos;re looking for? Contact our support team.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpCenter;