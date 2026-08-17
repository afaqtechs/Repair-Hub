import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {

  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) return <Redirect href="/(root)/(tabs)" />;

  return <Redirect href="/sign-in" />;
}
