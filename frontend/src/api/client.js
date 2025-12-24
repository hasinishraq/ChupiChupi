import { getToken } from "../utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.error?.message || response.statusText || "Request failed";
    throw new ApiError(message, response.status);
  }

  return payload;
};

const get = (path) => request(path, { method: "GET" });

const post = (path, body) =>
  request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

const patch = (path, body) =>
  request(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

const del = (path) => request(path, { method: "DELETE" });

export { ApiError, get, post, patch, del };
