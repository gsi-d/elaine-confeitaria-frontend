const defaultApiUrl = "http://localhost:3000";

function resolveApiUrl() {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!rawApiUrl) {
    return defaultApiUrl;
  }

  return rawApiUrl.replace(/\/+$/, "");
}

export const env = {
  apiUrl: resolveApiUrl(),
};
