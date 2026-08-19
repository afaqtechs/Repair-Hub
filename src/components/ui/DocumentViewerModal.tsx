import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system";
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

    // const handleDownload = async () => {
    //     try {
    //         const downloadResumable = FileSystem.createDownloadResumable(
    //             url,
    //             FileSystem.documentDirectory + 'document.pdf'
    //         );
    //         const result = await downloadResumable.downloadAsync();
    //         if (result) {
    //             Alert.alert(
    //                 "Download Complete",
    //                 `File saved to: ${result.uri}`
    //             );
    //         }
    //     } catch (error) {
    //         Alert.alert("Download Failed", "Could not download the document");
    //     }
    // };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-bg-dark">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-dark">
                    <Text className="text-lg font-manrope-semibold text-text-dark">
                        Document Preview
                    </Text>
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            // onPress={handleDownload}
                            className="w-10 h-10 items-center justify-center rounded-full bg-card-dark"
                        >
                            <Ionicons
                                name="download-outline"
                                size={22}
                                color="#F8FAFC"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 items-center justify-center rounded-full bg-card-dark"
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
                                    <Text className="mt-3 text-center font-manrope-medium text-text-darkMuted">
                                        Could not load image
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setError(false);
                                            setLoading(true);
                                            // Reload image by setting state
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
                            source={{ uri: url }}
                            startInLoadingState={true}
                            renderLoading={() => (
                                <View className="flex-1 items-center justify-center">
                                    <ActivityIndicator size="large" color="#6366F1" />
                                    <Text className="mt-3 text-sm font-manrope-medium text-text-darkMuted">
                                        Loading document...
                                    </Text>
                                </View>
                            )}
                            onError={() => {
                                setError(true);
                            }}
                            style={{ flex: 1 }}
                            onHttpError={(event) => {
                                console.log('HTTP Error:', event.nativeEvent);
                                setError(true);
                            }}
                        />
                    )}

                    {error && !isImage && (
                        <View className="absolute inset-0 items-center justify-center px-6 bg-bg-dark">
                            <Ionicons name="document-text-outline" size={48} color="#94A3B8" />
                            <Text className="mt-3 text-center font-manrope-medium text-text-darkMuted">
                                Could not load document
                            </Text>
                            <Text className="mt-1 text-xs font-manrope-light text-text-darkMuted text-center">
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