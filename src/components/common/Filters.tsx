
import {
    useCategories,
    useConditions,
    useFilterParts,
    useFilterServices,
    useFilterTechnicians,
    usePlatforms,
} from '@/src/hooks';
import { clearAllFilters, clearFilter, getActiveFilterCount } from '@/src/utils/filters';
import { FilterType, FilterValues, RangeOption } from '@/types/filters';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    visible: boolean;
    type: FilterType;
    filters: FilterValues;
    onClose: () => void;
    onApply: (filters: FilterValues) => void;
    onClear?: () => void;
};

const createRanges = (
    min: number,
    max: number,
    count = 5,
    unit = ''
): RangeOption[] => {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return [];
    }

    if (min === max) {
        return [
            {
                label: `${Math.round(min)}${unit}`,
                min,
                max: null,
            },
        ];
    }

    const step = (max - min) / count;

    return Array.from({ length: count }, (_, index) => {
        const rangeMin = min + step * index;
        const rangeMax = min + step * (index + 1);

        if (index === 0) {
            return {
                label: `< ${Math.round(rangeMax)}${unit}`,
                min: null,
                max: rangeMax,
            };
        }

        if (index === count - 1) {
            return {
                label: `≥ ${Math.round(rangeMin)}${unit}`,
                min: rangeMin,
                max: null,
            };
        }

        return {
            label: `${Math.round(rangeMin)}${unit} - ${Math.round(rangeMax)}${unit}`,
            min: rangeMin,
            max: rangeMax,
        };
    });
};

// Dropdown component with simple animation
const FilterDropdown = ({
    title,
    isOpen,
    onToggle,
    children,
    activeCount = 0,
    iconName,
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    activeCount?: number;
    iconName?: keyof typeof Ionicons.glyphMap;
}) => {
    return (
        <View className="mb-3 rounded-xl border border-border bg-card/50">
            <TouchableOpacity
                onPress={onToggle}
                className="flex-row items-center justify-between px-4 py-3.5"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center">
                    {iconName && (
                        <Ionicons
                            name={iconName}
                            size={20}
                            color="#6B7280"
                            style={{ marginRight: 12 }}
                        />
                    )}
                    <Text className="text-base font-semibold text-text">
                        {title}
                    </Text>
                    {activeCount > 0 && (
                        <View className="ml-2 rounded-full bg-primary px-2 py-0.5">
                            <Text className="text-xs font-bold text-white">
                                {activeCount}
                            </Text>
                        </View>
                    )}
                </View>
                <Ionicons
                    name="chevron-down"
                    size={22}
                    color="#6B7280"
                    style={{
                        transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                    }}
                />
            </TouchableOpacity>

            {isOpen && (
                <View className="border-t px-4 py-3 border-border">
                    <View className="flex-row flex-wrap gap-2">
                        {children}
                    </View>
                </View>
            )}
        </View>
    );
};

// Filter chip component with close icon
const FilterChip = ({
    label,
    selected,
    onPress,
    onClear,
}: {
    label: string;
    selected: boolean;
    onPress: () => void;
    onClear?: () => void;
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-row items-center rounded-full border px-3 py-2 ${selected
                ? 'border-primary bg-primary'
                : '  border-border bg-card/50'
                }`}
        >
            <Text
                className={
                    selected
                        ? 'text-white'
                        : 'text-text'
                }
            >
                {label}
            </Text>
            {selected && onClear && (
                <TouchableOpacity
                    onPress={onClear}
                    className="ml-1.5"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="close-circle" size={18} color="white" />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const Filters = ({
    visible,
    type,
    onClose,
    filters,
    onApply,
}: Props) => {
    const [draftFilters, setDraftFilters] =
        useState<FilterValues>(filters);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (visible) {
            setDraftFilters(filters);
        }
    }, [visible, filters]);

    // Dropdown states
    const [openDropdowns, setOpenDropdowns] = useState<{
        brand: boolean;
        model: boolean;
        price: boolean;
        category: boolean;
        platform: boolean;
        condition: boolean;
        city: boolean;
    }>({
        brand: false,
        model: false,
        price: false,
        category: false,
        platform: false,
        condition: false,
        city: false,
    });

    const { data: parts = [] } = useFilterParts();
    const { data: services = [] } = useFilterServices();
    const { data: technicians = [] } = useFilterTechnicians();

    const { data: categories = [] } = useCategories();
    const { data: platforms = [] } = usePlatforms();
    const { data: conditions = [] } = useConditions();

    /*
     * -------------------------
     * Parts
     * -------------------------
     */

    const brands = [
        ...new Set(
            parts
                .map((part) => part.brand)
                .filter((brand): brand is string => Boolean(brand))
        ),
    ];

    const models = [
        ...new Set(
            parts
                .map((part) => part.model)
                .filter((model): model is string => Boolean(model))
        ),
    ];

    /*
     * -------------------------
     * Part prices
     * -------------------------
     */

    const partPrices = parts
        .map((part) => Number(part.price))
        .filter(Number.isFinite);

    const partMinPrice = partPrices.length
        ? Math.min(...partPrices)
        : 0;

    const partMaxPrice = partPrices.length
        ? Math.max(...partPrices)
        : 0;

    const partPriceRanges = createRanges(
        partMinPrice,
        partMaxPrice,
        5,
        'Br.'
    );

    /*
     * -------------------------
     * Service prices
     * -------------------------
     */

    const servicePrices = services
        .map((service) => Number(service.price))
        .filter(Number.isFinite);

    const serviceMinPrice = servicePrices.length
        ? Math.min(...servicePrices)
        : 0;

    const serviceMaxPrice = servicePrices.length
        ? Math.max(...servicePrices)
        : 0;

    const servicePriceRanges = createRanges(
        serviceMinPrice,
        serviceMaxPrice,
        5,
        'Br.'
    );

    /*
     * -------------------------
     * Cities
     * -------------------------
     */

    const cities = [
        ...new Set(
            technicians
                .map((tech) => tech.city)
                .filter((city): city is string => Boolean(city))
        ),
    ];

    /*
     * -------------------------
     * Toggle dropdown
     * -------------------------
     */

    const toggleDropdown = (key: keyof typeof openDropdowns) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    /*
     * -------------------------
     * Selection helpers
     * -------------------------
     */

    const selectBrand = (brand: string) => {
        setDraftFilters((prev) => ({
            ...prev,
            brand: prev.brand === brand ? null : brand,
        }));
    };

    const selectModel = (model: string) => {
        setDraftFilters((prev) => ({
            ...prev,
            model: prev.model === model ? null : model,
        }));
    };

    const selectPrice = (range: RangeOption) => {
        setDraftFilters((prev) => {
            const alreadySelected =
                prev.priceMin === range.min &&
                prev.priceMax === range.max;

            return {
                ...prev,
                priceMin: alreadySelected ? null : range.min,
                priceMax: alreadySelected ? null : range.max,
            };
        });
    };

    const selectCategory = (id: string) => {
        setDraftFilters((prev) => ({
            ...prev,
            categoryId:
                prev.categoryId === id ? null : id,
        }));
    };

    const selectPlatform = (id: string) => {
        setDraftFilters((prev) => ({
            ...prev,
            platformId:
                prev.platformId === id ? null : id,
        }));
    };

    const selectCondition = (id: string) => {
        setDraftFilters((prev) => ({
            ...prev,
            conditionId:
                prev.conditionId === id ? null : id,
        }));
    };

    const selectCity = (city: string) => {
        setDraftFilters((prev) => ({
            ...prev,
            city:
                prev.city === city ? null : city,
        }));
    };

    const clearFilters = () => {
        setDraftFilters(clearAllFilters());
    };

    const applyFilters = () => {
        onApply(draftFilters);
        onClose();
    };

    // Count active filters
    const activeFilterCount = getActiveFilterCount(
        draftFilters,
        type
    );

    const handleClearFilter = (key: keyof FilterValues) => {
        setDraftFilters((prev) => clearFilter(prev, key));
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="max-h-[92%] rounded-t-3xl bg-bg">
                    {/* Header */}
                    <View className="flex-row items-center justify-between border-b px-5 py-4 border-border">
                        <View className="flex-row items-center">
                            <Text className="text-xl font-bold text-text">
                                Filters
                            </Text>
                            {activeFilterCount > 0 && (
                                <View className="ml-2 rounded-full bg-primary px-2 py-0.5">
                                    <Text className="text-xs font-bold text-white">
                                        {activeFilterCount}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            className="h-10 w-10 items-center justify-center rounded-full bg-card"
                        >
                            <Ionicons name="close" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            padding: 16,
                            paddingBottom: 120,
                        }}
                    >
                        {/* ========================= */}
                        {/* PART-SPECIFIC FILTERS */}
                        {/* ========================= */}

                        {type === 'parts' && (
                            <>
                                {/* Brand */}
                                <FilterDropdown
                                    title="Brand"
                                    isOpen={openDropdowns.brand}
                                    onToggle={() => toggleDropdown('brand')}
                                    activeCount={draftFilters.brand ? 1 : 0}
                                    iconName="pricetag-outline"
                                >
                                    {brands.map((brand) => (
                                        <FilterChip
                                            key={brand}
                                            label={brand}
                                            selected={draftFilters.brand === brand}
                                            onPress={() => selectBrand(brand)}
                                            onClear={() => handleClearFilter("brand")}
                                        />
                                    ))}
                                </FilterDropdown>

                                {/* Model */}
                                <FilterDropdown
                                    title="Model"
                                    isOpen={openDropdowns.model}
                                    onToggle={() => toggleDropdown('model')}
                                    activeCount={draftFilters.model ? 1 : 0}
                                    iconName="car-outline"
                                >
                                    {models.map((model) => (
                                        <FilterChip
                                            key={model}
                                            label={model}
                                            selected={draftFilters.model === model}
                                            onPress={() => selectModel(model)}
                                            onClear={() => handleClearFilter("model")}
                                        />
                                    ))}
                                </FilterDropdown>
                            </>
                        )}

                        {/* ========================= */}
                        {/* PRICE */}
                        {/* ========================= */}

                        {type !== "requests" && (
                            <FilterDropdown
                                title={type === 'parts' ? 'Part Price' : 'Service Price'}
                                isOpen={openDropdowns.price}
                                onToggle={() => toggleDropdown('price')}
                                activeCount={draftFilters.priceMin !== null ? 1 : 0}
                                iconName="cash-outline"
                            >
                                {(type === 'parts'
                                    ? partPriceRanges
                                    : servicePriceRanges
                                ).map((range) => {
                                    const selected =
                                        draftFilters.priceMin === range.min &&
                                        draftFilters.priceMax === range.max;

                                    return (
                                        <FilterChip
                                            key={range.label}
                                            label={range.label}
                                            selected={selected}
                                            onPress={() => selectPrice(range)}
                                            onClear={() => handleClearFilter("priceMax")}
                                        />
                                    );
                                })}
                            </FilterDropdown>

                        )}
                        {/* ========================= */}
                        {/* CATEGORY */}
                        {/* ========================= */}

                        <FilterDropdown
                            title="Category"
                            isOpen={openDropdowns.category}
                            onToggle={() => toggleDropdown('category')}
                            activeCount={draftFilters.categoryId ? 1 : 0}
                            iconName="grid-outline"
                        >
                            {categories.map((category) => (
                                <FilterChip
                                    key={category.id}
                                    label={category.name}
                                    selected={draftFilters.categoryId === category.id}
                                    onPress={() => selectCategory(category.id)}
                                    onClear={() => handleClearFilter("categoryId")}
                                />
                            ))}
                        </FilterDropdown>

                        {/* ========================= */}
                        {/* PLATFORM */}
                        {/* ========================= */}

                        <FilterDropdown
                            title="Platform"
                            isOpen={openDropdowns.platform}
                            onToggle={() => toggleDropdown('platform')}
                            activeCount={draftFilters.platformId ? 1 : 0}
                            iconName="phone-portrait-outline"
                        >
                            {platforms.map((platform) => (
                                <FilterChip
                                    key={platform.id}
                                    label={platform.name}
                                    selected={draftFilters.platformId === platform.id}
                                    onPress={() => selectPlatform(platform.id)}
                                    onClear={() => handleClearFilter("platformId")}
                                />
                            ))}
                        </FilterDropdown>

                        {/* ========================= */}
                        {/* CONDITION */}
                        {/* ========================= */}

                        {type === 'parts' && (
                            <FilterDropdown
                                title="Condition"
                                isOpen={openDropdowns.condition}
                                onToggle={() => toggleDropdown('condition')}
                                activeCount={draftFilters.conditionId ? 1 : 0}
                                iconName="flag-outline"
                            >
                                {conditions.map((condition) => (
                                    <FilterChip
                                        key={condition.id}
                                        label={condition.name}
                                        selected={draftFilters.conditionId === condition.id}
                                        onPress={() => selectCondition(condition.id)}
                                        onClear={() => handleClearFilter("conditionId")}
                                    />
                                ))}
                            </FilterDropdown>
                        )}

                        {/* ========================= */}
                        {/* CITY */}
                        {/* ========================= */}

                        <FilterDropdown
                            title="City"
                            isOpen={openDropdowns.city}
                            onToggle={() => toggleDropdown('city')}
                            activeCount={draftFilters.city ? 1 : 0}
                            iconName="location-outline"
                        >
                            {cities.map((city) => (
                                <FilterChip
                                    key={city}
                                    label={city}
                                    selected={draftFilters.city === city}
                                    onPress={() => selectCity(city)}
                                    onClear={() => handleClearFilter("city")}
                                />
                            ))}
                        </FilterDropdown>
                    </ScrollView>

                    {/* Bottom actions */}
                    <View
                        style={{
                            paddingBottom: Math.max(insets.bottom, 16),
                        }}
                        className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t px-4 py-4 border-border bg-bg">
                        <TouchableOpacity
                            onPress={() => clearFilters()}
                            className="flex-1 items-center rounded-xl bg-danger border border-danger py-3.5"
                            activeOpacity={0.7}
                        >
                            <Text className="font-semibold text-white">
                                Clear All
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={applyFilters}
                            className="flex-1 items-center rounded-xl bg-primary py-3.5"
                            activeOpacity={0.7}
                        >
                            <Text className="font-semibold text-white">
                                Apply Filters
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Filters;