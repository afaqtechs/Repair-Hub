import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (
    mode: ThemeMode
  ) => Promise<void>;
};

const ThemeContext =
  createContext<ThemeContextType | null>(
    null
  );

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    colorScheme,
    setColorScheme,
  } = useColorScheme();

  const [themeMode, setThemeModeState] =
    useState<ThemeMode>("system");


  /**
   * Load saved theme
   */
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved =
          await AsyncStorage.getItem("theme");

        if (
          saved === "light" ||
          saved === "dark" ||
          saved === "system"
        ) {
          setThemeModeState(saved);
          setColorScheme(saved);
        } else {
          setThemeModeState("system");
          setColorScheme("system");
        }

      } catch (error) {
        console.error(
          "Failed to load theme:",
          error
        );
      }
    };

    loadTheme();
  }, [setColorScheme]);


  /**
   * Update theme
   */
  const setThemeMode = async (
    mode: ThemeMode
  ) => {
    try {
      setThemeModeState(mode);
      setColorScheme(mode);

      await AsyncStorage.setItem(
        "theme",
        mode
      );

    } catch (error) {
      console.error(
        "Failed to save theme:",
        error
      );
    }
  };


  const isDark =
    colorScheme === "dark";


  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}


export const useTheme = () => {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return context;
};