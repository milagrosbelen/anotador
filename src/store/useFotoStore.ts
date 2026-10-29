import { Platform } from "react-native";
import { create } from "zustand";

export type FotoPendiente = {
  origen: "camara" | "galeria";
  uri: string;
  nombre: string;
  tipo: string;
};

type FotoState = {
  fotos: Record<number, string>;
  pendientes: Record<number, FotoPendiente>;
  setPendiente: (id: number, foto: FotoPendiente) => void;
  descartarPendiente: (id: number) => void;
  quitarFotoLocal: (id: number) => void;
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
  pendientes: {},
  setPendiente: (id, foto) => set({ pendientes: { ...get().pendientes, [id]: foto } }),
  descartarPendiente: (id) => {
    const pendientes = { ...get().pendientes };
    delete pendientes[id];
    set({ pendientes });
  },
  quitarFotoLocal: (id) => {
    const fotos = { ...get().fotos };
    delete fotos[id];
    if (!escribirFotos(fotos) && Platform.OS === "web") {
      // Evitar restaurar una imagen vieja si el navegador rechaza la escritura.
      try { localStorage.removeItem(CLAVE); } catch { /* Almacenamiento no disponible. */ }
    }
    set({ fotos });
  },
  setFoto: (id, uri) => {
    const fotos = { ...get().fotos, [id]: uri };
    const pudoGuardar = escribirFotos(fotos);
    if (!pudoGuardar) return false;

    set({ fotos });
    return true;
  },
}));
