import { supabase } from '@/src/lib/supabase';
import { TechnicianLocation } from '@/types/technicianLocation';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logLocationError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[locationApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Get technician locations
// ─────────────────────────────────────────────

export async function get_technician_location(
  latitude: number,
  longitude: number
): Promise<TechnicianLocation[]> {
  try {
    const { data, error } = await supabase.rpc('get_technician_location', {
      user_lat: latitude,
      user_lng: longitude,
    });

    if (error) {
      logLocationError('get_technician_location', error);

      return [];
    }

    return (data ?? []).map((item: any) => ({
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      distance: Math.round(item.distance / 1000),
    }));
  } catch (error) {
    logLocationError('get_technician_location', error);

    return [];
  }
}

// ─────────────────────────────────────────────
// Get my location
// ─────────────────────────────────────────────

export async function getMyLocation(userId: string) {
  try {
    const { data, error } = await supabase.rpc('get_my_location', {
      p_user_id: userId,
    });

    if (error) {
      logLocationError('getMyLocation', error);

      return null;
    }

    return data?.[0] ?? null;
  } catch (error) {
    logLocationError('getMyLocation', error);

    return null;
  }
}
