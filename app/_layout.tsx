
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from 'expo-font';
import { Slot } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded, error] = useFonts({
    "manrope-regular": require("../assets/fonts/manrope-regular.otf"),
    "manrope-medium": require("../assets/fonts/manrope-medium.otf"),
    "manrope-semiBold": require("../assets/fonts/manrope-semibold.otf"),
    "manrope-bold": require("../assets/fonts/manrope-bold.otf"),
    "manrope-light": require("../assets/fonts/manrope-light.otf"),
    "manrope-thin": require("../assets/fonts/manrope-thin.otf"),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
