import axios from "axios";
import { getAuthToken } from "./authTokenStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();

  config.headers = config.headers ?? {};
  if (token) {
    // Axios v1 safe-set
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retried) {
      original._retried = true;
      await new Promise((r) => setTimeout(r, 200));
      return apiClient(original);
    }
    return Promise.reject(error);
  },
);
