export const API_URL = "";
const FALLBACK_API_URL = "";

export const apiFetch = (path, options = {}) =>
  fetch(`${API_URL}${path}`, { credentials: "include", ...options });

const requestJson = async (base, path, options) => {
  const res = await fetch(`${base}${path}`, { credentials: "include", ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const error = new Error(data.message || data.error || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
};

export const apiJson = async (path, options = {}) => {
  try {
    return await requestJson(API_URL, path, options);
  } catch (error) {
    const isAuth = path.startsWith('/api/auth/');
    const shouldFallback = !isAuth && FALLBACK_API_URL !== API_URL && (!error.status || error.status === 404 || error.status === 405 || error.status >= 500);
    if (!shouldFallback) throw error;
    return requestJson(FALLBACK_API_URL, path, options);
  }
};

export const apiUpload = async (formData) => {
  const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
};
