import { create } from "zustand";

type ConfigState = {
  apiUrl: string;
};

export const useConfigStore = create<ConfigState>(() => ({
  apiUrl: "http://10.0.2.2:5030",
}));

export function getImagenUri(apiUrl: string, imagenUrl?: string | null) {
  if (!imagenUrl) return null;
  return `${apiUrl}/images/${imagenUrl}`;
}
