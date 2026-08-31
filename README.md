# Guía del Proyecto ABP — Anotador

Documento interno del grupo (3 integrantes). Proyecto elegido: **pedidos al proveedor** (el anotador del lunes).

---

## 1. Qué estamos haciendo

App para kiosco, veterinaria, bebidas, ropa, recambios: lo que hay que pedirle al mayorista. Cada ítem es un faltante (nombre, cantidad, proveedor, foto, estado).

**No hay backend ni base de datos.** Unidad I = datos estáticos en un `.ts`. Solo el APK.

Somos 3 → **4 Features** en la versión final. Entrega: GitHub público + README.

---

## 2. Lo que pide el profe (Unidad I)

Usar al pie de la letra:

- React Native (`View`, `Text`, `Image`, `ScrollView`)
- Expo SDK
- TypeScript
- styled-components
- Navigation Stack (Home y Detalle)

Además:

- Pantalla principal del tema
- Datos estáticos (array, no API)
- Componentes reutilizables + **props**
- Una card reutilizable (`FaltanteCard`)

No cuenta como Feature: pantalla de inicio, menú, navegación, “usar styled-components”.

Una Feature = lo que el usuario **hace o consulta**.

---

## 3. Las 4 Features (van al README)

| # | Feature | Qué hace el usuario | Unidad I |
|---|---|---|---|
| 1 | Consultar el listado de faltantes | Ve cards con foto, nombre, cantidad, proveedor | Sí |
| 2 | Consultar la ficha de un faltante | Toca la card y ve el detalle | Sí |
| 3 | Filtrar por proveedor | Chips: Todos / Dist. San Martín / etc. | Sí (si ya dieron estado) o planificada |
| 4 | Marcar “ya pedido” | En la ficha cambia el estado | Planificada si todavía no dieron estado |

No escribir en el README: “Home”, “Stack”, “cards”, “scroll”.

---

## 4. Cómo se ve (Unidad I)

```
Navigation Stack
 ├── HomeScreen
 │    ├── Header (Anotador)
 │    ├── chips de proveedor (si está la feature 3)
 │    └── ScrollView
 │         └── FaltanteCard (props: imagen, nombre, cantidad, proveedor, estado)
 └── FaltanteDetalle
      ├── Image
      ├── nombre / cantidad / proveedor / nota
      └── botón “Ya pedido” (feature 4)
```

Datos: `src/data/faltantes.ts` — 8 a 12 ítems de rubros distintos (bebidas, vet, autos, motos). Tipo `Faltante` en TypeScript.

---

## 5. Qué hace cada uno (no pisarse)

Las 4 features son del **producto**. Cada integrante es dueño de **archivos**, no de “una feature mía y listo”.

### Integrante A — UI de la lista

Dueño de: `FaltanteCard` + Home (estilos).

- Card reutilizable con **props**: imagen, nombre, cantidad, proveedor, estado
- `ScrollView` de la Home + header “Anotador”
- styled-components
- Deja el lugar de los chips; no programes el filtro
- Entrega: 8+ cards en pantalla, mismo componente

### Integrante B — datos + ficha

Dueño de: `faltantes.ts` + pantalla `FaltanteDetalle`.

- `type Faltante` en TypeScript
- Array estático: 8–12 faltantes (Coca, filtro de aceite, alimento de perro, cadena de moto, etc.)
- Pantalla detalle: foto, cantidad, proveedor, rubro, nota
- Entrega: si le pasan un `id`, se ve esa ficha

### Integrante C — proyecto, navegación, entrega

Dueño de: Expo, Stack, GitHub, README.

- Crea el proyecto Expo + TypeScript
- Crea el repo, lo sube, manda el link a A y B para que cloné
- Stack: Home → Detalle al tocar la card (pasa el `id`)
- Junta lo de A y B
- Programa **filtrar por proveedor** (chips) sobre el array de B
- Programa **marcar ya pedido** cuando enganchen el botón de la ficha (puede ser después)
- README: nombre, descripción, integrantes, 4 features y estado
- Repo **público**

**Orden:** C crea repo y proyecto → A y B clonan → A y B laburan en paralelo → C enchufa Stack + filtro y deja el README.

Los 3 commitean con **su** usuario de GitHub.

---

## 6. Checklist Unidad I

- [ ] La app abre en Expo Go / emulador
- [ ] Home del tema (faltantes)
- [ ] `View`, `Text`, `Image`, `ScrollView`
- [ ] `FaltanteCard` con props
- [ ] Datos estáticos, ~8 ítems con imagen
- [ ] Stack al detalle
- [ ] Repo público
- [ ] README con features y estado
- [ ] Commits de los 3

---

## 7. Plantilla del README

```markdown
# Anotador

App para que un local (kiosco, vet, bebidas, recambios) vea
lo que hay que pedirle al proveedor: qué falta, cuánto, a quién.

## Integrantes

- (C) Nombre Apellido
- (A) Nombre Apellido
- (B) Nombre Apellido

## Features

| Feature | Estado |
|---|---|
| Consultar el listado de faltantes | En progreso (datos estáticos — Unidad I) |
| Consultar la ficha de un faltante | En progreso (Unidad I) |
| Filtrar por proveedor | Pendiente |
| Marcar ya pedido | Pendiente |

## Cómo correr

npx expo start
```

---

## 8. C: crear el repo y que lo cloné el grupo

Hacerlo **vos**. Cuando exista el proyecto Expo:

1. Cuenta en [github.com](https://github.com) (si no tenés).
2. New repository → nombre `anotador` (o `anotador-app`) → **Public** → **sin** README (si el README lo vas a poner vos en la carpeta del proyecto). Create.
3. En la carpeta del proyecto Expo, en la terminal:

```bash
git init
git add .
git commit -m "Inicio del proyecto Anotador — Unidad I"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/anotador.git
git push -u origin main
```

4. Settings → Collaborators → Add people → usuarios de A y B. Que acepten el mail.
5. Mandales este texto:

```
Repo: https://github.com/TU_USUARIO/anotador
Clonar:
git clone https://github.com/TU_USUARIO/anotador.git
cd anotador
npm install
npx expo start
A trabaja FaltanteCard + Home.
B trabaja faltantes.ts + pantalla detalle.
No suban todo en un solo commit: cada uno con su usuario.
```

6. El link que va a Teams / al profe es el del repo, **público**.
