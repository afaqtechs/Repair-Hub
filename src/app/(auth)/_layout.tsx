import { useAuth } from "@/src/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthRoutesLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <StatusBar
        style="dark"
        translucent
        backgroundColor="transparent"
      />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}