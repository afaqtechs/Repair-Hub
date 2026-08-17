import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logStorageError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[storageApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// PART IMAGES
// ─────────────────────────────────────────────

const getPartsStoragePath = (url: string) => {
  const marker = '/storage/v1/object/public/part-images/';

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return url.substring(index + marker.length);
};

export const deletePartImages = async (urls: string[]): Promise<boolean> => {
  try {
    const paths = urls
      .map(getPartsStoragePath)
      .filter((path): path is string => Boolean(path));

    if (paths.length === 0) {
      return true;
    }

    const { error } = await supabase.storage.from('part-images').remove(paths);

    if (error) {
      logStorageError('deletePartImages', error);

      return false;
    }

    return true;
  } catch (error) {
    logStorageError('deletePartImages', error);

    return false;
  }
};

// ─────────────────────────────────────────────
// SERVICE IMAGES
// ─────────────────────────────────────────────

const getServicesStoragePath = (url: string) => {
  const marker = '/storage/v1/object/public/service-images/';

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return url.substring(index + marker.length);
};

export const deleteServiceImages = async (urls: string[]): Promise<boolean> => {
  try {
    const paths = urls
      .map(getServicesStoragePath)
      .filter((path): path is string => Boolean(path));

    if (paths.length === 0) {
      return true;
    }

    const { error } = await supabase.storage
      .from('service-images')
      .remove(paths);

    if (error) {
      logStorageError('deleteServiceImages', error);

      return false;
    }

    return true;
  } catch (error) {
    logStorageError('deleteServiceImages', error);

    return false;
  }
};

// ─────────────────────────────────────────────
// REQUEST IMAGES
// ─────────────────────────────────────────────

const getRequestsStoragePath = (url: string) => {
  const marker = '/storage/v1/object/public/request-images/';

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return url.substring(index + marker.length);
};

export const deleteRequestImages = async (urls: string[]): Promise<boolean> => {
  try {
    const paths = urls
      .map(getRequestsStoragePath)
      .filter((path): path is string => Boolean(path));

    if (paths.length === 0) {
      return true;
    }

    const { error } = await supabase.storage
      .from('request-images')
      .remove(paths);

    if (error) {
      logStorageError('deleteRequestImages', error);

      return false;
    }

    return true;
  } catch (error) {
    logStorageError('deleteRequestImages', error);

    return false;
  }
};
