# 🎮 Game Dev Tycoon — Guía Estratégica Basada en Fuentes

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue.svg)](https://alexanderoviedofadul.github.io/Game-Dev-Tycoon/)
[![WCAG 2.1 AA](https://img.shields.io/badge/a11y-WCAG%202.1%20AA-success.svg)](#accesibilidad)
[![Sin dependencias](https://img.shields.io/badge/dependencias-0-success.svg)](#arquitectura)

> *Game Dev Tycoon* es un simulador de optimización cuantitativa: cada decisión aplica un modificador sobre una variable oculta de rendimiento. Esta guía **expone esos números en lugar de describirlos**, y enlaza cada afirmación con la fuente que la respalda.

👉 **[Ver la guía](https://alexanderoviedofadul.github.io/Game-Dev-Tycoon/)**

---

## Qué la diferencia

La mayoría de guías dicen «pon el motor alto y el guión bajo». Esta calcula.

- **La calculadora calcula de verdad.** Mueves los nueve sliders y obtienes el **ratio Tecnología/Diseño resultante**, contrastado contra el rango que exige el género. No son barras decorativas: el cálculo usa el aporte T/D inherente de cada campo de desarrollo (Motor 80/20, Diálogos 10/90, …), que es lo que convierte un reparto de tiempo en puntos.
- **Multiplicadores numéricos, no etiquetas.** La matriz tema × género muestra los valores reales de 0.6 a 1.0. No hay 54 filas marcadas todas como «excelente».
- **Cada dato lleva su fuente.** Los chips ◆ (primaria) y ◇ (comunidad) enlazan a la referencia concreta. Donde una fuente no publica un valor, se muestra *«sin dato»* en lugar de una estimación inventada.
- **Contradicciones expuestas, no ocultas.** La guía documenta dónde sus propias fuentes no cuadran, y explica la reconciliación (ver abajo).

### El hallazgo

Al implementar el motor de cálculo apareció una **contradicción entre dos tablas de la fuente**:

Para **Acción**, las reglas de reparto de tiempo obligan a que la etapa 3 sea Diseño de mundo `~`, Gráficos `+` y Sonido `+` — lo que fija el reparto en 20 % / 40 % / 40 %. Con ese corsé, el ratio T/D máximo alcanzable **solo con sliders es 1.344**. Pero la tabla de ratios exige un mínimo de **1.44**. Lo mismo ocurre en **Simulación** (techo 1.143 frente a un mínimo de 1.28).

No es un error de la guía: es que el ratio se mide sobre los **puntos acumulados**, y esos puntos dependen de las habilidades D/T de quien los genera. La diferencia la aporta la composición de la plantilla — exactamente lo que persiguen los sesgos de contratación (*Algorithms* 1:4 hacia Tecnología). La aplicación lo dice explícitamente en el panel de veredicto y enlaza con la sección de equipo.

`tests/audit.js` fija estas dos contradicciones como expectativa: si una corrección futura de los datos las resuelve, o si aparece una nueva, el test avisa.

---

## Secciones

| Sección | Contenido |
|---|---|
| **Cómo puntúa** | Fórmula del Game Score, los seis factores de calidad (0.6–1.0), la trampa de inflación de puntuación y las cinco penalizaciones automáticas |
| **Progresión** | Ruta crítica con los hitos exactos y checklist persistente. Desbloqueos por investigación con su marca temporal |
| **Matriz** | Heatmap 12 × 6 de multiplicadores tema × género, con leyenda filtrable y vista sin color. Combos de la comunidad listados aparte |
| **Sliders** | Calculadora del ratio T/D con nueve sliders arrastrables, veredicto en vivo y tabla auditable de aporte por campo |
| **Plataformas** | 21 plataformas con costes numéricos, géneros afines y multiplicadores de público |
| **Equipo** | Métodos de contratación y sus sesgos D:T, las nueve especializaciones y el enfriamiento de formación |
| **Extras** | Modo pirata con cifras verificadas, easter eggs y las correcciones aplicadas a versiones previas |
| **Fuentes** | Las once referencias, enlazadas desde cada dato |

---

## Correcciones aplicadas

Versiones anteriores de esta guía contenían afirmaciones sin respaldo. Se verificaron contra fuentes y se corrigieron:

| Afirmación anterior | Realidad documentada |
|---|---|
| «Hasta el 95 % de tus jugadores piratearán» | ≈ **50 % de los ingresos** |
| «Investiga DRM al ingresar a la segunda oficina» | El DRM es un nodo **dentro del árbol de motor propio** |
| «Si caes bajo −$50K la banca te rescata» | **No existe.** Se sobrevive vendiendo acciones de la empresa |
| Juegos AAA con «3D v5 o v6» | **3D v6** y tres especialistas |
| Hitos de progresión inventados | Ruta crítica citada: Oficina 3 en Año 13 M9 S2 + $16M + **4** empleados |
| Sliders de Aventura con Gráficos y Sonido invertidos | Corregido contra la tabla de la fuente |

---

## Arquitectura

Sin build step, sin `package.json`, sin dependencias en tiempo de ejecución. **Abre `index.html` con doble clic y funciona.**

```
index.html      Estructura, metadatos y los ocho paneles
styles.css      Tokens de diseño, tema claro y oscuro
app.js          Arranque, enrutado por hash, estado y persistencia
js/data.js      Bases de datos tipadas, con fuente por registro
js/engine.js    Motor de cálculo T/D y validación de reglas de tiempo
js/i18n.js      Diccionario ES/EN (solo cadenas, ni un número)
js/ui.js        Renderizadores de cada sección
tests/audit.js  Auditoría de datos, motor e i18n (Node puro)
```

**Por qué `js/data.js` y no `data/*.json`:** bajo `file://` fallan tanto `fetch()` como `import` de módulos ES, ambos por CORS. Los datos se cargan como script clásico sobre un espacio de nombres global, que es el único patrón que sobrevive a `file://` **y** a GitHub Pages sin build.

### Modelo de datos

Todo valor cuantitativo es `number` — nunca `"$650.0K"`. El formateo vive en la capa de presentación vía `Intl.NumberFormat`, lo que permite ordenar, filtrar con exactitud y escalar colores. Cada registro declara `src` con las claves de las fuentes que lo respaldan.

El i18n indexa por los mismos `id` que los datos, así que **añadir un idioma no puede alterar un multiplicador**.

---

## Verificación

```bash
node tests/audit.js          # datos, motor e i18n
npx html-validate index.html # marcado
npx pa11y --standard WCAG2AA http://localhost:8000/index.html
python3 -m http.server 8000  # y también: abrir index.html con doble clic
```

`tests/audit.js` comprueba, entre otras cosas:

- Que `tech + design === 1` en los nueve campos y que cada especialización suma 900 puntos.
- Que las **18 fases** (6 géneros × 3) admiten al menos un reparto válido. Con lectura estricta de las bandas de tiempo, ocho de ellas serían aritméticamente imposibles: `{+, +, ~}` exigiría `>0.40 + >0.40 + ≥0.20 > 1.00`. Por eso los comparadores son inclusivos, y este test es la prueba ejecutable de esa decisión.
- Que `T + D === 1` en 20 000 repartos aleatorios.
- Que los diccionarios ES y EN tienen exactamente las mismas claves, y que toda clave usada en `js/ui.js` resuelve.
- Que toda referencia `src` apunta a una fuente existente.

---

## Accesibilidad

- Patrón ARIA de pestañas completo: `role="tab"`, `aria-selected`, `aria-controls`, *roving tabindex* y navegación con ←/→/Inicio/Fin.
- **0 errores WCAG 2.1 AA** (`pa11y`) en las ocho secciones.
- Todos los pares de color están **medidos**, no estimados. Se corrigieron dos fallos heredados: el texto de la pestaña activa (2.43:1) y `--clr-subtle` (3.75:1).
- La paleta del heatmap salió del validador del skill *dataviz*: rampa secuencial de un solo tono, con **peldaños propios para claro y para oscuro**, no una inversión automática. El cian de marca se descartó por fallar el suelo de contraste en oscuro.
- El número se imprime en **cada celda** del heatmap: el color nunca es la única señal. Hay además vista «sin color».
- `prefers-reduced-motion`, `forced-colors` y hoja de impresión contempladas.

## Rendimiento

| | Antes | Ahora |
|---|---|---|
| Assets | 2,1 MB en tres PNG | 587 B (favicon SVG) |
| Iconos | Font Awesome completo, ~100 KB por CDN | Glifos de texto, 0 KB |
| Fondo | PNG de 362 KB en mosaico | Gradientes CSS |
| Total del sitio | ~2,2 MB | **216 KB** (62 KB son la portada OG, que solo cargan los scrapers) |

---

## Documentación

| Documento | De qué trata |
|---|---|
| [Arquitectura](docs/arquitectura.md) | Por qué scripts clásicos y no módulos ES, orden de carga, estado y enrutado |
| [Modelo de datos](docs/modelo-de-datos.md) | Esquema de cada tabla, invariantes y aislamiento del i18n |
| [Motor de cálculo](docs/motor-de-calculo.md) | Derivación matemática del ratio T/D y API completa |
| [Hallazgos y correcciones](docs/hallazgos.md) | Las contradicciones halladas y la verificación de cada afirmación |
| [Diseño y accesibilidad](docs/diseno-y-accesibilidad.md) | Tokens, validación de la paleta y contrastes medidos |
| [Verificación](docs/verificacion.md) | Qué comprueba cada test y qué revisar a mano |
| [Guía Magistral](docs/Guia-Completa-Game-Dev-Tycoon.md) | El documento fuente del que deriva todo |

Para trabajar en el repositorio con asistentes de IA, [CLAUDE.md](CLAUDE.md) recoge las convenciones y las trampas conocidas.

## Contribuir

Si encuentras un dato incorrecto, abre un issue **con la fuente**. La regla del proyecto es que ninguna cifra entra sin referencia: es preferible mostrar «sin dato» a mostrar una estimación.

Consulta la [Guía de Contribución](CONTRIBUTING.md).

## Licencia

MIT — ver [LICENSE](LICENSE).

## Autor

**Alexander Oviedo Fadul** — [GitHub](https://github.com/alexanderoviedofadul)

---

<div align="center">

*Guía no oficial. Game Dev Tycoon es propiedad de [Greenheart Games](https://www.greenheartgames.com/).*

</div>
