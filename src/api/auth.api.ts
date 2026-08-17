import { supabase } from '@/src/lib/supabase';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[authApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Sign up
// ─────────────────────────────────────────────

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      logApiError('signUp', error);
      return null;
    }

    const user = data.user;

    if (!user) {
      console.log(
        '[authApi.signUp] User was created but no user data was returned.'
      );

      return null;
    }

    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        role: 'technician',
      },
      {
        onConflict: 'id',
      }
    );

    if (profileError) {
      logApiError('signUp', profileError);
      return null;
    }

    return data;
  } catch (error) {
    logApiError('signUp', error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Sign in
// ─────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logApiError('signIn', error);
      return null;
    }

    return data;
  } catch (error) {
    logApiError('signIn', error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Sign out
// ─────────────────────────────────────────────

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      logApiError('signOut', error);
      return false;
    }

    return true;
  } catch (error) {
    logApiError('signOut', error);
    return false;
  }
}

// ─────────────────────────────────────────────
// Get current session
// ─────────────────────────────────────────────

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      logApiError('getSession', error);
      return null;
    }

    return data.session;
  } catch (error) {
    logApiError('getSession', error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Get current user
// ─────────────────────────────────────────────

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      logApiError('getCurrentUser', error);
      return null;
    }

    return data.user;
  } catch (error) {
    logApiError('getCurrentUser', error);
    return null;
  }
}

// ─────────────────────────────────────────────
// Update auth email/password
// ─────────────────────────────────────────────

export async function updateAuthCredentials({
  email,
  currentPassword,
  newPassword,
}: {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const updates: {
      email?: string;
      password?: string;
    } = {};

    // ─────────────────────────────────────────
    // Change password
    // ─────────────────────────────────────────

    if (newPassword) {
      if (!email || !currentPassword) {
        console.log(
          '[authApi.updateAuthCredentials] Email and current password are required to change password.'
        );

        return null;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        logApiError('updateAuthCredentials', signInError);

        return null;
      }

      updates.password = newPassword;
    }

    // ─────────────────────────────────────────
    // Change email
    // ─────────────────────────────────────────

    if (email) {
      updates.email = email;
    }

    // ─────────────────────────────────────────
    // Nothing to update
    // ─────────────────────────────────────────

    if (Object.keys(updates).length === 0) {
      console.log('[authApi.updateAuthCredentials] Nothing to update.');

      return null;
    }

    // ─────────────────────────────────────────
    // Update user
    // ─────────────────────────────────────────

    const { data, error } = await supabase.auth.updateUser(updates);

    if (error) {
      logApiError('updateAuthCredentials', error);

      return null;
    }

    return data.user;
  } catch (error) {
    logApiError('updateAuthCredentials', error);
    return null;
  }
}
