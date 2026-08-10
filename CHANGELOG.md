# Historial de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-08-09

Reescritura completa. La guía pasa de describir el juego a **calcularlo**: los datos
se derivan de fuentes citadas, son numéricos y computables, y la calculadora produce
un veredicto en lugar de barras decorativas.

### Añadido
- **Sección «Cómo puntúa»**: fórmula del Game Score, los seis factores de calidad
  (0.6–1.0), la trampa de inflación de puntuación y la tabla de cinco penalizaciones
  automáticas. Ninguno de estos contenidos existía.
- **Motor de cálculo real** (`js/engine.js`): convierte las posiciones de los nueve
  sliders en puntos de Tecnología y Diseño usando el aporte T/D inherente de cada
  campo, y contrasta el ratio resultante con el rango que exige el género.
- **Presets calculados, no copiados**: el reparto recomendado se busca dentro de las
  bandas de tiempo de la guía minimizando la distancia al ratio objetivo, así que
  preset y reglas nunca pueden contradecirse.
- **Detección de contradicciones entre fuentes**: la aplicación informa de que, para
  Acción y Simulación, el ratio exigido no es alcanzable solo con sliders (techos de
  1.344 y 1.143 frente a mínimos de 1.44 y 1.28), y explica que la diferencia la
  aporta la composición de la plantilla.
- **Heatmap 12 × 6** de multiplicadores tema × género con leyenda filtrable, vista
  sin color y el valor impreso en cada celda.
- **Sección «Equipo»**: métodos de contratación con sus sesgos D:T, las nueve
  especializaciones y el enfriamiento de formación.
- **Sección «Fuentes»** con once referencias, enlazadas desde cada dato mediante
  chips ◆ (primaria) y ◇ (comunidad).
- **Conmutador ES/EN** con diccionario único, `lang` correcto y el idioma incluido
  en el enlace compartible.
- **Enlace profundo por hash**: cada sección tiene su URL, el botón Atrás funciona y
  recargar conserva el estado.
- **Tema claro** con juego de tokens propio, además del oscuro.
- **Persistencia** de pestaña, idioma, tema, filtros y progreso del roadmap.
- **`tests/audit.js`**: auditoría en Node puro de datos, motor e i18n.
- **Integración continua** (`.github/workflows/ci.yml`): auditoría, validación de HTML
  y accesibilidad sección por sección en cada push y pull request.
- **Documentación técnica** en `docs/`: arquitectura, modelo de datos, motor de
  cálculo, hallazgos y correcciones, diseño y accesibilidad, y verificación.
- **`CLAUDE.md`** con las convenciones del repositorio y las trampas conocidas.

### Corregido
- La piratería en Pirate Mode cuesta ≈50 % de los ingresos, no «hasta el 95 % de tus
  jugadores».
- El DRM es un nodo del árbol de motor propio, no una investigación ligada a la
  segunda oficina.
- Eliminado el inexistente «rescate bancario si caes bajo −$50K»: la vía documentada
  es vender acciones de la empresa.
- Los juegos AAA exigen motor 3D v6, no «v5 o v6».
- Hitos de progresión sustituidos por los de la ruta crítica citada (Oficina 3 en
  Año 13 M9 S2 con $16M y **4** empleados, no 6).
- Sliders de Aventura: Gráficos y Sonido estaban invertidos respecto a la fuente.
  Casual y RPG asignaban Motor por encima de su banda.
- Contraste del texto de la pestaña activa (2.43:1) y de `--clr-subtle` (3.75:1),
  ambos por debajo del mínimo AA.
- Patrón ARIA de pestañas completado: faltaban `role="tab"`, `aria-selected`,
  `aria-controls` y la navegación por flechas.

### Cambiado
- Los datos salen de `app.js` a `js/data.js` y pasan a ser numéricos tipados
  (`650000`, no `"$650.0K"`), con `src` por registro.
- Los 54 combos planos, todos marcados «excelente», se sustituyen por la matriz de
  multiplicadores. Los combos sin cifra publicada se listan aparte como comunidad.
- Assets: de 2,1 MB en tres PNG a 587 B (favicon SVG); el mosaico de fondo pasa a
  gradientes CSS.

### Eliminado
- Font Awesome (~100 KB por CDN, sin SRI) en favor de glifos de texto.
- `assets/hero_banner.png`, `assets/gamepad_tycoon.png` y
  `assets/pixel_bg_pattern.png`, ya sin uso.

## [1.0.0] - 2026-08-09

### Añadido
- **Hoja de Ruta Estratégica**: Guía detallada de progresión en 4 etapas (Garaje, Oficina Pequeña, Estudio Grande y Laboratorio I+D).
- **Calculadora Interactiva de Sliders**: Ajustador dinámico por género (Acción, Aventura, Casual, RPG, Simulación, Estrategia) para Etapas 1, 2 y 3.
- **Matriz de Sinergias (Combos)**: Base de datos filtrable de Temas + Géneros + Público Objetivo.
- **Cronología de Consolas**: Tabla interactiva de plataformas, años de salida, cuotas de mercado y consolas permanentes.
- **Sección de Laboratorio I+D, AAA & MMOs**: Guía avanzada de servidores, expansiones y consolas personalizadas.
- **Sección Modo Antipiratería (Pirate Mode) & Trucos**: Consejos para superar DRM, piratería y easter eggs ocultos.
- **Diseño UI/UX Glassmorphism**: Tema futurista en modo oscuro con tipografía pixel y responsividad total.
- **Assets Gráficos Exclusivos**: Banner heroico e icono estilo Game Dev Tycoon.
