import React from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ConfirmModalProps = {
    visible: boolean;
    title: string;
    message: string;

    confirmText?: string;
    cancelText?: string;

    onConfirm: () => void;
    onCancel: () => void;

    destructive?: boolean;
};

const ConfirmModal = ({
    visible,
    title,
    message,

    confirmText = "Confirm",
    cancelText = "Cancel",

    onConfirm,
    onCancel,

    destructive = false,

}: ConfirmModalProps) => {

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/50 items-center justify-center px-5">

                <View className="w-full rounded-2xl p-5 bg-card">

                    <Text className="text-xl font-bold text-text">
                        {title}
                    </Text>


                    <Text className="mt-3 text-base text-text-muted">
                        {message}
                    </Text>


                    <View className="flex-row justify-end gap-3 mt-6">

                        <TouchableOpacity
                            onPress={onCancel}
                            className="px-4 py-2 rounded-lg bg-gray-300"
                        >
                            <Text className="text-text font-medium">
                                {cancelText}
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={onConfirm}
                            className={`px-4 py-2 rounded-lg ${destructive
                                ? "bg-red-500"
                                : "bg-primary"
                                }`}
                        >
                            <Text className="text-white font-semibold">
                                {confirmText}
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>
        </Modal>
    );
};

export default ConfirmModal;