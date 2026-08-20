
import { useProfileMutations } from '@/src/hooks';
import { showError, showSuccess } from '@/src/lib/toast';
import { useProfileStore } from '@/store/useProfileStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Technician } from '../../../../../types/profiles';

type Props = {
    setEditingAdditionalInfo: React.Dispatch<React.SetStateAction<boolean>>;
    technician: Technician;
};

const UpdateAdditionalInfo = ({ setEditingAdditionalInfo, technician }: Props) => {
    const {
        form,
        errors,
        setField,
        setFields,
    } = useProfileStore();

    const { updateProfile } = useProfileMutations();

    useEffect(() => {

        setFields({
            address: technician.address ?? "",
            city: technician.city ?? "",
            experience_years: technician.experience_years ?? 0,
        });

    }, [
        technician,
        setFields
    ]);

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync({
                id: technician.id,
                payload: {
                    address: form.address,
                    city: form.city,
                    experience_years: form.experience_years,
                }
            });
            showSuccess(
                "Profile Updated",
                "Your profile updated successfully."
            );
            setEditingAdditionalInfo(false);
        } catch (error) {
            showError(
                "Failed to update",
                `Failed to update profile ${error}`
            );
        }
    };

    const Input = ({
        icon,
        value,
        placeholder,
        onChangeText,
        keyboardType,
    }: any) => (
        <View className="mt-2 bg-input border border-border/50 rounded-xl flex-row items-center px-4 flex-1">

            <Ionicons
                name={icon}
                size={20}
                color="#1F2937"
            />

            <TextInput
                value={value?.toString() ?? ""}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                className="flex-1 py-3.5 ml-2 text-text"
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
            />

        </View>
    )


    return (
        <View className="mb-6">
            <View className="flex-row items-center justify-between mb-1 px-3">
                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-Muted">
                    Update Additional Info
                </Text>
                <TouchableOpacity
                    onPress={() => setEditingAdditionalInfo(false)}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-primary/20"
                >
                    <Ionicons name="arrow-back" size={14} color="#6366F1" />
                    <Text className="text-xs font-manrope-medium text-primary">Back</Text>
                </TouchableOpacity>
            </View>
            <View className="bg-card px-5 py-4 flex-col gap-3 rounded-lg">
                <Input
                    icon="location-outline"
                    value={form.address}
                    placeholder="Physical address"
                    onChangeText={(value: any) =>
                        setField("address", value)
                    }
                />
                {errors.address && (
                    <Text className="text-red-500 text-xs mt-1">
                        {errors.address}
                    </Text>
                )}

                <Input
                    icon="business-outline"
                    value={form.city}
                    placeholder="City"
                    onChangeText={(value: any) =>
                        setField("city", value)
                    }
                />
                {errors.city && (
                    <Text className="text-red-500 text-xs mt-1">
                        {errors.city}
                    </Text>
                )}

                <Input
                    icon="briefcase-outline"
                    value={form.experience_years}
                    placeholder="Experience years"
                    keyboardType="numeric"
                    onChangeText={(value: string) =>
                        setField(
                            "experience_years",
                            value === "" ? 0 : (Number.parseInt(value.replace(/[^0-9]/g, ""), 10) || 0)
                        )
                    }
                />
                {errors.experience_years && (
                    <Text className="text-red-500 text-xs mt-1">
                        {errors.experience_years}
                    </Text>
                )}


                <View className='items-end justify-end'>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="flex-row gap-1 items-center px-3 py-1 rounded-lg bg-primary"
                    >
                        {updateProfile.isPending ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="send-outline" size={12} color="#ffffff" />
                                <Text className="text-white text-xs">
                                    Save
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View >
        </View >
    )
}

export default UpdateAdditionalInfo