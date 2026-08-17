export function isUserOnline(
  isAvailable?: boolean | null,
  lastSeenAt?: string | null
) {
  if (!isAvailable || !lastSeenAt) {
    return false;
  }

  const lastSeen =
    new Date(lastSeenAt).getTime();

  const now = Date.now();

  return (
    now - lastSeen <= 60_000
  );
}