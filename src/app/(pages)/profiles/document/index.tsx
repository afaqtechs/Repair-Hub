import DocumentViewerModal from "@/src/components/ui/DocumentViewerModal";
import { useAuth } from "@/src/context/AuthContext";
import { useProfileMutations, useTechnician } from "@/src/hooks";
import { supabase } from "@/src/lib/supabase";
import { showError, showSuccess } from "@/src/lib/toast";
import { decodeBase64 } from "@/src/utils/decodeBase64";
import { extractFileNameFromUrl } from "@/src/utils/extractFileNameFromUrl";
import { formatFileSize } from "@/src/utils/formatFileSize";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LegalDocument = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { user } = useAuth();
    const technicianId = user?.id;

    const [selectedFile, setSelectedFile] = useState<{
        uri: string;
        name: string;
        size: number;
        mimeType: string;
    } | null>(null);
    const [uploading, setUploading] = useState(false);

    const {
        data: technician,
        isLoading: loadingTechnician,
        refetch: refetchTechnician
    } = useTechnician(technicianId || "");

    const { updateProfile } = useProfileMutations();

    const legalDocumentUrl = technician?.legal_document_url ?? null;
    const isLicenseUploaded = !!legalDocumentUrl;
    const licenseStatus = technician?.verification_status ?? "pending";

    console.log()

    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerUrl, setViewerUrl] = useState<string | null>(null);
    const [deletingDocument, setDeletingDocument] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return '#10B981';
            case 'pending':
                return '#F59E0B';
            case 'rejected':
                return '#EF4444';
            default:
                return '#94A3B8';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'verified':
                return 'Verified';
            case 'pending':
                return 'Under Review';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Not Uploaded';
        }
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/pdf", "image/*"],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            const file = new File(asset.uri);
            const fileInfo = await file.info();

            const size = fileInfo.exists ? fileInfo.size ?? asset.size : undefined;
            if (size === undefined) {
                showError("Error", "Could not read the file size");
                return;
            }

            if (size > 2 * 1024 * 1024) {
                showError("File Too Large", "Please select a file smaller than 2MB");
                return;
            }

            setSelectedFile({
                uri: asset.uri,
                name: asset.name || "document",
                size: fileInfo.size || 0,
                mimeType: asset.mimeType || "application/pdf",
            });
        } catch (error: any) {
            showError("Error", error.message || "Failed to select document");
        }
    };

    const handleUploadDocument = async () => {
        if (!selectedFile) {
            showError("No File", "Please select a document first");
            return;
        }

        if (!technicianId) {
            showError("Error", "User not authenticated");
            return;
        }

        setUploading(true);

        try {
            const file = new File(selectedFile.uri);
            const base64 = await file.base64();

            const fileExtension = selectedFile.name.includes(".")
                ? selectedFile.name.split(".").pop()
                : selectedFile.mimeType.split("/").pop();

            const filePath = `${technicianId}/legal_doc_${Date.now()}.${fileExtension}`;

            const { error: uploadError } = await supabase.storage
                .from("legal_documents")
                .upload(
                    filePath,
                    decodeBase64(base64),
                    {
                        contentType: selectedFile.mimeType,
                        upsert: false,
                    }
                );

            // IMPORTANT: stop if upload failed
            if (uploadError) {
                showError(
                    "Upload Failed",
                    uploadError.message
                );
                return;
            }

            // Save the storage path in profile
            await updateProfile.mutateAsync({
                id: technicianId,
                payload: {
                    legal_document_url: filePath,
                    verification_status: "pending",
                },
            });

            await refetchTechnician();

            setSelectedFile(null);

            showSuccess(
                "Upload Successful",
                "Your license has been uploaded and is pending review"
            );

        } catch (error: any) {
            showError(
                "Upload Failed",
                error.message || "Failed to upload document"
            );
        } finally {
            setUploading(false);
        }
    };


    const handleViewDocument = async () => {

        if (!technician?.legal_document_url) return;

        const { data, error } =
            await supabase.storage
                .from("legal_documents")
                .createSignedUrl(
                    technician.legal_document_url,
                    300
                );

        if (error || !data?.signedUrl) {
            showError("Error", error?.message || "Could not open the document");
            return;
        }

        setViewerUrl(data.signedUrl);
        setViewerVisible(true);
    };

    const handleDeleteDocument = async () => {
        if (!technicianId) {
            showError("Error", "User not authenticated");
            return;
        }

        if (!technician?.legal_document_url) {
            showError(
                "No Document",
                "There is no legal document to delete."
            );
            return;
        }

        setDeletingDocument(true);

        try {
            const fileName = extractFileNameFromUrl(
                technician.legal_document_url
            );

            if (!fileName) {
                showError(
                    "Error",
                    "Could not determine the document file."
                );
                return;
            }

            const filePath = `${technicianId}/${fileName}`;

            // 1. Delete Storage file
            const { error: deleteError } = await supabase.storage
                .from("legal_documents")
                .remove([filePath]);

            if (deleteError) {
                showError(
                    "Delete Failed",
                    deleteError.message
                );
                return;
            }

            // 2. Clear profile URL
            await updateProfile.mutateAsync({
                id: technicianId,
                payload: {
                    legal_document_url: null,
                    verification_status: "pending",
                },
            });

            // 3. Refresh technician data
            await refetchTechnician();

            showSuccess(
                "Deleted",
                "Legal document deleted successfully."
            );

        } catch (error: any) {
            showError(
                "Delete Failed",
                error.message || "Failed to delete document"
            );
        } finally {
            setDeletingDocument(false);
        }
    };


    if (loadingTechnician) {
        return (
            <View className="flex-1 items-center justify-center bg-bg">
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

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
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text">
                        Legal Documents
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 40, paddingHorizontal: 16 }}
            >

                {!isLicenseUploaded && !selectedFile && (
                    <View className="mb-6 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl flex-row items-center gap-3">
                        <Ionicons name="alert-circle" size={20} color="#EF4444" />
                        <Text className="flex-1 text-sm font-manrope-medium text-red-400">
                            License required to access all features
                        </Text>
                    </View>
                )}

                <View className="mb-6">
                    <Text className="mb-3 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                        Business License
                    </Text>

                    <View className="bg-card border border-border rounded-lg overflow-hidden">
                        <View className="px-4 py-4 flex-row items-center">
                            <View className={`w-12 h-12 rounded-full items-center justify-center ${isLicenseUploaded ? 'bg-primary/10' :
                                selectedFile ? 'bg-yellow-500/10' : 'bg-input'
                                }`}>
                                <Ionicons
                                    name={
                                        isLicenseUploaded ? 'checkmark-circle' :
                                            selectedFile ? 'document-text-outline' :
                                                'document-text-outline'
                                    }
                                    size={24}
                                    color={
                                        isLicenseUploaded ? '#10B981' :
                                            selectedFile ? '#F59E0B' : '#94A3B8'
                                    }
                                />
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="text-base font-manrope-semibold text-text">
                                    Business License
                                </Text>
                                <Text className="text-xs font-manrope-light text-text-muted">
                                    {isLicenseUploaded ? (
                                        `Status: ${getStatusText(licenseStatus)}`
                                    ) : selectedFile ? (
                                        `${selectedFile.name} (${formatFileSize(selectedFile.size)})`
                                    ) : (
                                        "Upload your official business license"
                                    )}
                                </Text>
                            </View>
                            {isLicenseUploaded && (
                                <View style={{ backgroundColor: getStatusColor(licenseStatus) + '20' }} className="px-2 py-1 rounded-full">
                                    <Text style={{ color: getStatusColor(licenseStatus) }} className="text-[10px] font-manrope-medium">
                                        {getStatusText(licenseStatus)}
                                    </Text>
                                </View>
                            )}
                            {selectedFile && !isLicenseUploaded && (
                                <TouchableOpacity
                                    onPress={() => setSelectedFile(null)}
                                    className="px-2 py-1 rounded-full bg-red-500/10"
                                >
                                    <Ionicons name="close" size={16} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Action Buttons */}
                        <View className="px-4 pb-4">
                            {uploading ? (
                                <View className="py-3 bg-primary/50 rounded-lg flex-row items-center justify-center gap-2">
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                    <Text className="text-white font-manrope-semibold">Uploading...</Text>
                                </View>
                            ) : isLicenseUploaded ? (
                                <View className="flex-row gap-2">
                                    <TouchableOpacity
                                        className="flex-1 py-3 bg-card border border-border rounded-lg flex-row items-center justify-center gap-2"
                                        onPress={handleViewDocument}
                                    >
                                        <Ionicons name="eye-outline" size={18} color="#F8FAFC" />
                                        <Text className="text-text font-manrope-semibold text-sm">View</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleDeleteDocument}
                                        className="flex-1 py-3 bg-red-500/10 border border-red-500/30 rounded-lg flex-row items-center justify-center gap-2"

                                    >
                                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                        <Text className="text-red-500 font-manrope-semibold text-sm">{deletingDocument ? "Deleting..." : 'Delete'}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : selectedFile ? (
                                <TouchableOpacity
                                    className="py-3 bg-primary rounded-lg flex-row items-center justify-center gap-2"
                                    onPress={handleUploadDocument}
                                >
                                    <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                                    <Text className="text-white font-manrope-semibold">Upload to Server</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    className="py-3 bg-primary rounded-lg flex-row items-center justify-center gap-2"
                                    onPress={handlePickDocument}
                                >
                                    <Ionicons name="document-outline" size={20} color="#FFFFFF" />
                                    <Text className="text-white font-manrope-semibold">Pick Document</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Why Upload */}
                <View className="mb-6 px-4 py-4 bg-card rounded-lg border border-border">
                    <Text className="text-sm font-manrope-semibold text-text mb-2">
                        Why upload your license?
                    </Text>
                    <Text className="text-xs font-manrope-light text-text-muted leading-5">
                        Verifies your legitimacy as a technician and builds trust within our community.
                    </Text>
                </View>

                {/* Requirements */}
                <View className="mb-6 px-4 py-4 bg-card rounded-lg border border-border">
                    <Text className="text-sm font-manrope-semibold text-text mb-2">
                        Requirements
                    </Text>
                    <View className="space-y-2">
                        <View className="flex-row items-start gap-2">
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text className="flex-1 text-xs font-manrope-light text-text-muted">
                                Valid business license or registration
                            </Text>
                        </View>
                        <View className="flex-row items-start gap-2">
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text className="flex-1 text-xs font-manrope-light text-text-muted">
                                Accepted: PDF, JPG, PNG (max 2MB)
                            </Text>
                        </View>
                        <View className="flex-row items-start gap-2">
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text className="flex-1 text-xs font-manrope-light text-text-muted">
                                Must be clearly visible and valid
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer Note */}
                <View className="px-4 py-3 bg-input rounded-lg">
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="shield-outline" size={16} color="#94A3B8" />
                        <Text className="text-xs font-manrope-light text-text-muted flex-1">
                            Securely stored and reviewed within 24-48 hours
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <DocumentViewerModal
                visible={viewerVisible}
                url={viewerUrl}
                onClose={() => {
                    setViewerVisible(false);
                    setViewerUrl(null);
                }}
            />
        </View>
    );
};

export default LegalDocument;