import { Ionicons } from '@expo/vector-icons';
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
                    className="rounded-t-2xl bg-card px-5 pt-4"
                    style={{
                        paddingBottom: insets.bottom,
                    }}
                >
                    <Text className="mb-4 text-lg font-semibold text-text">
                        Sort By
                    </Text>

                    {sortOptions.map((item) => (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => {
                                setSortValue(item.value);
                                setSortModalVisible(false);
                            }}
                            className="flex-row items-center justify-between border-b border-border/30 py-4"
                        >
                            <Text className="text-base text-text">
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
