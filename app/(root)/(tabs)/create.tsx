import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Create = () => {
    const handleCreate = (type: 'part' | 'service' | 'request') => {
        console.log(type);
    };

    return (
        <SafeAreaView
            edges={['top', 'left', 'right']}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            <View className="px-5 pt-3">
                <Text className="text-text dark:text-text-dark text-2xl font-bold">
                    Create
                </Text>

                <Text className="text-text-secondary dark:text-text-darkMuted mt-2 text-base">
                    Choose what you&apos;d like to create and share with the community.
                </Text>

                <View className="mt-8 gap-4">
                    <TouchableOpacity
                        onPress={() => handleCreate('part')}
                        className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-xl p-5"
                    >
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                                <Ionicons
                                    name="cube-outline"
                                    size={24}
                                    color="#3B82F6"
                                />
                            </View>

                            <View className="ml-4 flex-1">
                                <Text className="text-text dark:text-text-dark text-lg font-semibold">
                                    Spare Part
                                </Text>
                                <Text className="text-text-secondary dark:text-text-darkMuted mt-1">
                                    List a spare part for sale and reach potential buyers.
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#94A3B8"
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleCreate('service')}
                        className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-xl p-5"
                    >
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                                <Ionicons
                                    name="construct-outline"
                                    size={24}
                                    color="#3B82F6"
                                />
                            </View>

                            <View className="ml-4 flex-1">
                                <Text className="text-text dark:text-text-dark text-lg font-semibold">
                                    Service
                                </Text>
                                <Text className="text-text-secondary dark:text-text-darkMuted mt-1">
                                    Offer repair, maintenance, towing, or other services.
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#94A3B8"
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleCreate('request')}
                        className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-xl p-5"
                    >
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                                <Ionicons
                                    name="help-circle-outline"
                                    size={24}
                                    color="#3B82F6"
                                />
                            </View>

                            <View className="ml-4 flex-1">
                                <Text className="text-text dark:text-text-dark text-lg font-semibold">
                                    Request
                                </Text>
                                <Text className="text-text-secondary dark:text-text-darkMuted mt-1">
                                    Request a part or service from nearby sellers and providers.
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#94A3B8"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Create;