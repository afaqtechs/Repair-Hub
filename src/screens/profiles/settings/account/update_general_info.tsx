
import { useProfileMutations } from '@/src/hooks';
import { showError, showSuccess } from '@/src/lib/toast';
import { useProfileStore } from '@/store/useProfileStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Technician } from '../../../../../types/profiles';

type Props = {
    setEditingGeneralInfo: React.Dispatch<React.SetStateAction<boolean>>;
    technician: Technician;
};

const UpdateGeneralInfo = ({ setEditingGeneralInfo, technician }: Props) => {

    const {
        form,
        errors,
        setField,
        setFields,
    } = useProfileStore();

    const { updateProfile } = useProfileMutations();


    useEffect(() => {
        setFields({
            first_name: technician.first_name,
            last_name: technician.last_name,
            email: technician.email,
            phone: technician.phone,
        });

    }, [technician, setFields]);

    const handleSave = async () => {

        try {
            await updateProfile.mutateAsync({
                id: technician.id,
                payload: {
                    first_name: form.first_name,
                    last_name: form.last_name,
                    phone: form.phone,
                }
            });
            showSuccess(
                "Profile Updated",
                "Your profile updated successfully."
            );
            setEditingGeneralInfo(false);
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
        editable = true,
    }: any) => {

        return (
            <View className={`mt-2 ${editable ? "bg-input" : "bg-card"} border border-border/50 rounded-xl flex-row items-center px-4 flex-1`}>
                <Ionicons
                    name={icon}
                    size={20}
                    color="#1F2937"
                />

                <TextInput
                    value={value ?? ""}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    className="flex-1 py-3.5 ml-2 text-text"
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    editable={editable}
                />

            </View>
        )

    }

    return (
        <View className="mb-6">
            <View className="flex-row items-center justify-between mb-1 px-3">
                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted">
                    Update General Info
                </Text>
                <TouchableOpacity
                    onPress={() => setEditingGeneralInfo(false)}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-primary/20"
                >
                    <Ionicons name="arrow-back" size={14} color="#6366F1" />
                    <Text className="text-xs font-manrope-medium text-primary">Back</Text>
                </TouchableOpacity>
            </View>
            <View className="bg-card px-5 py-4 flex-col gap-3 rounded-lg">
                <Input
                    icon="person-outline"
                    value={form.first_name}
                    placeholder="First name"
                    onChangeText={(value: any) =>
                        setField("first_name", value)
                    }
                />
                {errors.first_name && (
                    <Text className="text-red-500 text-xs mt-1">
                        {errors.first_name}
                    </Text>
                )}

                <Input
                    icon="person-outline"
                    value={form.last_name}
                    placeholder="Last name"
                    onChangeText={(value: any) =>
                        setField("last_name", value)
                    }
                />
                {errors.last_name && (
                    <Text className="text-red-500 text-xs mt-1">
                        {errors.last_name}
                    </Text>
                )}

                <Input
                    icon="phone-portrait-outline"
                    value={form.phone}
                    placeholder="Phone number"
                    keyboardType="numeric"
                    onChangeText={(value: any) =>
                        setField("phone", value)
                    }
                />
                {errors.phone && (
                    <Text className="text-red-500 text-xs mt-1">
                        {errors.phone}
                    </Text>
                )}

                <Input
                    icon="mail-outline"
                    value={form.email}
                    placeholder="Email address"
                    keyboardType="email-address"
                    editable={false}
                />

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

export default UpdateGeneralInfo