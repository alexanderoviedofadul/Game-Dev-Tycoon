# CLAUDE.md

Guía interactiva de *Game Dev Tycoon*. HTML/CSS/JS vanilla, sin build step, sin `package.json`, sin dependencias en tiempo de ejecución.

## La regla que gobierna el proyecto

> **Ninguna cifra entra sin fuente.** Donde una fuente no publica un valor, se muestra «sin dato» — nunca una estimación.

Este proyecto existe porque su versión anterior contenía datos inventados que contradecían al juego y a su propia documentación. Si vas a añadir un número, añade también su `src`. Si no tienes fuente, usa `null`.

Corolario: **no inventes valores para rellenar huecos**. La matriz cubre 12 de ~50 temas porque solo hay 12 con multiplicador publicado. Los demás se listan aparte como comunidad, sin cifra.

## Restricción crítica: debe funcionar bajo `file://`

La guía tiene que abrirse **con doble clic** en `index.html`. Eso prohíbe dos patrones que parecen inocentes:

```js
fetch('data/x.json')          // ❌ CORS: origen null
import { x } from './x.js'    // ❌ CORS también, aunque menos conocido
```

Por eso los datos son **scripts clásicos** que escriben en `window.GDT`. No conviertas nada a módulos ES ni muevas datos a JSON.

Cualquier acceso a `localStorage` debe ir envuelto en `try/catch`: bajo `file://` algunos navegadores lanzan.

**Verifica siempre abriendo el fichero desde el Finder, no solo desde `localhost`.**

## Estructura

```
index.html      Ocho paneles vacíos + patrón ARIA de tabs; el contenido lo pinta JS
styles.css      Tokens (claro base, oscuro por media query + data-theme)
app.js          Estado, persistencia, enrutado por hash, cableado ARIA
js/data.js      Datos tipados con `src` por registro       ← sin DOM
js/engine.js    Cálculo T/D y validación de bandas          ← sin DOM
js/i18n.js      Diccionario ES/EN, solo cadenas
js/ui.js        Renderizadores de sección
tests/audit.js  Auditoría en Node puro
docs/           Documentación técnica
```

`js/data.js`, `js/engine.js` e `js/i18n.js` **no tocan el DOM** a propósito: así `tests/audit.js` los ejecuta en Node sin navegador. Mantenlo así.

Orden de carga en `index.html`: `data → engine → i18n → ui → app`.

## Convenciones

- **Datos**: valores numéricos (`650000`, no `"$650.0K"`). El formateo vive en `js/i18n.js` con `Intl`.
- **Textos**: los datos guardan `id`; las etiquetas van en `GDT.i18n.DICT`, con las mismas claves en `es` y `en`. Añadir un idioma no puede tocar un número.
- **Claves i18n**: ojo con el anidamiento. `t('genre.action')` funciona porque `genre` es un grupo raíz; `t('verdict.off')` **no**, porque esas claves viven bajo `ui`. Es `t('ui.verdict.off')`. Hay un test que lo comprueba.
- **Colores**: no inventes hex. Si añades un color, mide su contraste. La paleta del heatmap sale del validador del skill `dataviz` y **no se ajusta a mano**: si falla, se cambia de rampa.
- **Símbolos**: nunca un glifo Unicode junto a la fuente pixel. Press Start 2P no tiene `⊕`, `☀`, `☾` ni casi ningún símbolo, y el navegador los sustituye por otra fuente rompiendo la línea. Usa un icono del sprite de `index.html` (`<use href="#i-...">`), dibujado en rejilla de 8×8.
- **Estética**: bordes duros de 3 px sin `border-radius`, sombras sólidas sin desenfoque y transiciones por `steps()`. La fuente pixel viste el armazón; la prosa va en Inter.
- **Etiquetas de temas y géneros**: deben coincidir con las que muestra el juego en español, porque el jugador busca por lo que tiene delante. Ya se corrigieron «Granja»→«Agricultura», «Hombre lobo»→«Hombres lobo», «Espacio»→«Espacial» y «RPG»→«Rol». El buscador del catálogo también cruza con el nombre en inglés y con el `id`, para que un tema aparezca aunque nuestra traducción no sea la del juego.
- **`js/names.js` es la única excepción a la regla de las fuentes**: genera títulos, que son una ayuda creativa, no un dato. Lo documentado ahí son los patrones de titulación, y la interfaz lo advierte.
- **Idioma**: el proyecto está en español. Comentarios y documentación en español.

## Comandos

```bash
node tests/audit.js                    # datos, motor, i18n
npx html-validate index.html           # marcado
python3 -m http.server 8000            # servidor local
npx pa11y@8 --config .github/pa11y.json "http://localhost:8000/index.html#/matrix?tema=dark"
```

Al auditar accesibilidad, recorre **las nueve secciones por cada uno de los dos temas**. Los paneles se renderizan al seleccionarlos, así que auditar solo la portada deja siete sin cubrir; y cada tema tiene su propio juego de tokens de color.

Fija el tema con `?tema=light|dark`, **no** con `--blink-settings=preferredColorScheme`: esa bandera no da oscuro de forma fiable y su valor por defecto cambia según el entorno. Con ella, la auditoría llegó a probar el tema claro dos veces sin cubrir el oscuro.

## Cosas que no son bugs

- **`action` y `simulation` dan veredicto «fuera de rango» con el preset óptimo.** Es correcto: las dos tablas de la guía se contradicen y el ratio exigido no es alcanzable solo con sliders. La app lo explica y `tests/audit.js` fija esas dos como expectativa. Ver [docs/hallazgos.md](docs/hallazgos.md).
- **Las bandas de tiempo usan comparadores inclusivos.** Con lectura estricta, 8 de las 18 fases serían aritméticamente imposibles. `auditPlans()` lo prueba.
- **El panel de Fuentes se renderiza aunque esté oculto.** Los chips de referencia apuntan a sus anclas, y un enlace a un ancla inexistente incumple WCAG 2.4.1.
- **`--clr-warn` y `--clr-subtle` son más oscuros de lo que parece necesario en modo claro.** Están medidos contra `--clr-bg`, no solo contra `--clr-surface`: hay texto que se apoya en el fondo de página, y ahí los valores «bonitos» caen por debajo de 4.5:1.

## Documentación

| | |
|---|---|
| [docs/arquitectura.md](docs/arquitectura.md) | Por qué scripts clásicos, orden de carga, estado y enrutado |
| [docs/modelo-de-datos.md](docs/modelo-de-datos.md) | Esquemas e invariantes |
| [docs/motor-de-calculo.md](docs/motor-de-calculo.md) | Derivación matemática y API |
| [docs/hallazgos.md](docs/hallazgos.md) | Contradicciones y correcciones, con fuentes |
| [docs/diseno-y-accesibilidad.md](docs/diseno-y-accesibilidad.md) | Tokens, paleta validada, contrastes medidos |
| [docs/verificacion.md](docs/verificacion.md) | Qué comprueba cada test |
