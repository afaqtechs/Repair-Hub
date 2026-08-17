export const extractFileNameFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        return pathParts[pathParts.length - 1];
    } catch {
        // If URL parsing fails, try manual extraction
        const parts = url.split('/');
        return parts[parts.length - 1];
    }
};