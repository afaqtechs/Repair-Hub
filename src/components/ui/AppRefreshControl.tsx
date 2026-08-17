import { useTheme } from "@/src/context/ThemeContext";
import React from "react";
import { RefreshControl, RefreshControlProps } from "react-native";

type Props = Omit<
    RefreshControlProps,
    "colors" | "tintColor" | "titleColor" | "progressBackgroundColor"
>;

const AppRefreshControl = ({
    ...props
}: Props) => {
    const { isDark } = useTheme();

    return (
        <RefreshControl
            {...props}
            // Spinner color always same
            colors={["#5B3DF5"]}
            tintColor="#5B3DF5"

            // Text color
            title="Pull to refresh"
            titleColor={
                isDark ? "#94A3B8" : "#6B7280"
            }

            // Android spinner background
            progressBackgroundColor={
                isDark ? "#1E1B2E" : "#FFFFFF"
            }
        />
    );
};

export default AppRefreshControl;