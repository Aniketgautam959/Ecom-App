import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8000/api";

export const storageOrigin = (process.env.EXPO_PUBLIC_STORAGE_ORIGIN ?? baseURL.replace(/\/api\/?$/, "")).replace(/\/$/, "");

export const api = axios.create({ baseURL, timeout: 30000, headers: { Accept: "application/json" } });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function messageFrom(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    return data?.message ?? Object.values(data?.errors ?? {})[0]?.[0] ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export function assetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${storageOrigin}/${path.replace(/^\//, "")}`;
}

export function unwrap<T = unknown>(response: { data: { data?: T } }): T | undefined {
  return response.data.data;
}
