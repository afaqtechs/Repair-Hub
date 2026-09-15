
import React from "react";
import { RefreshControl, RefreshControlProps } from "react-native";

type Props = Omit<
    RefreshControlProps,
    "colors" | "tintColor" | "titleColor" | "progressBackgroundColor"
>;

const AppRefreshControl = ({
    ...props
}: Props) => {

    return (
        <RefreshControl
            {...props}
            // Spinner color always same
            colors={["#5EAE32"]}
            tintColor="#5EAE32"

            // Text color
            title="Pull to refresh"
            titleColor="#94A3B8"

            // Android spinner background
            progressBackgroundColor="#fff"
        />
    );
};

export default AppRefreshControl;