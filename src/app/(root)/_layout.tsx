import { useAuth } from "@/src/context/AuthContext";
import { Redirect, Slot } from "expo-router";

export default function RootLayout() {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Redirect href="/sign-in" />;

    return <Slot />;
}
