
import React from "react";
import {
    ImageBackground,
    StyleSheet,
    View,
    ViewProps,
} from "react-native";

interface EnhancedGradientBackgroundProps extends ViewProps {
    children: React.ReactNode;
}

const EnhancedGradientBackground = ({
    children,
    style,
    ...props
}: EnhancedGradientBackgroundProps) => {

    const backgroundImage = require("@/assets/ui/background/dark_background.jpg");

    return (
        <View
            style={[styles.container, style]}
            {...props}
        >
            <ImageBackground
                source={backgroundImage}
                resizeMode="cover"
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});

export default EnhancedGradientBackground;