export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiFetch = (path, options = {}) =>
  fetch(`${API_URL}${path}`, { credentials: "include", ...options });

export const apiJson = async (path, options = {}) => {
  const res = await apiFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
};

export const apiUpload = async (formData) => {
  const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
};
