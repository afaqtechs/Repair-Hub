// hooks/useSearch.ts
import { Part } from '@/types/parts';
import { Request } from '@/types/request';
import { Service } from '@/types/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;

type SearchType = 'parts' | 'services' | 'requests';

type UseSearchProps =
  | { type: 'parts'; data?: Part[] }
  | { type: 'services'; data?: Service[] }
  | { type: 'requests'; data?: Request[] };

const getSearchableFields = (item: any, type: SearchType): string[] => {
  const commonFields = [
    item.title,
    item.description,
    item.platform?.name,
    item.category?.name,
  ].filter(Boolean);

  if (type === 'parts') {
    commonFields.push(item.brand, item.model);
  }

  return commonFields.filter(Boolean);
};

export const useSearch = ({ data = [], type }: UseSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setRecentSearches(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      } finally {
        setIsLoadingRecent(false);
      }
    };

    loadRecentSearches();
  }, []);

  const saveRecentSearches = useCallback(async (searches: string[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  }, []);

  const addRecentSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item !== trimmed);
        const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        saveRecentSearches(updated);
        return updated;
      });
    },
    [saveRecentSearches]
  );

  const removeRecentSearch = useCallback(
    (query: string) => {
      setRecentSearches((prev) => {
        const updated = prev.filter((item) => item !== query);
        saveRecentSearches(updated);
        return updated;
      });
    },
    [saveRecentSearches]
  );

  const clearRecentSearches = useCallback(async () => {
    setRecentSearches([]);
    await saveRecentSearches([]);
  }, [saveRecentSearches]);

  const results = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return data.filter((item) => {
      const searchableText = getSearchableFields(item, type)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [data, searchQuery, type]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
      addRecentSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, addRecentSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    results,
    resultCount: results.length,
    isSearching,
    clearSearch,
    recentSearches,
    isLoadingRecent,
    removeRecentSearch,
    clearRecentSearches,
  };
};