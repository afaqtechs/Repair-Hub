
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SortOption<T extends string> = {
    value: T;
    label: string;
};

type SortModalProps<T extends string> = {
    sortModalVisible: boolean;
    setSortModalVisible: (visible: boolean) => void;
    sortOptions: SortOption<T>[];
    sortValue: T;
    setSortValue: React.Dispatch<React.SetStateAction<T>>;
};

const SortModal = <T extends string>({
    sortModalVisible,
    setSortModalVisible,
    sortOptions,
    sortValue,
    setSortValue,
}: SortModalProps<T>) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={sortModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setSortModalVisible(false)}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => setSortModalVisible(false)}
                className="flex-1 justify-end bg-black/40"
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { }}
                    className="bg-card-dark rounded-t-xl px-5 pt-4 pb-8"
                    style={{
                        paddingBottom: Math.max(insets.bottom, 16),
                    }}
                >
                    <Text className="text-lg font-semibold text-text-dark mb-4">
                        Sort By
                    </Text>

                    {sortOptions.map((item) => (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => {
                                setSortValue(item.value);
                                setSortModalVisible(false);
                            }}
                            className="flex-row justify-between items-center py-4 border-b border-border-dark/30"
                        >
                            <Text className="text-base text-text-dark">
                                {item.label}
                            </Text>

                            {sortValue === item.value && (
                                <Ionicons
                                    name="checkmark"
                                    size={20}
                                    color="#3B82F6"
                                />
                            )}
                        </TouchableOpacity>
                    ))}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default SortModal;
