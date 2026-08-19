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
    search?: boolean;
}

const AppDropdown = ({
    data,
    value,
    placeholder,
    onChange,
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
                backgroundColor: "#1E293B",
                borderWidth: 1,
                borderColor: "#334155",
            }}

            placeholderStyle={{
                color: "#94A3B8",
                fontSize: 14,
                fontFamily: "Manrope",
            }}

            selectedTextStyle={{
                color: "#F8FAFC",
                fontSize: 14,
                fontFamily: "Manrope",
            }}

            // Dropdown list container
            containerStyle={{
                marginTop: 5,
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: "#1E293B",
                borderWidth: 1,
                borderColor: "#334155",
                elevation: 5,
                shadowOpacity: 0.15,
            }}

            // Selected item background
            activeColor="#334155"

            // Selected item text
            // activeTextColor={
            //     isDark
            //         ? "#34D399"
            //         : "#059669"
            // }

            itemTextStyle={{
                color: "#F8FAFC",
                fontFamily: "Manrope",
                fontSize: 14,
            }}

            renderRightIcon={() => (
                <Ionicons
                    name="chevron-down"
                    size={18}
                    color="#94A3B8"
                />
            )}
        />
    );
};

export default AppDropdown;