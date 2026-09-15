import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type AddLocationModalProps = {
    visible: boolean;
    loading?: boolean;
    onAddLocation: () => void;
    onClose?: () => void;
};

const AddLocationModal = ({
    visible,
    loading = false,
    onAddLocation,
    onClose,
}: AddLocationModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 items-center justify-center px-6">
                <View className="w-full bg-card rounded-2xl p-6">

                    {/* Icon */}
                    <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center self-center">
                        <Ionicons
                            name="location-outline"
                            size={32}
                            color="#5EAE32"
                        />
                    </View>

                    {/* Title */}
                    <Text className="text-text text-xl font-manrope-bold text-center mt-5">
                        Location Required
                    </Text>

                    {/* Description */}
                    <Text className="text-textSecondary text-sm text-center mt-3 leading-5">
                        Your current location is not registered.
                        Please allow location access to add your
                        location to your profile.
                    </Text>

                    {/* Add Location */}
                    <TouchableOpacity
                        onPress={onAddLocation}
                        disabled={loading}
                        activeOpacity={0.8}
                        className="mt-6 h-14 bg-button-primary rounded-xl items-center justify-center"
                    >
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />
                        ) : (
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="location"
                                    size={20}
                                    color="#FFFFFF"
                                />

                                <Text className="ml-2 text-white text-base font-manrope-semibold">
                                    Allow & Add Location
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Not Now */}
                    {onClose && (
                        <TouchableOpacity
                            onPress={onClose}
                            disabled={loading}
                            activeOpacity={0.7}
                            className="mt-3 h-12 items-center justify-center"
                        >
                            <Text className="text-textSecondary font-manrope-medium">
                                Not Now
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default AddLocationModal;