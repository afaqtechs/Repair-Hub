import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/src/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

// ─────────────────────────────────────────────
// Auth error helper
// ─────────────────────────────────────────────

const logAuthError = (
  method: string,
  error: unknown
) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  console.log(
    `[AuthProvider.${method}]`,
    message
  );
};

// ─────────────────────────────────────────────
// Auth Provider
// ─────────────────────────────────────────────

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    // ─────────────────────────────────────────
    // Get current session
    // ─────────────────────────────────────────

    const getCurrentSession = async () => {
      try {
        const {
          data,
          error,
        } = await supabase.auth.getSession();

        if (error) {
          logAuthError(
            "getSession",
            error
          );

          setUser(null);
          return;
        }

        setUser(
          data.session?.user ?? null
        );
      } catch (error) {
        logAuthError(
          "getSession",
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentSession();

    // ─────────────────────────────────────────
    // Listen for auth changes
    // ─────────────────────────────────────────

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        try {
          setUser(
            session?.user ?? null
          );
        } catch (error) {
          logAuthError(
            "onAuthStateChange",
            error
          );

          setUser(null);
        }
      }
    );

    // ─────────────────────────────────────────
    // Cleanup
    // ─────────────────────────────────────────

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

// ─────────────────────────────────────────────
// useAuth
// ─────────────────────────────────────────────

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}