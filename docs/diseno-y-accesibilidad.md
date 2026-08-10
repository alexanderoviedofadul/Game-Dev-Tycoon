# Diseño y accesibilidad

## Principio

**Todos los pares de color de este proyecto están medidos, no estimados.** Ningún hex se ajustó a ojo ni se retocó a mano para que «pasara».

## Sistema de tokens

Estructura de tres capas en `styles.css`:

1. `:root` — paleta **clara completa**. Ningún token tiene aquí su única definición en otro sitio.
2. `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` — redefine solo los tokens que cambian. El guard permite que el conmutador gane a la preferencia del sistema.
3. `:root[data-theme="dark"]` — el conmutador explícito.

El modo oscuro **no es una inversión automática**: tiene sus propios valores validados contra su propia superficie.

## La paleta del heatmap

Los multiplicadores 0.6 → 1.0 son **magnitud**, así que la escala es secuencial de un solo tono. Nunca arcoíris; nunca semáforo rojo-verde, que codifica polaridad y no magnitud.

### Validación ejecutada

Se usó el validador del skill `dataviz`. El **cian de marca falló**:

```
$ node validate_palette.js "#0e4f5e,#0d7d94,#06b6d4,#58d5e9,#a5e9f4" \
      --ordinal --mode dark --surface "#0f172a"

  [FAIL] Light-end contrast   #0e4f5e at 1.95:1 vs surface — below 2:1 floor
```

Regla del proyecto: si la rampa de marca falla, **no se retoca a mano** — se sustituye por la rampa azul documentada y se vuelve a validar.

```
$ node validate_palette.js "#184f95,#256abf,#3987e5,#6da7ec,#9ec5f4" \
      --ordinal --mode dark --surface "#0f172a"

  [PASS] Lightness monotone · [PASS] Adjacent ΔL · [PASS] Light-end 2.20:1 · [PASS] Single hue 3°
  → ALL CHECKS PASS
```

El modo claro se validó por separado contra su propia superficie (`#f8fafc`), con la rampa en dirección propia. El peldaño 0.8 se movió de `#2a78d6` a `#256abf` porque el texto blanco sobre el primero daba 4.42:1, justo por debajo del mínimo.

### Peldaños finales

| Valor | Claro (fondo / tinta) | Oscuro (fondo / tinta) |
|---|---|---|
| 0.6 | `#86b6ef` / `#0b1220` — 8.87:1 | `#184f95` / `#f8fafc` — 7.75:1 |
| 0.7 | `#5598e7` / `#0b1220` — 6.27:1 | `#256abf` / `#f8fafc` — 5.16:1 |
| 0.8 | `#256abf` / `#ffffff` — 5.39:1 | `#3987e5` / `#08111f` — 5.20:1 |
| 0.9 | `#184f95` / `#ffffff` — 8.10:1 | `#6da7ec` / `#08111f` — 7.56:1 |
| 1.0 | `#0d366b` / `#ffffff` — 11.95:1 | `#9ec5f4` / `#08111f` — 10.58:1 |

Todo el texto de celda supera 4.5:1 en ambos modos.

### Reglas de la visualización

- **El número se imprime en cada celda.** El color nunca es la única señal — cubre daltonismo, impresión y `forced-colors`.
- **Leyenda obligatoria**, con los cinco valores. Cada swatch es un `<button aria-pressed>` que resalta solo ese valor.
- **Vista «sin color»**: es la *misma* tabla despintada, no una segunda implementación que mantener.
- La base semántica es una `<table>` real con `<th scope>`, así que el lector de pantalla recibe el número, no el color.
- En móvil se reduce el padding, **nunca el número**.

## Contrastes corregidos

Dos fallos heredados del CSS anterior, ambos medidos:

| Par | Antes | Ahora |
|---|---|---|
| Texto de la pestaña activa | blanco sobre cian `#06b6d4` — **2.43:1** | cian sobre superficie + borde inferior — **7.35:1** |
| `--clr-subtle` sobre superficie oscura | `#64748b` — **3.75:1** | `#8ba0b8` — **6.65:1** |

El primero era el más grave: es el elemento de navegación principal.

### Medir contra los dos fondos

Hay dos superficies en juego: `--clr-surface` (tarjetas y tablas) y `--clr-bg` (el fondo de página), que es más oscuro. Parte del texto se apoya directamente en el segundo.

Un token que solo se mide contra la superficie falla en cuanto sale de una tarjeta. Ocurrió: `--clr-subtle: #64748b` daba 4.55:1 contra la superficie —correcto— pero **4.08:1** contra el fondo, donde viven los chips de referencia. Corregido a `#5a6b80`.

Tokens verificados contra **ambos** fondos:

| Token | Claro (superficie / fondo) | Oscuro (superficie / fondo) |
|---|---|---|
| texto | 17.89:1 / 17.05:1 | 17.06:1 / 18.4:1 |
| muted | 7.24:1 / 6.92:1 | 6.96:1 / 7.53:1 |
| subtle | `#5a6b80` 5.21:1 / 4.98:1 | `#8ba0b8` 6.65:1 / 7.19:1 |
| acento | `#0e7490` 5.12:1 / 4.89:1 | `#06b6d4` 7.35:1 / 7.95:1 |

El cian de marca `#06b6d4` da 2.32:1 sobre fondo claro, así que el modo claro usa `#0e7490`.

## Patrón ARIA de pestañas

La versión anterior tenía `role="tablist"` y nada más. Ahora:

- `role="tab"` + `aria-selected` + `aria-controls` en cada botón.
- `aria-labelledby` en cada `role="tabpanel"`.
- **Roving tabindex**: solo la pestaña activa tiene `tabindex="0"`.
- Teclado: `←` `→` mueven y activan, `Inicio` y `Fin` van a los extremos, `Tab` sale al panel.
- Los paneles inactivos usan `hidden`.

Sin `onclick` en línea: los manejadores están delegados en el `tablist`.

## Otras decisiones

- **Enlace de salto** al contenido, visible al enfocarlo.
- **`:focus-visible`** con contorno de 3 px en todo elemento interactivo. Antes no existía.
- **Sliders reales** (`<input type="range">`) en vez de `div` decorativos: accesibles por teclado por construcción, con `<label>` y `<output>` asociados.
- **`aria-live="polite"`** en el panel de veredicto y en el contador de progreso, que cambian sin recargar.
- **`prefers-reduced-motion`**: anula animaciones y el scroll suave.
- **`forced-colors`**: retira el patrón de fondo y da borde a las celdas.
- **Hoja de impresión**: despliega los paneles ocultos y oculta la navegación.
- **Prosa bilingüe**: ambos idiomas viven en el DOM con su atributo `lang` correcto —el lector de pantalla necesita saber en qué idioma está el texto— y el CSS muestra solo el activo.

## Resultado

**0 errores WCAG 2.1 AA** (`pa11y`) en las ocho secciones. Un error real que detectó la herramienta: los chips de referencia apuntaban a anclas que solo existían al visitar la pestaña de Fuentes. Ver [arquitectura](arquitectura.md#un-detalle-no-obvio-el-panel-de-fuentes-se-renderiza-siempre).

## Rendimiento

| | Antes | Ahora |
|---|---|---|
| `hero_banner.png` | 1,01 MB | eliminado |
| `gamepad_tycoon.png` | 772 KB, renderizado a 42 px | SVG de 587 B |
| `pixel_bg_pattern.png` | 362 KB en mosaico | gradientes CSS, 0 KB |
| Font Awesome | ~100 KB por CDN, sin SRI | glifos de texto, 0 KB |
| **Total del sitio** | ~2,2 MB | **220 KB** |

De esos 220 KB, 62 KB son la portada Open Graph, que solo descargan los scrapers de redes sociales. La página en sí carga 587 B de assets.

Sin desbordamiento horizontal del `body` en ninguna sección a 400 px de viewport: el contenido ancho (navegación y tablas) hace scroll dentro de su propia caja.
