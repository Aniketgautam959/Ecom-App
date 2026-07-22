import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

const defaultBaseURL = Platform.select({
  ios: "http://localhost:8000/api",
  android: "http://10.0.2.2:8000/api",
  default: "http://localhost:8000/api",
});

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? defaultBaseURL;

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
    const status = error.response?.status;

    // Network / connection error (no response received)
    if (!error.response) {
      return error.message === "Network Error"
        ? "Could not connect to the server. Please check your API URL and make sure the backend is running."
        : `Network error: ${error.message}`;
    }

    // Server returned JSON with message/errors
    if (data?.message) {
      if (data.errors && typeof data.errors === "object") {
        const firstError = Object.values(data.errors)[0]?.[0];
        if (firstError) return `${data.message} ${firstError}`;
      }
      return data.message;
    }

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];
      if (firstError) return firstError;
    }

    return status ? `Server error (${status}). Please try again.` : "Something went wrong. Please try again.";
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
