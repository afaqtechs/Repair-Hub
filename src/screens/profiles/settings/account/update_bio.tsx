import { useTheme } from '@/src/context/ThemeContext';
import { useProfileMutations } from '@/src/hooks';
import { showError, showSuccess } from '@/src/lib/toast';
import { useProfileStore } from '@/store/useProfileStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { Technician } from '../../../../../types/profiles';

type Props = {
    setEditingBio: React.Dispatch<React.SetStateAction<boolean>>;
    technician: Technician;
};

const UpdateBio = ({ setEditingBio, technician }: Props) => {

    const { isDark } = useTheme();

    const bioRef = useRef<RichEditor>(null);

    const {
        form,
        setField,
        setFields,
    } = useProfileStore();

    const { updateProfile } = useProfileMutations();


    useEffect(() => {
        setFields({
            bio: technician.bio ?? "",
        });

    }, [technician, setFields]);
    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync({
                id: technician.id,
                payload: {
                    bio: form.bio,
                }
            });
            showSuccess(
                "Bio Updated",
                "Your background updated successfully."
            );
            setEditingBio(false);
        } catch (error) {
            showError(
                "Failed to update",
                `Failed to update profile ${error}`
            );
        }
    };

    return (
        <View className="mb-6">
            <View className="flex-row items-center justify-between mb-1 px-3">
                <Text className="text-xs font-manrope-bold uppercase tracking-wider text-text-muted dark:text-text-darkMuted">
                    Update Bio
                </Text>
                <TouchableOpacity
                    onPress={() => setEditingBio(false)}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 dark:bg-primary/20"
                >
                    <Ionicons name="arrow-back" size={14} color="#6366F1" />
                    <Text className="text-xs font-manrope-medium text-primary">Back</Text>
                </TouchableOpacity>
            </View>
            <View className="rounded-lg overflow-hidden border border-border/50 dark:border-border-dark/50">
                <RichToolbar
                    editor={bioRef}
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
                    }}
                    iconTint={isDark ? "#F8FAFC" : "#171A2B"}
                />


                <RichEditor
                    initialContentHTML={form.bio || technician.bio || ""}
                    ref={bioRef}
                    editorStyle={{
                        backgroundColor: isDark ? "#0B112080" : "#F8F7FC80",
                        color: isDark ? "#F8FAFC" : "#171A2B",
                        placeholderColor: isDark ? "#94A3B8" : "#9CA3AF",
                        contentCSSText: `font-family: Manrope; font-size: 16px; padding: 12px; min-height: 120px;`,
                    }}
                    placeholder="Describe your experience and skills..."
                    initialHeight={150}
                    onChange={(html) =>
                        setField("bio", html)
                    }
                />
            </View>

            <View className='items-end justify-end'>

                <TouchableOpacity
                    onPress={handleSave}
                    className="mt-3 flex-row gap-1 items-center px-3 py-1 rounded-lg bg-primary"
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
    )
}

export default UpdateBio