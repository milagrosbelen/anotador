import { Platform } from "react-native";
import { create } from "zustand";

type FotoState = {
  fotos: Record<number, string>;
  setFoto: (id: number, uri: string) => boolean;
};

const CLAVE = "anotador-fotos";

function leerFotos(): Record<number, string> {
  try {
    if (Platform.OS !== "web" || typeof localStorage === "undefined") {
      return {};
    }

    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return {};

    const guardadas = JSON.parse(crudo) as Record<string, string>;
    return Object.fromEntries(
      Object.entries(guardadas).map(([id, uri]) => [Number(id), uri])
    );
  } catch {
    return {};
  }
}

function escribirFotos(fotos: Record<number, string>): boolean {
  try {
    if (Platform.OS !== "web" || typeof localStorage === "undefined") {
      return true;
    }

    localStorage.setItem(CLAVE, JSON.stringify(fotos));
    return true;
  } catch {
    return false;
  }
}

export const useFotoStore = create<FotoState>((set, get) => ({
  fotos: leerFotos(),
  setFoto: (id, uri) => {
    const fotos = { ...get().fotos, [id]: uri };
    const pudoGuardar = escribirFotos(fotos);
    if (!pudoGuardar) return false;

    set({ fotos });
    return true;
  },
}));
