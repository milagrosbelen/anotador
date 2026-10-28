import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export type IconoAviso = "success" | "warning" | "question" | "info" | "error";

export type OpcionesAviso = {
  icono: IconoAviso;
  titulo: string;
  texto: string;
  confirmar: string;
  cancelar?: string;
};

export function AvisoHost() {
  return null;
}

export async function mostrarAviso(opciones: OpcionesAviso): Promise<boolean> {
  const resultado = await Swal.fire({
    icon: opciones.icono,
    title: opciones.titulo,
    text: opciones.texto,
    confirmButtonText: opciones.confirmar,
    cancelButtonText: opciones.cancelar,
    showCancelButton: Boolean(opciones.cancelar),
    confirmButtonColor: "#5e9b6a",
    cancelButtonColor: "#6e7881",
    buttonsStyling: true,
    heightAuto: false,
  });

  return resultado.isConfirmed;
}
