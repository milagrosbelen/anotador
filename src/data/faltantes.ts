import { ImageSourcePropType } from "react-native";

export type EstadoFaltante = "Falta pedir" | "Ya pedido";
export type PrioridadFaltante = "Alta" | "Media" | "Baja";

export type Faltante = {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  proveedor: string;
  estado: EstadoFaltante;
  imagen: ImageSourcePropType;
  nota: string;
  prioridad: PrioridadFaltante;
  ubicacion: string;
};

export const FALTANTES: Faltante[] = [
  {
    id: 1,
    nombre: "Coca Cola 2.25 L",
    cantidad: 3,
    unidad: "fardos",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/coca-cola.jpg.png"),
    nota: "Se vendió el fin de semana. El lunes a la mañana suele quedar la góndola vacía.",
    prioridad: "Alta",
    ubicacion: "Góndola de bebidas",
  },
  {
    id: 2,
    nombre: "Filtro de aceite 1100",
    cantidad: 4,
    unidad: "unidades",
    proveedor: "Autopartes Lopez",
    estado: "Falta pedir",
    imagen: require("../../assets/images/filtro-aceite.jpg.png"),
    nota: "Lo piden seguido para Fiat 147 y Uno. Quedan 0 en mostrador.",
    prioridad: "Alta",
    ubicacion: "Estante de filtros",
  },
  {
    id: 3,
    nombre: "Alimento perro 15 kg",
    cantidad: 2,
    unidad: "bolsas",
    proveedor: "Drogueria Vet Sur",
    estado: "Ya pedido",
    imagen: require("../../assets/images/alimento-perro.jpg.png"),
    nota: "Pedido el viernes. El proveedor confirmó entrega para el martes.",
    prioridad: "Media",
    ubicacion: "Depósito — fondo",
  },
  {
    id: 4,
    nombre: "Quilmes 1L pack",
    cantidad: 5,
    unidad: "packs",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/quilmes.jpg.png"),
    nota: "Queda un pack abierto. Completar antes del finde.",
    prioridad: "Media",
    ubicacion: "Heladera de cervezas",
  },
  {
    id: 5,
    nombre: "Cadena 428 moto",
    cantidad: 1,
    unidad: "unidad",
    proveedor: "Motos del Centro",
    estado: "Falta pedir",
    imagen: require("../../assets/images/cadena-moto.jpg.png"),
    nota: "Un cliente la encargó para el miércoles. Traer una de más por si se vende.",
    prioridad: "Alta",
    ubicacion: "Mostrador de motos",
  },
  {
    id: 6,
    nombre: "Comida para gato",
    cantidad: 3,
    unidad: "bolsas",
    proveedor: "Drogueria Vet Sur",
    estado: "Ya pedido",
    imagen: require("../../assets/images/comida-gato.jpg"),
    nota: "Ya salió el pedido. Controlar que traigan la marca de siempre.",
    prioridad: "Baja",
    ubicacion: "Góndola de mascotas",
  },
  {
    id: 7,
    nombre: "Fanta 2.25 L",
    cantidad: 2,
    unidad: "fardos",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/fanta.jpg"),
    nota: "Se pidió menos la semana pasada y faltó el sábado.",
    prioridad: "Media",
    ubicacion: "Góndola de bebidas",
  },
  {
    id: 8,
    nombre: "Galletitas Oreo",
    cantidad: 4,
    unidad: "paquetes",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/galleta-oreo.gif"),
    nota: "Producto de impulso al lado de la caja. No dejar el gancho vacío.",
    prioridad: "Baja",
    ubicacion: "Exhibidor de caja",
  },
  {
    id: 9,
    nombre: "Papas Lays",
    cantidad: 6,
    unidad: "paquetes",
    proveedor: "Dist. San Martin",
    estado: "Ya pedido",
    imagen: require("../../assets/images/papas-lays.jpg"),
    nota: "Pedido junto con las galletitas. Confirmar si traen sabor original y ketchup.",
    prioridad: "Media",
    ubicacion: "Góndola de snacks",
  },
  {
    id: 10,
    nombre: "Sprite 2.25 L",
    cantidad: 3,
    unidad: "fardos",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/sprite.jpg"),
    nota: "Se mezcla con Coca en combos. Pedir los tres fardos juntos.",
    prioridad: "Alta",
    ubicacion: "Góndola de bebidas",
  },
];

export const PROVEEDORES = [
  "Todos",
  ...Array.from(new Set(FALTANTES.map((item) => item.proveedor))),
];

export function getFaltanteById(id: number): Faltante | undefined {
  return FALTANTES.find((item) => item.id === id);
}
