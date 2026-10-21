const localApiUrl = "http://localhost:5050/api";
const liveApiUrl = "https://webd-assignment-6.onrender.com/api";
const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? liveApiUrl : localApiUrl);

export async function apiCall(path, options = {}, token = "") {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Could not reach the server.");
  return data;
}

export function sendJson(method, body) {
  return { method, body: JSON.stringify(body) };
}
