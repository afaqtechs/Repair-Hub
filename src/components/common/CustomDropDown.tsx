import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

type MenuItem = {
    label: string;
    value: string;
    icon: string;
    destructive?: boolean;
};

type SimpleDropdownMenuProps = {
    items: MenuItem[];
    onSelect: (value: string) => void;
    triggerIcon?: string;
    triggerSize?: number;
};

const SimpleDropdownMenu = ({
    items,
    onSelect,
    triggerIcon = 'ellipsis-vertical',
    triggerSize = 18,
}: SimpleDropdownMenuProps) => {
    const [visible, setVisible] = useState(false);
    const [pressedItem, setPressedItem] = useState<string | null>(null);
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
        width: 0,
        above: false, // Track if menu should appear above
    });

    const triggerRef = useRef<any>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 0.95,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, fadeAnim, scaleAnim]);

    const showMenu = () => {
        triggerRef.current?.measure(
            (
                fx: number,
                fy: number,
                width: number,
                height: number,
                px: number,
                py: number
            ) => {
                const screenWidth = Dimensions.get('window').width;
                const screenHeight = Dimensions.get('window').height;
                const menuWidth = 200;
                const menuHeight = items.length * 52 + 8; // Approximate height: 52px per item + padding

                // Calculate horizontal position
                const x = Math.min(
                    px - menuWidth + width,
                    screenWidth - 10
                );

                // Calculate vertical position - check if there's enough space below
                const spaceBelow = screenHeight - (py + height);
                const spaceAbove = py;
                const shouldShowAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;

                setPosition({
                    x: Math.max(x, 10),
                    y: shouldShowAbove 
                        ? py - menuHeight - 24 
                        : py + height - 24,
                    width: menuWidth,
                    above: shouldShowAbove,
                });

                setVisible(true);
            }
        );
    };

    const hideMenu = () => {
        setPressedItem(null);
        setVisible(false);
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        hideMenu();
    };

    const backgroundColor = "#172033";
    const borderColor = '#374151';
    const textColor = "#E5E7EB";
    const hoverColor = "#374151";

    return (
        <>
            {/* Trigger */}
            <TouchableOpacity
                ref={triggerRef}
                onPress={showMenu}
                activeOpacity={0.7}
                className="w-8 h-8 items-center justify-center rounded-full"
                style={{
                    backgroundColor: "#0B1120"
                }}
            >
                <Ionicons
                    name={triggerIcon as any}
                    size={triggerSize}
                    color="#FFFFFF"
                />
            </TouchableOpacity>

            {/* Menu */}
            <Modal
                transparent
                visible={visible}
                onRequestClose={hideMenu}
                animationType="none"
            >
                <TouchableWithoutFeedback onPress={hideMenu}>
                    <View className="flex-1">
                        <Animated.View
                            style={[
                                styles.menuContainer,
                                {
                                    position: 'absolute',
                                    top: position.y,
                                    left: position.x,
                                    width: position.width,
                                    backgroundColor,
                                    borderColor,
                                    opacity: fadeAnim,
                                    transform: [
                                        {
                                            scale: scaleAnim,
                                        },
                                    ],
                                    // Add transform origin based on position
                                    transformOrigin: position.above
                                        ? 'bottom' // Origin at bottom when showing above
                                        : 'top', // Origin at top when showing below
                                },
                            ]}
                        >
                            <View className="py-1">
                                {items.map((item, index) => {
                                    const isPressed =
                                        pressedItem === item.value;

                                    return (
                                        <TouchableOpacity
                                            key={item.value}
                                            onPress={() =>
                                                handleSelect(item.value)
                                            }
                                            onPressIn={() =>
                                                setPressedItem(item.value)
                                            }
                                            onPressOut={() =>
                                                setPressedItem(null)
                                            }
                                            activeOpacity={1}
                                            className="flex-row items-center px-4 py-3"
                                            style={[
                                                {
                                                    backgroundColor:
                                                        isPressed
                                                            ? hoverColor
                                                            : 'transparent',
                                                },
                                                index === 0 &&
                                                styles.firstItem,
                                                index ===
                                                items.length - 1 &&
                                                styles.lastItem,
                                            ]}
                                        >
                                            <Ionicons
                                                name={item.icon as any}
                                                size={19}
                                                color={
                                                    item.destructive
                                                        ? '#EF4444'
                                                        : textColor
                                                }
                                            />

                                            <Text
                                                className="ml-3 text-sm font-manrope-medium"
                                                style={{
                                                    color: item.destructive
                                                        ? '#EF4444'
                                                        : textColor,
                                                }}
                                            >
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',

        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.2,
                shadowRadius: 12,
            },
        }),
    },

    firstItem: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },

    lastItem: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
});

export default SimpleDropdownMenu;