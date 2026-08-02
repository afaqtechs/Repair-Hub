import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";


interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);


export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        supabase.auth.getSession()
            .then(({ data }) => {
                setUser(data.session?.user ?? null);
            })
            .catch((error) => {
                console.error("Failed to get session:", error);
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });

        const {
            data: listener,
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );


        return () => {
            listener.subscription.unsubscribe();
        };

    }, []);


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
} 