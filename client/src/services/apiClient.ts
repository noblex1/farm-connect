const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type RequestOptions = RequestInit & {
  token?: string;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Handle authentication errors specifically
    if (response.status === 401) {
      // Clear invalid session data
      localStorage.removeItem("farm-market-token");
      localStorage.removeItem("farm-market-user");
      
      // If not already on login page, redirect
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/create-account")) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
};

export { API_BASE_URL };
