import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";

interface DropdownItem {
    label: string;
    value: string;
}

interface AppDropdownProps {
    data: DropdownItem[];
    value: string | null;
    placeholder: string;
    onChange: (item: DropdownItem) => void;
    isDark: boolean;
    search?: boolean;
}

const AppDropdown = ({
    data,
    value,
    placeholder,
    onChange,
    isDark,
    search = false,
}: AppDropdownProps) => {

    return (
        <Dropdown
            data={data}
            labelField="label"
            valueField="value"

            value={value}
            placeholder={placeholder}
            onChange={onChange}

            search={search}
            searchPlaceholder="Search..."

            style={{
                height: 56,
                borderRadius: 16,
                paddingHorizontal: 16,
                backgroundColor: isDark
                    ? "#1E293B"
                    : "#FFFFFF",
                borderWidth: 1,
                borderColor: isDark
                    ? "#334155"
                    : "#E2E8F0",
            }}

            placeholderStyle={{
                color: isDark
                    ? "#94A3B8"
                    : "#9CA3AF",
                fontSize: 14,
                fontFamily: "Manrope",
            }}

            selectedTextStyle={{
                color: isDark
                    ? "#F8FAFC"
                    : "#171A2B",
                fontSize: 14,
                fontFamily: "Manrope",
            }}

            // Dropdown list container
            containerStyle={{
                marginTop: 5,
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: isDark
                    ? "#1E293B"
                    : "#FFFFFF",
                borderWidth: 1,
                borderColor: isDark
                    ? "#334155"
                    : "#E2E8F0",
                elevation: 5,
                shadowOpacity: 0.15,
            }}

            // Selected item background
            activeColor={
                isDark
                    ? "#334155"
                    : "#ECFDF5"
            }

            // Selected item text
            // activeTextColor={
            //     isDark
            //         ? "#34D399"
            //         : "#059669"
            // }

            itemTextStyle={{
                color: isDark
                    ? "#F8FAFC"
                    : "#171A2B",
                fontFamily: "Manrope",
                fontSize: 14,
            }}

            renderRightIcon={() => (
                <Ionicons
                    name="chevron-down"
                    size={18}
                    color={
                        isDark
                            ? "#94A3B8"
                            : "#64748B"
                    }
                />
            )}
        />
    );
};

export default AppDropdown;