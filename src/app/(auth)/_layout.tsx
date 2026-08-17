import { useAuth } from "@/src/context/AuthContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}