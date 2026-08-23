import { supabase } from '@/src/lib/supabase';
import { deletePartImages, deleteRequestImages, deleteServiceImages } from './storage.api';
import { extractFileNameFromUrl } from '../utils/extractFileNameFromUrl';

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
  email: string;
  currentPassword: string;
  newPassword: string;
}) {
  try {
    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      logApiError("updateAuthCredentials", signInError);
      return null;
    }

    // Update password only
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      logApiError("updateAuthCredentials", error);
      return null;
    }

    return data.user;
  } catch (error) {
    logApiError("updateAuthCredentials", error);
    return null;
  }
}

export const deleteAccount = async () => {
    try {
        // ─────────────────────────────────────────────
        // 1. Get current authenticated user
        // ─────────────────────────────────────────────

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
            logApiError("deleteAccount.user", userError);
            return null;
        }

        if (!user) {
            console.log("[authApi.deleteAccount] No authenticated user");
            return null;
        }

        const technicianId = user.id;


        // ─────────────────────────────────────────────
        // 2. Get profile storage URLs
        // ─────────────────────────────────────────────

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("profile_image_url, legal_document_url")
            .eq("id", technicianId)
            .single();

        if (profileError) {
            logApiError("deleteAccount.profile", profileError);
        }


        // ─────────────────────────────────────────────
        // 3. Delete profile image
        // ─────────────────────────────────────────────

        if (profile?.profile_image_url) {
            const fileName = extractFileNameFromUrl(
                profile.profile_image_url
            );

            if (fileName) {
                const folderPath = `${technicianId}/${fileName}`;

                const { error: deleteError } = await supabase.storage
                    .from("profile-images")
                    .remove([folderPath]);

                if (deleteError) {
                    logApiError(
                        "deleteAccount.profileImage",
                        deleteError
                    );
                }
            }
        }


        // ─────────────────────────────────────────────
        // 4. Delete legal document
        // ─────────────────────────────────────────────

        if (profile?.legal_document_url) {
            const fileName = extractFileNameFromUrl(
                profile.legal_document_url
            );

            if (fileName) {
                const folderPath = `${technicianId}/${fileName}`;

                const { error: deleteError } = await supabase.storage
                    .from("legal_documents")
                    .remove([folderPath]);

                if (deleteError) {
                    logApiError(
                        "deleteAccount.legalDocument",
                        deleteError
                    );
                }
            }
        }


        // ─────────────────────────────────────────────
        // 5. Get parts/services/requests images
        // ─────────────────────────────────────────────

        const [
            { data: parts, error: partsError },
            { data: services, error: servicesError },
            { data: requests, error: requestsError },
        ] = await Promise.all([
            supabase
                .from("parts")
                .select("images")
                .eq("technician_id", technicianId),

            supabase
                .from("services")
                .select("images")
                .eq("technician_id", technicianId),

            supabase
                .from("requests")
                .select("images")
                .eq("user_id", technicianId),
        ]);

        if (partsError) {
            logApiError("deleteAccount.parts", partsError);
        }

        if (servicesError) {
            logApiError("deleteAccount.services", servicesError);
        }

        if (requestsError) {
            logApiError("deleteAccount.requests", requestsError);
        }


        // ─────────────────────────────────────────────
        // 6. Delete part images
        // ─────────────────────────────────────────────

        const partImages =
            parts?.flatMap((part) =>
                Array.isArray(part.images) ? part.images : []
            ) ?? [];

        if (partImages.length > 0) {
            const success = await deletePartImages(partImages);

            if (!success) {
                console.log(
                    "[authApi.deleteAccount] Failed to delete part images"
                );
            }
        }


        // ─────────────────────────────────────────────
        // 7. Delete service images
        // ─────────────────────────────────────────────

        const serviceImages =
            services?.flatMap((service) =>
                Array.isArray(service.images) ? service.images : []
            ) ?? [];

        if (serviceImages.length > 0) {
            const success = await deleteServiceImages(serviceImages);

            if (!success) {
                console.log(
                    "[authApi.deleteAccount] Failed to delete service images"
                );
            }
        }


        // ─────────────────────────────────────────────
        // 8. Delete request images
        // ─────────────────────────────────────────────

        const requestImages =
            requests?.flatMap((request) =>
                Array.isArray(request.images) ? request.images : []
            ) ?? [];

        if (requestImages.length > 0) {
            const success = await deleteRequestImages(requestImages);

            if (!success) {
                console.log(
                    "[authApi.deleteAccount] Failed to delete request images"
                );
            }
        }


        // ─────────────────────────────────────────────
        // 9. Delete Auth account
        // ─────────────────────────────────────────────

        const { data, error } = await supabase.functions.invoke(
            "delete-account"
        );

        if (error) {
            logApiError("deleteAccount.auth", error);
            return null;
        }

        return data;

    } catch (error) {
        logApiError("deleteAccount", error);
        return null;
    }
};
