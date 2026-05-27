export const getQueryParam = (url, key) => {
  try {
    // Works on RN (Hermes) and modern JS
    const u = new URL(url);
    return u.searchParams.get(key);
  } catch {
    // Fallback for odd URLs / older runtimes
    const q = url.split("?")[1]?.split("#")[0];
    if (!q) return null;
    const pairs = q.split("&").map(s => s.split("=").map(decodeURIComponent));
    const map = Object.fromEntries(pairs);
    return map[key] ?? null;
  }
};



export const normalizeIndianMobile = (value) => {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, ""); // remove spaces, +, -, etc.

  // +91XXXXXXXXXX  -> XXXXXXXXXX
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);

  // 0XXXXXXXXXX -> XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);

  // If something longer, keep the last 10 (common cleanup)
  if (digits.length > 10) return digits.slice(-10);

  return digits; // already 10 digits
};




export const withAlpha = (hex, a = 0.6) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
