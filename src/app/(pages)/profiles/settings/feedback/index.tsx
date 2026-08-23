
import { showError, showSuccess } from "@/src/lib/toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SubmitFeedback as submitFeedbackApi } from "@/src/api";

const SubmitFeedback = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [subject, setSubject] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const [message, setMessage] = useState("");

    const MAX_CHARS = 1000;

    const handleMessageChange = (text: string) => {
        setMessage(text);
        setCharacterCount(text.length);
    };

    const handleSubmit = async () => {
        if (!subject.trim()) {
            showError(
                "Validation Error",
                "Please enter a subject for your feedback."
            );
            return;
        }

        const text = message.trim();

        if (!text) {
            showError(
                "Validation Error",
                "Please describe your feedback in the comment section."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await submitFeedbackApi({
                subject: subject.trim(),
                message: text,
            });

            if (!result) {
                showError(
                    "Submission Failed",
                    "Could not submit your feedback. Please try again."
                );
                return;
            }

            showSuccess(
                "Feedback Submitted",
                "Thank you for your valuable feedback!"
            );

            router.back();
        } catch {
            showError(
                "Submission Failed",
                "Something went wrong while submitting your feedback."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
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
                            className="w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border"
                        >
                            <Ionicons name="arrow-back" size={20} color="#1F2937" />
                        </TouchableOpacity>
                        <Text className="ml-2 text-[18px] font-manrope-semibold text-text">
                            Submit Feedback
                        </Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: 10,
                        paddingBottom: 40,
                        paddingHorizontal: 16,
                        flexGrow: 1
                    }}
                >
                    {/* Hero/Info Section */}
                    <View className="mb-6">
                        <View className="flex-row items-center gap-3 bg-primary/20 p-4 rounded-xl">
                            <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
                                <Ionicons name="bulb-outline" size={24} color="#6366F1" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-manrope-semibold text-text">
                                    We value your feedback!
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope-light">
                                    Help us improve by sharing your thoughts, suggestions, or issues.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Subject */}
                    <View className="mb-6">
                        <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                            Subject <Text className="text-red-500">*</Text>
                        </Text>
                        <View className="bg-card rounded-lg overflow-hidden">
                            <TextInput
                                keyboardType="default"
                                placeholderTextColor="#94A3B8"
                                placeholder="E.g., Feature Request, Bug Report, Suggestion"
                                value={subject}
                                onChangeText={setSubject}
                                className="px-5 py-4 text-text bg-card"
                            />
                        </View>
                    </View>

                    {/* Quick Tags */}
                    <View className="mb-6">
                        <Text className="mb-2 px-3 text-xs font-manrope-medium text-text-muted">
                            Quick tags:
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {["Feature", "Bug", "UX", "Performance", "UI"].map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    onPress={() => {
                                        const newSubject = subject ? `${subject} ${tag}` : tag;
                                        setSubject(newSubject);
                                    }}
                                    className="px-3 py-1.5 bg-input/50 rounded-full"
                                >
                                    <Text className="text-xs text-text font-manrope-medium">
                                        #{tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Comment */}
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-1 px-3">
                            <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                                Comment <Text className="text-red-500">*</Text>
                            </Text>
                            <Text className={`text-xs font-manrope-light ${characterCount > MAX_CHARS ? 'text-red-500' : 'text-text-muted'
                                }`}>
                                {characterCount}/{MAX_CHARS}
                            </Text>
                        </View>

                        <View className="bg-card border border-border rounded-lg overflow-hidden">
                            <TextInput
                                value={message}
                                onChangeText={handleMessageChange}
                                placeholder="Describe your feedback in detail... Be specific about what you'd like to see improved or what's working well."
                                placeholderTextColor="#94A3B8"
                                multiline
                                textAlignVertical="top"
                                maxLength={MAX_CHARS}
                                className="px-4 py-4 text-text bg-card min-h-[150px]"
                                style={{
                                    fontFamily: "Manrope",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className={`mt-2 py-4 rounded-xl items-center ${isSubmitting || !subject.trim()
                            ? 'bg-primary/50 border border-primary/50'
                            : 'bg-primary border border-primary'
                            }`}
                        onPress={handleSubmit}
                        disabled={isSubmitting || !subject.trim()}
                        activeOpacity={0.8}
                    >
                        <View className="flex-row items-center gap-2">
                            {isSubmitting ? (
                                <View className="flex-row items-center gap-2">
                                    <ActivityIndicator size="small" color="#ffffff" />
                                    <Text className="text-white font-manrope-semibold">
                                        Submitting...
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    <Ionicons name="send-outline" size={20} color="#FFFFFF" />
                                    <Text className="text-white font-manrope-semibold">
                                        Submit Feedback
                                    </Text>
                                </>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Footer Note */}
                    <View className="mt-6 px-4 py-3 bg-input/50 rounded-xl">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
                            <Text className="text-xs text-text-muted font-manrope-light flex-1">
                                Your feedback helps us make the app better for everyone.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    );
};

export default SubmitFeedback;