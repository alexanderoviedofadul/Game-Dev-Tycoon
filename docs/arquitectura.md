# Arquitectura

## La restricción que lo decide todo

El proyecto debe funcionar **abriendo `index.html` con doble clic** (`file://`) y además desplegarse en GitHub Pages, sin build step ni `package.json`.

Bajo `file://` el origen es `null`, y eso rompe **dos** cosas, no una:

| Patrón | Bajo `file://` |
|---|---|
| `fetch('data/x.json')` | ❌ bloqueado por CORS |
| `<script type="module">` con `import` | ❌ **también** bloqueado por CORS |
| `<script src="...">` clásico + variable global | ✅ funciona |

El segundo es el que suele pasarse por alto. Por eso los datos viven en `js/data.js` como **script clásico** que escribe en `window.GDT`, y no en `data/*.json`.

## Orden de carga

Los scripts se cargan en orden de dependencia al final de `<body>`:

```html
<script src="js/data.js"></script>    <!-- 0 dependencias: define window.GDT -->
<script src="js/engine.js"></script>  <!-- lee GDT.*        → define GDT.engine -->
<script src="js/i18n.js"></script>    <!-- independiente    → define GDT.i18n -->
<script src="js/ui.js"></script>      <!-- lee GDT, engine, i18n → define GDT.ui -->
<script src="app.js"></script>        <!-- arranque, estado y enrutado -->
```

`app.js` comprueba las dependencias antes de arrancar y, si falta alguna, pinta un banner de error en `<main>` en vez de dejar la página en blanco. Ese caso es real: alguien descarga `index.html` sin la carpeta `js/`.

```js
if (!window.GDT || !GDT.genres || !GDT.engine || !GDT.ui) { /* banner */ return; }
```

## Responsabilidades

| Fichero | Responsabilidad | No hace |
|---|---|---|
| `js/data.js` | Bases de datos tipadas con `src` por registro | Ningún texto traducible, ningún formateo |
| `js/engine.js` | Cálculo puro: reparto → puntos T/D → veredicto | No toca el DOM |
| `js/i18n.js` | Diccionario ES/EN, `Intl` y `apply(root)` | Ni un solo número |
| `js/ui.js` | Construcción del DOM de cada sección | No decide estado ni persiste |
| `app.js` | Estado, persistencia, enrutado, cableado ARIA | No contiene datos ni cálculo |
| `styles.css` | Tokens y componentes | — |

La separación importa por una razón concreta: `js/data.js` y `js/engine.js` no dependen del DOM, así que `tests/audit.js` los ejecuta en Node dentro de un `vm` sin necesidad de navegador ni dependencias.

## Estado y persistencia

Un único objeto `state` en `app.js`. La precedencia se define una sola vez:

```
hash de la URL  >  localStorage  >  preferencia del sistema  >  defecto
```

### El almacenamiento tolera el fallo

Bajo `file://` el origen es `null` y algunos navegadores lanzan al tocar `localStorage`. Sin envoltura, una excepción tumbaría el arranque entero. `app.js` sondea una vez y degrada a memoria:

```js
try { localStorage.setItem('__gdt__', '1'); localStorage.removeItem('__gdt__'); }
catch (_) { usable = false; }   // → se guarda en un objeto en memoria
```

Se persisten: idioma, tema, género seleccionado, filtro de plataformas, vista sin color y progreso del roadmap.

## Enrutado

Hash con History API — funciona bajo `file://` (el fragmento no dispara CORS) y da URLs compartibles:

```
#/<seccion>?lang=en&genero=rpg&filtro=ETERNAL
```

- `hashchange` y `popstate` re-renderizan, así que el botón Atrás recorre el historial de secciones.
- El idioma viaja en el enlace: un enlace compartido llega en el idioma en que se compartió, sin depender del `localStorage` de quien lo abre.
- Las ocho secciones son ocho URLs indexables, frente a la única URL de la versión anterior.

## Un detalle no obvio: el panel de fuentes se renderiza siempre

Los chips de referencia de todas las secciones apuntan a anclas (`#src-guia`) que viven en el panel de Fuentes. Como los paneles se renderizan de forma perezosa, esas anclas no existían hasta visitar esa pestaña — y **un enlace a un ancla inexistente incumple WCAG 2.4.1** (lo detectó `pa11y`).

Solución: el panel de fuentes se renderiza en cada `renderAll()`, aunque esté oculto. Y como un ancla dentro de un panel con `hidden` no es navegable, un manejador delegado intercepta el clic, abre la pestaña de fuentes y lleva el foco al ancla.

## Decisiones descartadas

| Alternativa | Por qué no |
|---|---|
| `data/*.json` + `fetch` | Rompe `file://` |
| Módulos ES | Rompe `file://` igual que `fetch` |
| Vite / bundler | Rompe la promesa de «cero instalación» del README |
| Fichero único de 4.000 líneas | Es lo que hace el proyecto de referencia; conflictos de merge garantizados y sin caché granular |
| Font Awesome | ~100 KB por CDN para ~20 iconos, sin SRI, y falla sin conexión bajo `file://`. Sustituido por glifos de texto |
