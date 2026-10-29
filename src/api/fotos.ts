import { Platform } from "react-native";
import { File } from "expo-file-system";
import { FaltanteApi } from "../hooks/useFaltantes";
import { FotoPendiente } from "../store/useFotoStore";

export async function obtenerFaltante(apiUrl: string, id: number): Promise<FaltanteApi> {
  const response = await fetch(`${apiUrl}/api/faltantes/${id}`);
  if (!response.ok) {
    throw new Error(response.status === 404 ? "No encontramos ese faltante." : "No se pudo consultar el faltante.");
  }
  return response.json();
}

export async function subirFoto(apiUrl: string, id: number, foto: FotoPendiente): Promise<void> {
  // El PUT reemplaza todos los campos: consultar sus valores actuales antes de enviarlo.
  const actual = await obtenerFaltante(apiUrl, id);
  const body = new FormData();
  body.append("Nombre", actual.nombre);
  body.append("Cantidad", String(actual.cantidad));
  body.append("Unidad", actual.unidad);
  body.append("Proveedor", actual.proveedor);
  body.append("Estado", actual.estado);
  if (actual.nota !== null) body.append("Nota", actual.nota);

  await adjuntarFoto(body, foto);

  const response = await fetch(`${apiUrl}/api/faltantes/${id}`, { method: "PUT", body });
  if (!response.ok) throw new Error("No se pudo subir la foto. Volvé a intentar.");
}

async function adjuntarFoto(body: FormData, foto: FotoPendiente) {
  if (Platform.OS === "web") {
    const archivo = await fetch(foto.uri);
    if (!archivo.ok) throw new Error("No se pudo leer la foto.");
    body.append("Imagen", await archivo.blob(), foto.nombre);
  } else {
    // Expo necesita un archivo con acceso a sus bytes, no un descriptor { uri }.
    body.append("Imagen", new File(foto.uri));
  }

}

export type DatosNuevoFaltante = { nombre: string; cantidad: string; unidad: string; proveedor: string; nota: string };

export function validarNuevoFaltante(datos: DatosNuevoFaltante, foto: FotoPendiente | null): string | null {
  if (!foto) return "Sacá una foto del faltante antes de guardar.";
  if (!datos.nombre.trim() || !datos.unidad.trim() || !datos.proveedor.trim()) return "Completá nombre, unidad y proveedor.";
  const cantidad = Number(datos.cantidad);
  if (!/^\d+$/.test(datos.cantidad.trim()) || !Number.isSafeInteger(cantidad) || cantidad < 1 || cantidad > 2147483647) return "La cantidad debe ser un número entero positivo válido.";
  return null;
}

export async function crearFaltante(apiUrl: string, datos: DatosNuevoFaltante, foto: FotoPendiente): Promise<FaltanteApi> {
  const error = validarNuevoFaltante(datos, foto);
  if (error) throw new Error(error);
  const body = new FormData();
  body.append("Nombre", datos.nombre.trim());
  body.append("Cantidad", String(Number(datos.cantidad)));
  body.append("Unidad", datos.unidad.trim());
  body.append("Proveedor", datos.proveedor.trim());
  body.append("Estado", "Falta pedir");
  if (datos.nota.trim()) body.append("Nota", datos.nota.trim());
  await adjuntarFoto(body, foto);
  const response = await fetch(`${apiUrl}/api/faltantes`, { method: "POST", body });
  if (!response.ok) throw new Error("No se pudo crear el faltante. Revisá la conexión y volvé a intentar.");
  return response.json();
}
