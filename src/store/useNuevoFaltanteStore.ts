import { create } from "zustand";
import type { FotoPendiente } from "./useFotoStore";

export const useNuevoFaltanteStore = create<{
  foto: FotoPendiente | null;
  setFoto: (foto: FotoPendiente | null) => void;
}>((set) => ({ foto: null, setFoto: (foto) => set({ foto }) }));
