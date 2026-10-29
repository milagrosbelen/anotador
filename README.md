# Anotador

App para que un local (kiosco, veterinaria, bebidas, recambios) anote
lo que hay que pedirle al proveedor: qué falta, cuánto y a quién.

Resuelve el problema de depender de un papel, un chat o la memoria del
mostrador. La idea es tener a mano, el lunes a la mañana, una lista clara
de reposición.

Proyecto ABP — Aplicación Móvil. Primera versión (Unidad I): listado y
ficha con datos estáticos. Sin backend ni base de datos.

## Integrantes

- Milagros Pedrasa
- Florencia Palacios
- Renato Ruiz

## Features

Son 3 integrantes, así que el alcance mínimo de la **versión final** es
de 4 features.

| Feature | Estado |
|---|---|
| Consultar el listado de faltantes | Implementada |
| Consultar la ficha de un faltante | Implementada |
| Filtrar faltantes por proveedor | Implementada |
| Elegir una foto de la galería | Implementada |
| sacar una foto | Implementada |
| Registrar la ubicación GPS del local | Implementada |
| Marcar un faltante como ya pedido | Implementada |

**Consultar el listado de faltantes.** La Home muestra los productos que
hay que pedir, con imagen, cantidad, proveedor y estado.

**Consultar la ficha de un faltante.** Al tocar una card se abre el
detalle con ubicación, prioridad y la nota del local. Esa información no
está en el listado.

**Filtrar faltantes por proveedor.** Los chips de la Home dejan ver solo
los faltantes de un proveedor, o todos.

**Elegir una foto de la galería.** En la ficha se elige una foto y, con
Guardar, queda en ese faltante: se ve arriba de la ficha y también en su card
del listado. Si salís sin guardar, se mantiene la foto anterior. Si el
teléfono no da permiso, un cartel avisa y abre Ajustes.

**Registrar la ubicación GPS del local.** En la ficha, dentro de «Dónde está»,
el botón «Estoy en el local» anota las coordenadas y la dirección del lugar.

**Marcar un faltante como ya pedido.** Queda para una unidad siguiente:
hace falta manejar estado (y más adelante persistirlo). El estado
"Ya pedido" hoy viene en los datos estáticos.

## Contenidos de esta entrega

- Pantalla principal ligada a la temática (reposición del local).
- `View`, `Text`, `Image` y `ScrollView`.
- Datos estáticos en `src/data/faltantes.ts`.
- Componentes reutilizables: `FaltanteCard` y `Chip`.
- Comunicación entre componentes por props.

## Stack

React Native · Expo SDK 57 · TypeScript · styled-components · React Navigation (Stack)

## Cómo correr

```bash
git clone https://github.com/milagrosbelen/anotador.git
cd anotador
npm install
npx expo start
```

Después se puede abrir en Expo Go, emulador o en el navegador (`w`).
