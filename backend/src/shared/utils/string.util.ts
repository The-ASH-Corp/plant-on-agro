
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}


export function buildCaseInsensitiveEmailQuery(email: string): {
  $or: Array<{ email: string } | { email: { $regex: RegExp } }>;
} {
  const normalized = normalizeEmail(email);
  const escaped = escapeRegex(normalized);
  return {
    $or: [
      { email: normalized },
      { email: { $regex: new RegExp(`^${escaped}$`, 'i') } },
    ],
  };
}
