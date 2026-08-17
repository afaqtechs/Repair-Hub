// hooks/useSearch.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
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

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    recentSearches,
    isLoadingRecent,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
};
