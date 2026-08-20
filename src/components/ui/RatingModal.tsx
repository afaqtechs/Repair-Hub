import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type RatingModalProps = {
    visible: boolean;
    technicianName: string;
    selectedRating: number;
    existingRating?: number | null;
    isSubmitting: boolean;
    onClose: () => void;
    onRatingChange: (rating: number) => void;
    onSubmit: () => void;
};
const RatingModal = ({
    visible,
    technicianName,
    selectedRating,
    existingRating,
    isSubmitting,
    onClose,
    onRatingChange,
    onSubmit,
}: RatingModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 items-center justify-center px-5">
                <View className="w-full bg-card rounded-2xl p-6">

                    {/* Header */}
                    <View className="flex-row items-center justify-between">
                        <Text className="text-xl font-manrope-bold text-text">
                            {existingRating ? "Update Your Rating" : "Rate Technician"}
                        </Text>

                        <TouchableOpacity
                            disabled={isSubmitting}
                            onPress={onClose}
                            className="w-9 h-9 rounded-full bg-bg items-center justify-center"
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Description */}
                    <Text className="text-gray-500 text-sm mt-3">
                        {existingRating ? (
                            <>
                                You previously rated{" "}
                                <Text className="font-manrope-semibold text-text">
                                    {technicianName}
                                </Text>
                                . You can update your rating below.
                            </>
                        ) : (
                            <>
                                How would you rate{" "}
                                <Text className="font-manrope-semibold text-text">
                                    {technicianName}
                                </Text>
                                ?
                            </>
                        )}
                    </Text>

                    {existingRating ? (
                        <View className="self-center mt-5 px-3 py-1.5 rounded-full bg-primary/10">
                            <Text className="text-primary text-xs font-manrope-semibold">
                                Already reviewed • {existingRating}/5
                            </Text>
                        </View>
                    ) : null}

                    {/* Stars */}
                    <View className="flex-row justify-center gap-3 mt-7">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <TouchableOpacity
                                key={rating}
                                disabled={isSubmitting}
                                activeOpacity={0.7}
                                onPress={() => onRatingChange(rating)}
                            >
                                <Ionicons
                                    name={
                                        selectedRating >= rating
                                            ? "star"
                                            : "star-outline"
                                    }
                                    size={38}
                                    color="#F59E0B"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Rating text */}
                    <Text className="text-center text-gray-500 mt-4">
                        {selectedRating === 0
                            ? "Tap a star to rate"
                            : `${selectedRating} out of 5`}
                    </Text>

                    {/* Submit */}
                    <TouchableOpacity
                        disabled={
                            selectedRating === 0 ||
                            isSubmitting
                        }
                        onPress={onSubmit}
                        className={`mt-7 py-3.5 rounded-xl items-center ${selectedRating === 0 || isSubmitting
                            ? "bg-primary/50"
                            : "bg-primary"
                            }`}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-white font-manrope-semibold">
                                {existingRating ? "Update Rating" : "Submit Rating"}
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

export default RatingModal;