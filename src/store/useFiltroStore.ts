import { create } from "zustand";

type FiltroState = {
  proveedorActivo: string;
  setProveedorActivo: (proveedor: string) => void;
};

export const useFiltroStore = create<FiltroState>((set) => ({
  proveedorActivo: "Todos",
  setProveedorActivo: (proveedor) => set({ proveedorActivo: proveedor }),
}));
