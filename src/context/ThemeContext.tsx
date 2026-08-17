import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const THEME_STORAGE_KEY = "@app_theme";

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (
          savedTheme === "light" ||
          savedTheme === "dark" ||
          savedTheme === "system"
        ) {
          setThemeModeState(savedTheme);
          setColorScheme(savedTheme);
        } else {
          setThemeModeState("system");
          setColorScheme("system");
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
        setThemeModeState("system");
        setColorScheme("system");
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [setColorScheme]);

  const isDark = colorScheme === "dark";

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      setColorScheme(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const toggleTheme = async () => {
    let nextTheme: ThemeMode;
    if (themeMode === "system") {
      nextTheme = "light";
    } else if (themeMode === "light") {
      nextTheme = "dark";
    } else {
      nextTheme = "system";
    }
    await setThemeMode(nextTheme);
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        setThemeMode,
        toggleTheme,
      }}
    >

      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

