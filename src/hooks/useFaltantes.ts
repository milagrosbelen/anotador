import { useQuery } from "@tanstack/react-query";
import { useConfigStore } from "../store/useConfigStore";
import { useErrorStore } from "../store/useErrorStore";
import { EstadoFaltante } from "../data/faltantes";

export type FaltanteApi = {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  proveedor: string;
  estado: EstadoFaltante;
  imagenUrl: string | null;
  nota: string | null;
};

export function useFaltantes() {
  const apiUrl = useConfigStore((state) => state.apiUrl);

  return useQuery<FaltanteApi[]>({
    queryKey: ["faltantes", apiUrl],

    queryFn: async (): Promise<FaltanteApi[]> => {
      try {
        const response = await fetch(`${apiUrl}/api/faltantes`);

        if (!response.ok) {
          throw new Error("Error al obtener los faltantes");
        }

        const data: FaltanteApi[] = await response.json();

        useErrorStore.getState().limpiarError();

        return data;
      } catch (error) {
        useErrorStore
          .getState()
          .mostrarError("No se pudieron cargar los faltantes");

        throw error;
      }
    },

    retry: false,
  });
}