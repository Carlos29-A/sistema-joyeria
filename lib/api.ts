const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new ApiError(res.status, data.error || `Error ${res.status}`, data);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetch(`${API_BASE}${url}${qs}`, {
      credentials: "include",
    }).then(handleResponse<T>);
  },

  post: <T>(url: string, body: object | FormData) => {
    const isFormData = body instanceof FormData;
    return fetch(`${API_BASE}${url}`, {
      method: "POST",
      credentials: "include",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? body : JSON.stringify(body),
    }).then(handleResponse<T>);
  },

  put: <T>(url: string, body: object) => {
    return fetch(`${API_BASE}${url}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse<T>);
  },

  delete: <T>(url: string) => {
    return fetch(`${API_BASE}${url}`, {
      method: "DELETE",
      credentials: "include",
    }).then(handleResponse<T>);
  },
};
