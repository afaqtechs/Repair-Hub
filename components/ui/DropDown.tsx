import React from 'react';
import { DimensionValue } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export type DropdownItem = {
    label: string;
    value: string;
};

type Props = {
    open: boolean;
    items: DropdownItem[];
    value: string | string[] | null;

    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setValue: React.Dispatch<React.SetStateAction<any>>;
    setItems: React.Dispatch<React.SetStateAction<DropdownItem[]>>;

    isDark?: boolean;
    placeholder?: string;

    width?: DimensionValue;
    minHeight?: number;

    multiple?: boolean;
    searchable?: boolean;
    disabled?: boolean;
    zIndex?: number;

    showArrowIcon?: boolean;
    showTickIcon?: boolean;
};

const Dropdown = ({
    open,
    items,
    value,

    setOpen,
    setValue,
    setItems,

    isDark = false,
    placeholder = 'Select',

    width = 120,
    minHeight = 48,

    multiple = false,
    searchable = false,
    disabled = false,

    zIndex = 1000,
    showArrowIcon = true,
    showTickIcon = true,
}: Props) => {

    // Theme colors
    const theme = {
        background: isDark ? '#1E293B' : '#FFFFFF',
        border: isDark ? '#334155' : '#E5E7EB',
        text: isDark ? '#F8FAFC' : '#0F172A',
        placeholder: isDark ? '#94A3B8' : '#6B7280',
        selectedBackground: isDark ? '#334155' : '#EFF6FF',
        selectedText: isDark ? '#60A5FA' : '#2563EB',
        tintColor: isDark ? '#60A5FA' : '#2563EB',
    };

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setItems={setItems}
            setValue={setValue}
            multiple={multiple}
            searchable={searchable}
            disabled={disabled}
            listMode="SCROLLVIEW"
            placeholder={placeholder}
            showArrowIcon={showArrowIcon}
            showTickIcon={showTickIcon}

            // Container styles
            containerStyle={{
                width,
                zIndex,
            }}

            // Main dropdown styles
            style={{
                minHeight,
                borderRadius: 12,
                backgroundColor: theme.background,
                borderColor: theme.border,
                borderWidth: 1,
            }}

            // Dropdown list styles
            dropDownContainerStyle={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                borderRadius: 12,
                borderWidth: 1,
            }}

            // Text styles
            textStyle={{
                color: theme.text,
                fontSize: 14,
            }}

            // Placeholder styles
            placeholderStyle={{
                color: theme.placeholder,
            }}

            // Selected item styles - FIX for dark mode
            selectedItemContainerStyle={{
                backgroundColor: theme.selectedBackground,
            }}
            selectedItemLabelStyle={{
                color: theme.selectedText,
                fontWeight: '600',
            }}

            tickIconStyle={{
                tintColor: theme.tintColor,
            }}

            // Arrow icon color
            arrowIconStyle={{
                tintColor: theme.tintColor,
            }}

            // Search input styles (if searchable)
            searchContainerStyle={{
                borderBottomColor: theme.border,
            }}
            searchTextInputStyle={{
                color: theme.text,
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            }}

            // Badge styles for multiple selection
            badgeStyle={{
                backgroundColor: theme.tintColor,
            }}
            badgeTextStyle={{
                color: '#FFFFFF',
            }}
        />
    );
};

export default Dropdown;