import { Platform } from "react-native";
import { create } from "zustand";

type ConfigState = {
  apiUrl: string;
};

// 10.0.2.2 solo existe dentro del emulador de Android.
// En el navegador y en el simulador de iOS el backend está en localhost.
const apiUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:5030"
    : "http://localhost:5030";

export const useConfigStore = create<ConfigState>(() => ({
  apiUrl,
}));

export function getImagenUri(apiUrl: string, imagenUrl?: string | null) {
  if (!imagenUrl) return null;
  return `${apiUrl}/images/${imagenUrl}`;
}
