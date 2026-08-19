
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

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
    search = true,
    onAdd,
    addLabel = "Add New",
}: AppSelectModalProps) => {
    const [visible, setVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [adding, setAdding] = useState(false);
    const insets = useSafeAreaInsets();

    const [addedItems, setAddedItems] = useState<SelectItem[]>([]);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync("#0B1120");
        NavigationBar.setButtonStyleAsync("light");
    }, []);

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
                className={`h-14 px-4 rounded-lg flex-row items-center justify-between border bg-bg-dark/50 border-border-dark/50`}
            >
                <View className="flex-1 flex-row items-center">
                    <Text
                        className={`text-sm font-manrope ${selectedItem
                            ? "text-text-dark"
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
                    color="#94A3B8"
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
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={closeModal}
                    className="flex-1 justify-end bg-black/40"
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { }}
                        className={`max-h-[90%] min-h-[60%] rounded-t-xl px-5 pt-4 pb-8 bg-card-dark`}
                        style={{
                            paddingBottom: Math.max(insets.bottom, 16),
                        }}
                    >
                        {/* HANDLE */}
                        <View className="items-center mb-4">
                            <View className="w-12 h-1.5 rounded-full bg-gray-400" />
                        </View>

                        {/* HEADER */}
                        <View className="flex-row items-center justify-between mb-4">
                            <Text
                                className={`text-lg font-semibold text-text-dark`}
                            >
                                Select {title}
                            </Text>

                            <TouchableOpacity
                                onPress={closeModal}
                                activeOpacity={0.7}
                                className="bg-bg-dark h-9 w-9 items-center justify-center rounded-full"
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* SEARCH */}
                        {search && (
                            <View
                                className={`h-12 rounded-xl px-4 flex-row items-center mb-3 border bg-input-dark/30 border-border-dark`}
                            >
                                <Ionicons
                                    name="search-outline"
                                    size={18}
                                    color="#94A3B8"
                                />

                                <TextInput
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    placeholder="Search..."
                                    placeholderTextColor="#94A3B8"
                                    className={`flex-1 ml-2 text-sm font-manrope text-text-dark`}
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
                                            color="#64748B"
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
                                    className={`flex-row justify-center items-center px-4 py-3 mb-2 rounded-xl bg-primary/20`}
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
                                                className={`flex-row justify-between items-center py-4 border-b border-border-dark/30`}
                                            >
                                                <Text
                                                    className={`text-base font-manrope ${isSelected
                                                        ? "text-emerald-500"
                                                        : "text-text-dark"
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
                                                color="#374151"
                                            />

                                            <Text
                                                className={`mt-3 font-manrope-medium text-text-dark/50`}
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
            </Modal>
        </>
    );
};

export default AppSelectModal;
