import { create } from "zustand";

type ErrorState = {
  mensaje: string | null;
  mostrarError: (mensaje: string) => void;
  limpiarError: () => void;
};

export const useErrorStore = create<ErrorState>((set) => ({
  mensaje: null,
  mostrarError: (mensaje) => set({ mensaje }),
  limpiarError: () => set({ mensaje: null }),
}));
