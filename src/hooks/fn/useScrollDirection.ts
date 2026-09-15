import { useCallback, useRef, useState } from "react";
import {
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from "react-native";

type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
    threshold?: number;
}

export const useScrollDirection = ({
    threshold = 8,
}: UseScrollDirectionOptions = {}) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const lastScrollY = useRef(0);

    const [scrollDirection, setScrollDirection] =
        useState<ScrollDirection>(null);

    const [isScrolled, setIsScrolled] = useState(false);

    const onScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const currentY = Math.max(
                0,
                event.nativeEvent.contentOffset.y
            );

            // IMPORTANT:
            // Update Animated.Value so interpolate() works
            scrollY.setValue(currentY);

            const difference = currentY - lastScrollY.current;

            if (currentY <= 0) {
                lastScrollY.current = 0;

                setIsScrolled(false);
                setScrollDirection(null);

                return;
            }

            setIsScrolled(true);

            if (Math.abs(difference) >= threshold) {
                if (difference > 0) {
                    setScrollDirection("down");
                } else {
                    setScrollDirection("up");
                }

                lastScrollY.current = currentY;
            }
        },
        [scrollY, threshold]
    );

    return {
        scrollY,
        scrollDirection,
        isScrolled,
        isScrollingDown: scrollDirection === "down",
        isScrollingUp: scrollDirection === "up",
        onScroll,
    };
};