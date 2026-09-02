export type Faltante = {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  proveedor: string;
  estado: string;
  imagen: any;
  nota: string;
};

export const faltantes: Faltante[] = [
  {
    id: 1,
    nombre: "Coca Cola 2.25 L",
    cantidad: 3,
    unidad: "fardos",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/coca-cola.jpg.png"),
    nota: "",
  },
  {
    id: 2,
    nombre: "Filtro de aceite 1100",
    cantidad: 4,
    unidad: "unidades",
    proveedor: "Autopartes Lopez",
    estado: "Falta pedir",
    imagen: require("../../assets/images/filtro-aceite.jpg.png"),
    nota: "",
  },
  {
    id: 3,
    nombre: "Alimento perro 15 kg",
    cantidad: 2,
    unidad: "bolsas",
    proveedor: "Drogueria Vet Sur",
    estado: "Ya pedido",
    imagen: require("../../assets/images/alimento-perro.jpg.png"),
    nota: "",
  },
  {
    id: 4,
    nombre: "Quilmes 1L pack",
    cantidad: 5,
    unidad: "packs",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/quilmes.jpg.png"),
    nota: "",
  },
  {
    id: 5,
    nombre: "Cadena 428 moto",
    cantidad: 1,
    unidad: "unidad",
    proveedor: "Motos del Centro",
    estado: "Falta pedir",
    imagen: require("../../assets/images/cadena-moto.jpg.png"),
    nota: "",
  },
  {
    id: 6,
    nombre: "Comida para gato",
    cantidad: 3,
    unidad: "bolsas",
    proveedor: "Drogueria Vet Sur",
    estado: "Ya pedido",
    imagen: require("../../assets/images/comida-gato.jpg"),
    nota: "",
  },
  {
    id: 7,
    nombre: "Fanta 2.25 L",
    cantidad: 2,
    unidad: "fardos",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/fanta.jpg"),
    nota: "",
  },
  {
    id: 8,
    nombre: "Galletitas Oreo",
    cantidad: 4,
    unidad: "paquetes",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/galleta-oreo.gif"),
    nota: "",
  },
  {
    id: 9,
    nombre: "Papas Lays",
    cantidad: 6,
    unidad: "paquetes",
    proveedor: "Dist. San Martin",
    estado: "Ya pedido",
    imagen: require("../../assets/images/papas-lays.jpg"),
    nota: "",
  },
  {
    id: 10,
    nombre: "Sprite 2.25 L",
    cantidad: 3,
    unidad: "fardos",
    proveedor: "Dist. San Martin",
    estado: "Falta pedir",
    imagen: require("../../assets/images/sprite.jpg"),
    nota: "",
  },
];