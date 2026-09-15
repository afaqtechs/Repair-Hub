
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Announcement } from "@/types/announcement";
import { formatTime } from "@/src/utils/formatTime";

interface AnnouncementCardProps {
    announcement: Announcement;
    removing?: boolean;
}

const AnnouncementCard = memo(
    ({ announcement, removing }: AnnouncementCardProps) => {
        const [isModalVisible, setIsModalVisible] = useState(false);

        const handleOpen = useCallback(() => {
            setIsModalVisible(true);
        }, []);

        const handleClose = useCallback(() => {
            setIsModalVisible(false);
        }, []);

        return (
            <>
                {/* ───────────────────────────────────────────── */}
                {/* Announcement Card */}
                {/* ───────────────────────────────────────────── */}

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleOpen}
                    className="flex-row items-center px-4 py-3"
                >
                    {/* Announcement Icon */}
                    <View className="relative mr-3">
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
                            <Ionicons
                                name="megaphone-outline"
                                size={24}
                                color="#FFFFFF"
                            />
                        </View>
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                        {/* Header */}
                        <View className="flex-row items-center justify-between">
                            <Text
                                numberOfLines={1}
                                className="mr-2 flex-1 font-manrope-semibold text-[15px] text-text"
                            >
                                {announcement.subject}
                            </Text>

                            {announcement.created_at && (
                                <Text className="font-manrope text-xs text-gray-500">
                                    {formatTime(announcement.created_at)}
                                </Text>
                            )}
                        </View>

                        <View className="mt-1 flex-row items-center">
                            <Text
                                numberOfLines={1}
                                className="flex-1 font-manrope text-sm text-gray-500"
                            >
                                {announcement.message}
                            </Text>
                        </View>
                        <View className="mt-1 flex-row items-center">
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={12}
                                color="#10B981"
                            />
                            <Text className="ml-1 font-manrope text-[10px] text-green-600">
                                Admin
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* ───────────────────────────────────────────── */}
                {/* Announcement Detail Modal */}
                {/* ───────────────────────────────────────────── */}

                <Modal
                    visible={isModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={handleClose}
                >
                    {/* Backdrop */}
                    <Pressable
                        className="flex-1 justify-center bg-black/60 px-5"
                        onPress={handleClose}
                    >
                        {/* Modal Content */}
                        <Pressable
                            onPress={(event) => event.stopPropagation()}
                            className="rounded-3xl bg-white p-6"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.25,
                                shadowRadius: 20,
                                elevation: 10,
                            }}
                        >
                            {/* Modal Header */}
                            <View className="flex-row items-start">
                                <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-primary">
                                    <Ionicons name="megaphone-outline" size={21} color="#FFFFFF" />
                                </View>

                                <View className="flex-1">
                                    <Text className="font-manrope-semibold text-xl text-text">
                                        {announcement.subject}
                                    </Text>

                                    <View className="mt-1 flex-row items-center">
                                        {announcement.created_at && (
                                            <Text className="font-manrope text-xs text-gray-400">
                                                {formatTime(
                                                    announcement.created_at
                                                )}
                                            </Text>
                                        )}
                                        <View className="mx-2 h-1 w-1 rounded-full bg-gray-300" />
                                        <View className="flex-row items-center">
                                            <Ionicons
                                                name="shield-checkmark-outline"
                                                size={12}
                                                color="#10B981"
                                            />
                                            <Text className="ml-1 font-manrope text-xs text-green-600">
                                                Admin
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Close */}
                                <TouchableOpacity
                                    onPress={handleClose}
                                    hitSlop={10}
                                    className="ml-2 rounded-full bg-gray-50 p-1.5"
                                >
                                    <Ionicons
                                        name="close"
                                        size={20}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Divider */}
                            <View className="my-5 h-px bg-gray-100" />

                            {/* Full Message */}
                            <View className="">
                                <Text className="font-manrope text-[15px] leading-6 text-gray-800">
                                    {announcement.message}
                                </Text>
                            </View>

                            {/* Footer actions */}
                            <View className="mt-6 flex-row justify-end">
                                <TouchableOpacity
                                    onPress={handleClose}
                                    className="rounded-full bg-primary px-6 py-2.5"
                                >
                                    <Text className="font-manrope-semibold text-sm text-white">
                                        Got it
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            </>
        );
    }
);

AnnouncementCard.displayName = "AnnouncementCard";

export default AnnouncementCard;