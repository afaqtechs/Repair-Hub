import { useTheme } from "@/src/context/ThemeContext";
import { showError, showSuccess } from "@/src/lib/toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SubmitFeedback = () => {
    const router = useRouter();
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const [subject, setSubject] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const descriptionRef = useRef<RichEditor>(null);

    const MAX_CHARS = 1000;

    const handleContentChange = (html: string) => {
        const text = html.replace(/<[^>]*>/g, '').trim();
        setCharacterCount(text.length);
    };

    const handleSubmit = async () => {
        if (!subject.trim()) {
            showError("Validation Error", "Please enter a subject for your feedback.");
            return;
        }

        descriptionRef.current?.getContentHtml().then((html) => {
            const text = html?.replace(/<[^>]*>/g, '').trim() || '';
            if (!text) {
                showError("Validation Error", "Please describe your feedback in the comment section.");
                return;
            }

            setIsSubmitting(true);

            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                showSuccess("Feedback Submitted", "Thank you for your valuable feedback!");
                router.back();
            }, 1500);
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View
                style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
                className="flex-1 bg-bg dark:bg-bg-dark"
            >
                {/* Header */}
                <View className="px-4 pt-2 pb-5 bg-bg dark:bg-bg-dark">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                            className="w-10 h-10 items-center justify-center rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                        >
                            <Ionicons name="arrow-back" size={20} color={isDark ? "#F8FAFC" : "#171A2B"} />
                        </TouchableOpacity>
                        <Text className="ml-2 text-[20px] font-manrope-semibold text-text dark:text-text-dark">
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
                        <View className="flex-row items-center gap-3 bg-primary/10 dark:bg-primary/20 p-4 rounded-xl">
                            <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center">
                                <Ionicons name="bulb-outline" size={24} color="#6366F1" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-manrope-semibold text-text dark:text-text-dark">
                                    We value your feedback!
                                </Text>
                                <Text className="text-xs text-text-muted dark:text-text-darkMuted font-manrope-light">
                                    Help us improve by sharing your thoughts, suggestions, or issues.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Subject */}
                    <View className="mb-6">
                        <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                            Subject <Text className="text-red-500">*</Text>
                        </Text>
                        <View className="bg-card dark:bg-card-dark rounded-lg overflow-hidden">
                            <TextInput
                                keyboardType="default"
                                placeholderTextColor={isDark ? "#94A3B8" : "#9CA3AF"}
                                placeholder="E.g., Feature Request, Bug Report, Suggestion"
                                value={subject}
                                onChangeText={setSubject}
                                className="px-5 py-4 text-text dark:text-text-dark bg-card dark:bg-card-dark"
                            />
                        </View>
                    </View>

                    {/* Quick Tags */}
                    <View className="mb-6">
                        <Text className="mb-2 px-3 text-xs font-manrope-medium text-text-muted dark:text-text-darkMuted">
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
                                    className="px-3 py-1.5 bg-input dark:bg-input-dark/50 rounded-full"
                                >
                                    <Text className="text-xs text-text dark:text-text-dark font-manrope-medium">
                                        #{tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Comment */}
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-1 px-3">
                            <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                                Comment <Text className="text-red-500">*</Text>
                            </Text>
                            <Text className={`text-xs font-manrope-light ${characterCount > MAX_CHARS ? 'text-red-500' : 'text-text-muted dark:text-text-darkMuted'
                                }`}>
                                {characterCount}/{MAX_CHARS}
                            </Text>
                        </View>

                        <View className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg overflow-hidden">
                            <RichToolbar
                                editor={descriptionRef}
                                actions={[
                                    "heading1",
                                    "bold",
                                    "italic",
                                    "underline",
                                    "unorderedList",
                                    "orderedList",
                                    "link",
                                    "removeFormat",
                                    "undo",
                                    "redo",
                                ]}
                                style={{
                                    backgroundColor: isDark ? "#172033" : "#FFFFFF",
                                    borderBottomWidth: 1,
                                    borderBottomColor: isDark ? "#2D3A4F" : "#E5E7EB",
                                }}
                                iconTint={isDark ? "#F8FAFC" : "#171A2B"}
                                selectedIconTint="#6366F1"
                            />

                            <RichEditor
                                ref={descriptionRef}
                                onChange={handleContentChange}
                                editorStyle={{
                                    backgroundColor: isDark ? "#111827" : "#F8F7FC",
                                    color: isDark ? "#F8FAFC" : "#171A2B",
                                    placeholderColor: isDark ? "#94A3B8" : "#9CA3AF",
                                    contentCSSText: `font-family: Manrope; font-size: 16px; padding: 12px; min-height: 150px;`,
                                }}
                                placeholder="Describe your feedback in detail... Be specific about what you'd like to see improved or what's working well."
                                initialHeight={150}
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
                                <>
                                    <Ionicons name="reload" size={20} color="#FFFFFF" className="animate-spin" />
                                    <Text className="text-white font-manrope-semibold">
                                        Submitting...
                                    </Text>
                                </>
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
                    <View className="mt-6 px-4 py-3 bg-input dark:bg-input-dark/50 rounded-xl">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="information-circle-outline" size={16} color={isDark ? "#94A3B8" : "#64748B"} />
                            <Text className="text-xs text-text-muted dark:text-text-darkMuted font-manrope-light flex-1">
                                Your feedback helps us make the app better for everyone.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

export default SubmitFeedback;