import { deleteServiceImages } from '@/src/api';
import AppSelectModal from '@/src/components/ui/AppSelectModal';
import { useAuth } from '@/src/context/AuthContext';
import { useCategories, useCategoryMutations, usePlatformMutations, usePlatforms, useServiceMutations } from '@/src/hooks';
import { requestMediaLibraryPermission } from '@/src/lib/requestMediaLibraryPermission';
import { supabase } from '@/src/lib/supabase';
import { showError, showSuccess } from '@/src/lib/toast';
import { decodeBase64 } from '@/src/utils/decodeBase64';
import { useCreateServiceStore } from '@/store/useCreateServiceStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

type ServiceFormProps = {
    isEdit?: boolean;
    service?: any;
    onCancel?: () => void;
};

const ServiceForm = ({ isEdit = false, service, onCancel }: ServiceFormProps) => {
    const { user } = useAuth();
    const technicianId = user?.id;
    const descriptionRef = useRef<RichEditor>(null);

    const { data: categories = [], isLoading: loadingCategory } = useCategories();
    const { data: platforms = [], isLoading: loadingPlatform } = usePlatforms();
    const { form, errors, setField, initializeForm, validate, reset } = useCreateServiceStore();
    const { createService, updateService } = useServiceMutations();
    const { createCategory } = useCategoryMutations();
    const { createPlatform } = usePlatformMutations();

    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (isEdit && service) {
            initializeForm({
                technician_id: service.technician_id ?? technicianId,
                title: service.title ?? '',
                category_id: service.category_id ?? '',
                platform_id: service.platform_id ?? '',
                description: service.description ?? '',
                price: service.price ?? 0,
                is_negotiable: service.is_negotiable ?? false,
                estimated_duration: service.estimated_duration ?? '',
                images: service.images ?? [],
                localImages: service.images ?? [],
                removedImages: [],
                pendingUploads: [],
            });
            return;
        }
        reset();
    }, [isEdit, service, technicianId, initializeForm, reset]);

    if (!technicianId) {
        return (
            <View className="flex-1 items-center justify-center bg-bg">
                <Text className="text-textSecondary">User not found</Text>
            </View>
        );
    }

    const handlePickImages = async () => {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) return;

        const remaining = 3 - form.localImages.length;
        if (remaining <= 0) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.7,
            base64: true,
            selectionLimit: remaining,
        });

        if (result.canceled || !result.assets.length) return;

        // Store local previews and base64 data for later upload
        const newLocalImages = result.assets.map(asset => asset.uri);
        const newPendingUploads = result.assets.map(asset => ({
            uri: asset.uri,
            base64: asset.base64 || '',
        }));

        setField('localImages', [...form.localImages, ...newLocalImages]);
        setField('pendingUploads', [...(form.pendingUploads || []), ...newPendingUploads]);
    };

    const handleRemoveImage = (index: number) => {
        const imageToRemove = form.localImages[index];

        if (!imageToRemove) return;

        // Check if it's an existing Supabase image (edit mode)
        if (isEdit && imageToRemove.startsWith('http')) {
            setField('removedImages', [...form.removedImages, imageToRemove]);
            setField('images', form.images.filter(url => url !== imageToRemove));
        } else {
            // Remove from pending uploads if it's a new image
            const pendingIndex = form.pendingUploads?.findIndex(p => p.uri === imageToRemove);
            if (pendingIndex !== undefined && pendingIndex !== -1) {
                const newPendingUploads = [...(form.pendingUploads || [])];
                newPendingUploads.splice(pendingIndex, 1);
                setField('pendingUploads', newPendingUploads);
            }
        }

        setField('localImages', form.localImages.filter((_, i) => i !== index));
    };

    const uploadImages = async (): Promise<string[]> => {
        const pendingUploads = form.pendingUploads || [];
        if (pendingUploads.length === 0) return form.images;

        setUploadingImages(true);
        const uploadedUrls: string[] = [];
        const total = pendingUploads.length;

        try {
            for (let i = 0; i < pendingUploads.length; i++) {
                const { base64 } = pendingUploads[i];
                if (!base64) continue;

                const fileName = `${technicianId}/service_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
                const buffer = decodeBase64(base64);

                const { error } = await supabase.storage
                    .from('service-images')
                    .upload(fileName, buffer, {
                        contentType: 'image/jpeg',
                        upsert: false,
                    });

                if (error) console.log(error);

                const { data } = supabase.storage.from('service-images').getPublicUrl(fileName);
                if (!data.publicUrl) showError('Could not generate image URL.');

                uploadedUrls.push(data.publicUrl);
                setUploadProgress(Math.round(((i + 1) / total) * 100));
            }

            return [...form.images, ...uploadedUrls];
        } catch (error: any) {
            showError('Upload Failed', error?.message || 'Could not upload the images.');
            throw error;
        } finally {
            setUploadingImages(false);
            setUploadProgress(0);
            setField('pendingUploads', []);
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            let finalImages = form.images;

            // Upload new images only when submitting
            if (form.pendingUploads && form.pendingUploads.length > 0) {
                finalImages = await uploadImages();
                setField('images', finalImages);
            }

            if (isEdit) {
                if (!service?.id) {
                    showError('Update Failed', 'Service ID is missing.');
                    return;
                }

                const { localImages, removedImages, pendingUploads, technician_id, ...payload } = form;

                await updateService.mutateAsync({
                    id: service.id,
                    payload: { ...payload, images: finalImages },
                });

                if (removedImages.length > 0) {
                    await deleteServiceImages(removedImages);
                }

                showSuccess('Service Updated', 'Your service was updated successfully.');
                onCancel?.();
                return;
            }

            const { localImages, removedImages, pendingUploads, ...payload } = form;

            await createService.mutateAsync({
                ...payload,
                technician_id: technicianId,
                images: finalImages,
            });

            showSuccess('Service Created', 'Your service was published successfully.');
            reset();
        } catch (error: any) {
            showError(
                isEdit ? 'Update Failed' : 'Creation Failed',
                error?.message || 'Something went wrong.'
            );
        }
    };

    const displayImages = form.localImages;
    const isUploading = uploadingImages || createService.isPending || updateService.isPending;

    return (
        <>
            {isEdit && (
                <View className="px-5 pt-2 pb-5">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={onCancel}
                            activeOpacity={0.7}
                            className="w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border"
                        >
                            <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
                        </TouchableOpacity>
                        <Text className="ml-2 text-[20px] font-manrope-semibold text-text">
                            Editing {service?.title}
                        </Text>
                    </View>
                </View>
            )}
            <ScrollView
                contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 8, paddingBottom: 250 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Photos Section */}
                <View className="flex-col gap-1 px-3">
                    <View className="flex-row justify-between">
                        <Text className={`text-text font-manrope-semibold`}>
                            Photos{" "}
                            <Text className={`text-gray-500 font-manrope-light`}>
                                (up to 3)
                            </Text>
                        </Text>
                        {(form.pendingUploads?.length || 0) > 0 && (
                            <Text className="text-sm text-info">
                                {form.pendingUploads?.length || 0} pending uploads
                            </Text>
                        )}
                    </View>

                    <ScrollView
                        contentContainerStyle={{ paddingTop: 10 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {form.localImages.length < 3 && (
                            <TouchableOpacity
                                onPress={handlePickImages}
                                disabled={isUploading}
                                className={`w-24 h-24 mr-1 rounded-lg bg-card items-center justify-center border-2 border-dashed border-border`}
                            >
                                <Ionicons name="add" size={22} color="#34D399" />
                                <Text className={`text-success text-xs mt-1`}>Add</Text>
                            </TouchableOpacity>
                        )}

                        {displayImages.map((uri, index) => (
                            <View key={`${uri}-${index}`} className="relative mx-1">
                                <Image source={{ uri }} className="w-24 h-24 rounded-lg" resizeMode="cover" />
                                {index === 0 && (
                                    <View className="absolute top-1 left-1 bg-info px-1.5 py-0.5 rounded-full">
                                        <Text className="text-white text-[9px] font-bold">COVER</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    onPress={() => handleRemoveImage(index)}
                                    disabled={isUploading}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center"
                                >
                                    <Ionicons name="close" size={11} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <Text className={`text-xs mt-2 text-gray-500`}>
                        {form.localImages.length} of 3 images selected
                        {(form.pendingUploads?.length || 0) > 0 &&
                            ` (${form.pendingUploads?.length || 0} pending uploads)`
                        }
                    </Text>

                    {uploadingImages && uploadProgress > 0 && (
                        <View className="mt-2">
                            <Text className="text-xs text-info">Uploading: {uploadProgress}%</Text>
                            <View className="h-1 bg-gray-700 rounded-full mt-1">
                                <View
                                    className="h-1 bg-info rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </View>
                        </View>
                    )}

                    {errors.images && <Text className="text-red-500 text-xs mt-1">{errors.images}</Text>}
                </View>

                {/* Title */}
                <View className="mt-6 p-5 bg-card rounded-lg">
                    <View className="gap-2">
                        <Text className="text-text text-sm font-manrope-semibold">
                            Title <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            keyboardType="default"
                            placeholder="Enter title..."
                            placeholderTextColor="#94A3B8"
                            value={form.title}
                            onChangeText={(text) => setField("title", text)}
                            className="h-14 px-4 rounded-lg bg-bg/50 border border-border/50 text-text font-manrope"
                        />
                    </View>
                    {errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>}
                </View>

                {/* Platform & Category */}
                <View className="mt-6 p-5 gap-4 bg-card rounded-lg">
                    <View className="gap-2">
                        <Text className="text-text text-sm font-manrope-semibold">
                            Platform <Text className="text-red-500">*</Text>
                        </Text>
                        <AppSelectModal
                            title="Select Platform"
                            placeholder="Select platform"
                            data={platforms.map(item => ({ label: item.name, value: item.id }))}
                            value={form.platform_id}
                            isLoading={loadingPlatform}
                            onChange={(item) => setField("platform_id", item.value)}
                            onAdd={async (name) => {
                                const created = await createPlatform.mutateAsync({
                                    name,
                                    slug: name,
                                });

                                if (!created) {
                                    return;
                                }

                                return {
                                    label: created.name,
                                    value: created.id,
                                };
                            }}
                        />
                    </View>
                    {errors.platform_id && <Text className="text-red-500 text-xs mt-1">{errors.platform_id}</Text>}

                    <View className="gap-2">
                        <Text className="text-text text-sm font-manrope-semibold">
                            Category <Text className="text-red-500">*</Text>
                        </Text>
                        <AppSelectModal
                            title="Select Category"
                            placeholder="Select category"
                            data={categories.map(item => ({ label: item.name, value: item.id }))}
                            value={form.category_id}
                            isLoading={loadingCategory}
                            onChange={(item) => setField("category_id", item.value)}
                            onAdd={async (name) => {
                                const created = await createCategory.mutateAsync({
                                    name,
                                    slug: name,
                                });

                                if (!created) {
                                    return;
                                }

                                return {
                                    label: created.name,
                                    value: created.id,
                                };
                            }}
                        />
                    </View>
                    {errors.category_id && <Text className="text-red-500 text-xs mt-1">{errors.category_id}</Text>}
                </View>

                {/* Price */}
                <View className="mt-6 p-5 bg-card rounded-lg">
                    <View className="gap-2">
                        <Text className="text-text text-sm font-manrope-semibold">
                            Price <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            placeholder="Enter price..."
                            placeholderTextColor="#94A3B8"
                            onChangeText={(text) => {
                                const numericValue = text === '' ? 0 : Number(text);
                                setField("price", isNaN(numericValue) ? 0 : numericValue);
                            }}
                            value={form.price === 0 ? '' : form.price.toString()}
                            className="h-14 px-4 rounded-lg bg-bg/50 border border-border/50 text-text font-manrope"
                        />
                    </View>
                    {errors.price && <Text className="text-red-500 text-xs mt-1">{errors.price}</Text>}
                </View>

                {/* Negotiable */}
                <View className="mt-6 p-5 gap-4 bg-card rounded-lg">
                    <Text className="text-text text-sm font-manrope-semibold">
                        Price negotiable
                    </Text>
                    <View className="flex-row items-center gap-5">
                        {[
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                        ].map((option) => {
                            const selected = form.is_negotiable === option.value;
                            return (
                                <TouchableOpacity
                                    key={option.label}
                                    onPress={() => setField("is_negotiable", option.value)}
                                    className="flex-row items-center gap-2"
                                >
                                    <Ionicons
                                        name={selected ? "radio-button-on" : "radio-button-off"}
                                        size={20}
                                        color={selected ? "#10B981" : "#CBD5E1"}
                                    />
                                    <Text className={selected ? "text-emerald-500 font-manrope-semibold" : "text-text font-manrope"}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Duration */}
                <View className="mt-6 p-5 bg-card rounded-lg">
                    <View className="gap-2">
                        <Text className="text-text text-sm font-manrope-semibold">
                            Duration to fix <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            keyboardType="default"
                            placeholder="2 hours..."
                            placeholderTextColor="#94A3B8"
                            value={form.estimated_duration}
                            onChangeText={(text) => setField("estimated_duration", text)}
                            className="h-14 px-4 rounded-lg bg-bg/50 border border-border/50 text-text font-manrope"
                        />
                    </View>
                    {errors.estimated_duration && <Text className="text-red-500 text-xs mt-1">{errors.estimated_duration}</Text>}
                </View>

                {/* Description */}
                <View className="mt-6 gap-2 px-3">
                    <Text className="text-text text-sm font-manrope-semibold">
                        Description
                    </Text>
                    <View className="rounded-lg overflow-hidden border border-border/50">
                        <RichToolbar
                            editor={descriptionRef}
                            actions={["heading1", "bold", "italic", "underline", "unorderedList", "orderedList", "link", "removeFormat", "undo", "redo"]}
                            style={{ backgroundColor: "#F8F7FC" }}
                            iconTint="#1F2937"
                        />
                        <RichEditor
                            ref={descriptionRef}
                            editorStyle={{
                                backgroundColor:"#fff",
                                color: "#1F2937",
                                placeholderColor: "#94A3B8",
                                contentCSSText: `font-family: Manrope; font-size: 16px; padding: 12px; min-height: 120px;`,
                            }}
                            placeholder="Describe your services..."
                            initialHeight={150}
                            onChange={(html) => setField("description", html)}
                        />
                    </View>
                </View>

                {/* Actions */}
                <View className="w-full flex-row items-center gap-3 mt-8">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isUploading}
                        className="flex-1 h-14 bg-button-primary rounded-xl flex-row items-center justify-center"
                    >
                        {isUploading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name={isEdit ? 'checkmark-circle-outline' : 'add-circle-outline'} size={20} color="#FFFFFF" />
                                <Text className="ml-2 text-white text-base font-semibold">
                                    {isEdit ? 'Update Service' : 'Create Service'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={reset}
                        disabled={isUploading}
                        className="flex-1 h-14 bg-danger rounded-xl flex-row items-center justify-center"
                    >
                        <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        <Text className="ml-2 text-white text-base font-semibold">Reset Form</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

export default ServiceForm;