
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

type Props = {
    visible: boolean;
    url: string | null;
    onClose: () => void;
    isImage?: boolean;
};

const DocumentViewerModal = ({
    visible,
    url,
    onClose,
    isImage = false,
}: Props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    if (!url) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-bg py-8">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
                    <Text className="text-lg font-manrope-semibold text-text">
                        Document Preview
                    </Text>
                    <View className="flex-row items-center gap-2">
                        {/* <TouchableOpacity
                            activeOpacity={0.7}
                            className="w-10 h-10 items-center justify-center rounded-full bg-card"
                        >
                            <Ionicons
                                name="download-outline"
                                size={22}
                                color="#1F2937"
                            />
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 items-center justify-center rounded-full bg-card"
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color="#EF4444"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1">
                    {isImage ? (
                        <View className="flex-1 items-center justify-center bg-black/5">
                            <Image
                                source={{ uri: url }}
                                resizeMode="contain"
                                className="w-full h-full"
                                onLoadStart={() => setLoading(true)}
                                onLoadEnd={() => setLoading(false)}
                                onError={() => {
                                    setLoading(false);
                                    setError(true);
                                }}
                            />
                            {loading && (
                                <View className="absolute inset-0 items-center justify-center">
                                    <ActivityIndicator size="large" color="#6366F1" />
                                </View>
                            )}
                            {error && (
                                <View className="absolute inset-0 items-center justify-center px-6">
                                    <Ionicons name="image-outline" size={48} color="#94A3B8" />
                                    <Text className="mt-3 text-center font-manrope-medium text-text-muted">
                                        Could not load image
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setError(false);
                                            setLoading(true);
                                            setLoading(true);
                                        }}
                                        className="mt-4 px-6 py-2 bg-primary rounded-lg"
                                    >
                                        <Text className="text-white font-manrope-semibold">Retry</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ) : (
                        <WebView
                            source={{
                                uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
                            }}
                            startInLoadingState
                            renderLoading={() => (
                                <View className="flex-1 items-center justify-center">
                                    <ActivityIndicator
                                        size="large"
                                        color="#6366F1"
                                    />

                                    <Text className="mt-3 text-sm font-manrope-medium text-text-muted">
                                        Loading document...
                                    </Text>
                                </View>
                            )}
                            style={{ flex: 1 }}
                            onError={(event) => {
                                console.log(
                                    "WebView error:",
                                    event.nativeEvent
                                );
                                setError(true);
                            }}
                        />
                    )}

                    {error && !isImage && (
                        <View className="absolute inset-0 items-center justify-center px-6 bg-bg">
                            <Ionicons name="document-text-outline" size={48} color="#94A3B8" />
                            <Text className="mt-3 text-center font-manrope-medium text-text-muted">
                                Could not load document
                            </Text>
                            <Text className="mt-1 text-xs font-manrope-light text-text-muted text-center">
                                The document may be private or unavailable
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setError(false);
                                    setLoading(true);
                                    // You could trigger a refresh of the signed URL here
                                }}
                                className="mt-4 px-6 py-2 bg-primary rounded-lg"
                            >
                                <Text className="text-white font-manrope-semibold">Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default DocumentViewerModal;