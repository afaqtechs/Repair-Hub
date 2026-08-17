
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface SelectItem {
    label: string;
    value: string;
}

interface AppSelectModalProps {
    isLoading?: boolean;
    title: string;
    placeholder: string;
    data: SelectItem[];
    value: string;
    onChange: (item: SelectItem) => void;
    isDark: boolean;
    search?: boolean;
    onAdd?: (name: string) => Promise<SelectItem | void>;
    addLabel?: string;
}

const AppSelectModal = ({
    isLoading,
    title,
    placeholder,
    data,
    value,
    onChange,
    isDark,
    search = true,
    onAdd,
    addLabel = "Add New",
}: AppSelectModalProps) => {
    const [visible, setVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [adding, setAdding] = useState(false);

    const [addedItems, setAddedItems] = useState<SelectItem[]>([]);

    const allItems = useMemo(() => {
        const merged = [...data, ...addedItems];

        return merged.filter(
            (item, index, array) =>
                array.findIndex(
                    other => other.value === item.value
                ) === index
        );
    }, [data, addedItems]);

    const selectedItem = allItems.find(
        item => item.value === value
    );

    const filteredData = allItems.filter(item =>
        item.label
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const closeModal = () => {
        setVisible(false);
        setSearchText("");
    };

    const handleSelect = (item: SelectItem) => {
        onChange(item);
        closeModal();
    };

    const handleAdd = async () => {
        const name = searchText.trim();

        if (!name || !onAdd || adding) return;

        const existingItem = allItems.find(
            item =>
                item.label.toLowerCase() === name.toLowerCase()
        );

        if (existingItem) {
            onChange(existingItem);
            closeModal();
            return;
        }

        try {
            setAdding(true);

            const newItem = await onAdd(name);

            if (newItem) {
                setAddedItems(prev => [...prev, newItem]);

                onChange(newItem);

                closeModal();
            }
        } catch (error) {
            console.error(`Failed to add ${title}:`, error);
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            {/* SELECT INPUT */}
            <TouchableOpacity
                onPress={() => setVisible(true)}
                activeOpacity={0.8}
                className={`h-14 px-4 rounded-lg flex-row items-center justify-between border ${isDark
                        ? "bg-bg-dark/50 border-border-dark/50"
                        : "bg-bg/50 border-border/50"
                    }`}
            >
                <View className="flex-1 flex-row items-center">
                    <Text
                        className={`text-sm font-manrope ${selectedItem
                                ? isDark
                                    ? "text-text-dark"
                                    : "text-text"
                                : "text-gray-400"
                            }`}
                        numberOfLines={1}
                    >
                        {selectedItem
                            ? selectedItem.label
                            : placeholder}
                    </Text>
                </View>

                <Ionicons
                    name="chevron-down"
                    size={18}
                    color={isDark ? "#94A3B8" : "#64748B"}
                />
            </TouchableOpacity>

            {/* MODAL */}
            <Modal
                visible={visible}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={closeModal}
            >
                <KeyboardAvoidingView
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : "height"
                    }
                    className="flex-1"
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={closeModal}
                        className="flex-1 justify-end bg-black/40"
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            className={`max-h-[90%] min-h-[60%] rounded-t-xl px-5 pt-4 pb-8 ${isDark
                                    ? "bg-card-dark"
                                    : "bg-card"
                                }`}
                        >
                            {/* HANDLE */}
                            <View className="items-center mb-4">
                                <View className="w-12 h-1.5 rounded-full bg-gray-400" />
                            </View>

                            {/* HEADER */}
                            <View className="flex-row items-center justify-between mb-4">
                                <Text
                                    className={`text-lg font-semibold ${isDark
                                            ? "text-text-dark"
                                            : "text-text"
                                        }`}
                                >
                                    Select {title}
                                </Text>

                                <TouchableOpacity
                                    onPress={closeModal}
                                    activeOpacity={0.7}
                                    className="bg-bg dark:bg-bg-dark h-9 w-9 items-center justify-center rounded-full"
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color={
                                            isDark
                                                ? "#64748B"
                                                : "#94A3B8"
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* SEARCH */}
                            {search && (
                                <View
                                    className={`h-12 rounded-xl px-4 flex-row items-center mb-3 border ${isDark
                                            ? "bg-input-dark/30 border-border-dark"
                                            : "bg-input/30 border-border"
                                        }`}
                                >
                                    <Ionicons
                                        name="search-outline"
                                        size={18}
                                        color={
                                            isDark
                                                ? "#94A3B8"
                                                : "#64748B"
                                        }
                                    />

                                    <TextInput
                                        value={searchText}
                                        onChangeText={setSearchText}
                                        placeholder="Search..."
                                        placeholderTextColor="#94A3B8"
                                        className={`flex-1 ml-2 text-sm font-manrope ${isDark
                                                ? "text-text-dark"
                                                : "text-text"
                                            }`}
                                    />

                                    {searchText.length > 0 && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setSearchText("")
                                            }
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name="close-circle"
                                                size={18}
                                                color={
                                                    isDark
                                                        ? "#64748B"
                                                        : "#94A3B8"
                                                }
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {/* ADD NEW */}
                            {onAdd &&
                                searchText.trim().length > 0 && (
                                    <TouchableOpacity
                                        onPress={handleAdd}
                                        disabled={adding}
                                        activeOpacity={0.7}
                                        className={`flex-row justify-center items-center px-4 py-3 mb-2 rounded-xl ${isDark
                                                ? "bg-primary/20"
                                                : "bg-primary/10"
                                            }`}
                                    >
                                        {adding ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#2563EB"
                                            />
                                        ) : (
                                            <Ionicons
                                                name="add-circle-outline"
                                                size={20}
                                                color="#2563EB"
                                            />
                                        )}

                                        <Text className="ml-2 text-sm font-manrope-semibold text-primary">
                                            {adding
                                                ? "Adding..."
                                                : `${addLabel} ${title} "${searchText.trim()}"`}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                            {/* CONTENT */}
                            <View className="flex-1 min-h-0">
                                {isLoading ? (
                                    <View className="flex-1 items-center justify-center">
                                        <ActivityIndicator
                                            size="large"
                                            color="#2563EB"
                                        />
                                    </View>
                                ) : (
                                    <FlatList
                                        data={filteredData}
                                        keyExtractor={item =>
                                            item.value
                                        }
                                        showsVerticalScrollIndicator={
                                            false
                                        }
                                        keyboardShouldPersistTaps="handled"
                                        keyboardDismissMode="on-drag"
                                        contentContainerStyle={{
                                            paddingBottom: 10,
                                        }}
                                        renderItem={({ item }) => {
                                            const isSelected =
                                                item.value ===
                                                value;

                                            return (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        handleSelect(
                                                            item
                                                        )
                                                    }
                                                    className={`flex-row justify-between items-center py-4 border-b ${isDark
                                                            ? "border-border-dark/30"
                                                            : "border-border/30"
                                                        }`}
                                                >
                                                    <Text
                                                        className={`text-base font-manrope ${isSelected
                                                                ? "text-emerald-500"
                                                                : isDark
                                                                    ? "text-text-dark"
                                                                    : "text-text"
                                                            }`}
                                                    >
                                                        {
                                                            item.label
                                                        }
                                                    </Text>

                                                    {isSelected && (
                                                        <Ionicons
                                                            name="checkmark"
                                                            size={20}
                                                            color="#3B82F6"
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        }}
                                        ListEmptyComponent={
                                            <View className="items-center py-10">
                                                <Ionicons
                                                    name="search-outline"
                                                    size={48}
                                                    color={
                                                        isDark
                                                            ? "#374151"
                                                            : "#D1D5DB"
                                                    }
                                                />

                                                <Text
                                                    className={`mt-3 font-manrope-medium ${isDark
                                                            ? "text-text-dark/50"
                                                            : "text-text/50"
                                                        }`}
                                                >
                                                    No items found
                                                </Text>
                                            </View>
                                        }
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

export default AppSelectModal;
