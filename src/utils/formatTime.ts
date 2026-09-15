export function formatTime(date: string) {
    const announcementDate = new Date(date);
    const now = new Date();

    if (
        announcementDate.toDateString() === now.toDateString()
    ) {
        return announcementDate.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    return announcementDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
    });
}