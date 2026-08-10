# Hallazgos y correcciones

Registro de lo que se encontró al contrastar `index.html` con la guía de `docs/`, y de la verificación de cada afirmación dudosa.

## 1. La guía no estaba en la aplicación

Cobertura del contenido de `docs/Guia-Completa-Game-Dev-Tycoon.md` en la versión anterior de `index.html`:

| Contenido de la guía | Estado anterior |
|---|---|
| Fórmula del Game Score y modificadores 0.6–1.0 | ausente |
| Trampa de inflación de puntuación | ausente — **es la mecánica central del juego** |
| Tabla de 5 penalizaciones algorítmicas | ausente |
| Matriz tema × género con multiplicadores | sustituida por 54 filas planas, todas `rating:"Great"`, sin un número |
| Multiplicadores plataforma × público | ausente; `audience` era texto libre |
| Ratios T/D por género | ausente |
| Aporte T/D por componente | ausente — sin esto no puede existir una calculadora |
| Configuración de sliders 9 × 6 | aproximada y contradictoria |
| Sesgos D:T de reclutamiento | ausente |
| 9 especializaciones | ausente |
| Enfriamiento de formación | ausente |
| Hitos exactos de progresión | contradictorios |
| 11 obras citadas | ausentes |

Aproximadamente **el 75 % del contenido faltaba**, y donde ambos documentos se solapaban, se contradecían.

## 2. Afirmaciones falsas, verificadas y corregidas

La pestaña *Pirate Mode* contenía cifras sin respaldo. Cada una se contrastó con fuentes:

| Afirmación anterior | Realidad documentada | Fuente |
|---|---|---|
| «hasta el 95 % de tus jugadores piratearán» | ≈ **50 % de los ingresos** | [Steam — How to win Pirate Mode](https://steamcommunity.com/sharedfiles/filedetails/?id=1925911074) |
| «Investiga DRM al ingresar a la segunda oficina» | El DRM es un **nodo dentro del árbol de motor propio**; v5 aguanta hasta tarde, v6 exige el Laboratorio de I+D | ídem |
| «Si tus fondos caen por debajo de −$50K, la banca te ofrecerá un rescate» | **No existe tal rescate.** Se sobrevive vendiendo acciones de la empresa (~20 % inicial, recompra ~$275K) | ídem |
| Juegos AAA con «3D v5 **o** v6» | **3D v6** y tres especialistas asignados | guía |

Los easter eggs sí eran correctos, pero la lista estaba incompleta. Se ampliaron con Wing Commander, Doom, Half-Life, Theme Hospital, Halo, Star Citizen, Okami, el encargo de barriles rojos de Dave Johnson y el 11/10 aleatorio ([GDT Wiki — Easter Eggs](https://gamedevtycoon.fandom.com/wiki/Easter_Eggs)).

## 3. Hitos de progresión inventados

| | Versión anterior | Guía (fuente 4) |
|---|---|---|
| Oficina 2 | «Años 3–8, $1M en caja» | $1.000.000 |
| Mejora Oficina 2 | no existía | Año 11 M6 S2 + $5M + 2 empleados |
| Oficina 3 | «$16M, hasta **6** empleados» | Año 13 M9 S2 + $16M + **4** empleados |
| Laboratorio de I+D | «$5M» | $5M + 100 RP + Especialista Diseño (D ≥ 700) |
| Laboratorio de Hardware | sin cuantificar | $5M + 100 RP + Especialista Tech (T ≥ 700) |
| Consola propia | sin cifra | reserva recomendada > $200M |

## 4. Sliders contradictorios

La guía define reglas de **tiempo**; `slidersDB` guardaba anchos de barra 100/80/20 que nunca se normalizaban. Además contradecía la tabla en varios campos:

- **Aventura, fase 3**: la guía pide Gráficos `+` y Sonido `~`; el código ponía `sound: 80, graphics: 40` — invertido.
- **Casual, fase 1**: la guía pide Motor `-` (<20 %); el código ponía `engine: 80`.
- **RPG, fase 1**: la guía pide Motor `-`; el código ponía `engine: 40`.

También estaba mal el **orden canónico de los campos**: la fase 2 se renderizaba como *IA / Nivel / Diálogos* cuando el orden del juego (y de la guía) es *Diálogos / Nivel / IA*.

## 5. Las bandas de tiempo son insatisfacibles en lectura estricta

Descubierto al implementar el motor. Cualquier fase con patrón `{+, +, ~}` exigiría `>0.40 + >0.40 + ≥0.20 > 1.00`. **8 de las 18 fases** están afectadas.

Resolución: comparadores inclusivos, documentados en el código y respaldados por `auditPlans()` en CI. Derivación completa en [motor de cálculo](motor-de-calculo.md).

## 6. Las dos tablas de la guía se contradicen

El hallazgo de más calado. Para **Acción**, las reglas de sliders de la guía fijan la fase 3 en 20 / 40 / 40, lo que topa el ratio T/D alcanzable **solo con sliders en 1.344**. Pero su propia tabla de ratios exige un mínimo de **1.44**. Igual en **Simulación**: techo 1.143 frente a mínimo 1.28.

No es un error: el ratio se mide sobre puntos acumulados, que dependen de las habilidades D/T de la plantilla. La diferencia la cubre la composición del equipo, que es el propósito de los sesgos de contratación.

La aplicación lo expone en el panel de veredicto en lugar de ocultarlo, y `tests/audit.js` fija las dos contradicciones como expectativa.

## 7. Discrepancias entre fuentes en los presets

El preset del foro de Greenheart y las bandas de la guía no coinciden en todos los campos:

| Género | Discrepancias del preset comunitario frente a las bandas de la guía |
|---|---|
| action | `worldDesign` al 0 % cuando la banda pide `~` |
| adventure | `gameplay`, `levelDesign` y `sound` al 0 % cuando piden `~` |
| rpg | `ai` y `sound` al 0 % cuando piden `~` |
| simulation | `story` y `worldDesign` al 0 % cuando piden `~` |
| strategy | `story` al 0 %, `worldDesign` al 56 % y `graphics` al 0 % |
| casual | ninguna |

**No se elige una fuente y se descarta la otra.** El preset recomendado se **calcula** dentro de las bandas de la guía minimizando la distancia al ratio objetivo, y el preset comunitario se ofrece aparte como alternativa. `communityPresetConflicts()` documenta las diferencias.

## 8. Cobertura incompleta de la matriz

El juego tiene ~50 temas; la guía publica la matriz de multiplicadores solo para 12.

**Decisión:** se implementan los 12 con cifra citada. Los demás no reciben un multiplicador inventado — se listan aparte, por género, como combos de la comunidad y etiquetados como tales. Preferimos una matriz honesta de 12 × 6 a una de 50 × 6 con 456 celdas fabricadas.

## Fuentes verificadas

| Clave | Fuente | Tipo |
|---|---|---|
| `guia` | Guía Magistral (`docs/`) | primaria |
| `wiki139` | [GDT Wiki — Game Development 1.3.9](https://gamedevtycoon.fandom.com/wiki/Game_Development/1.3.9) | primaria |
| `wiki144` | [GDT Wiki — Review Algorithm 1.4.4](https://gamedevtycoon.fandom.com/wiki/Review_Algorithm/1.4.4) | primaria |
| `wikiEE` | [GDT Wiki — Easter Eggs](https://gamedevtycoon.fandom.com/wiki/Easter_Eggs) | primaria |
| `forum7705` | [Foro Greenheart — Combinaciones y sliders](https://forum.greenheartgames.com/t/great-combinations-list-time-allocation-sliders/7705) | comunidad |
| `forum5442` | [Foro Greenheart — Formación de empleados](https://forum.greenheartgames.com/t/how-to-train-your-employees/5442) | comunidad |
| `steamUltimate` | [Steam — Ultimate Guide](https://steamcommunity.com/sharedfiles/filedetails/?id=216784744) | comunidad |
| `steamSpecialists` | [Steam — Specialists & Development](https://steamcommunity.com/sharedfiles/filedetails/?id=1842635307) | comunidad |
| `steamPirate` | [Steam — How to win Pirate Mode](https://steamcommunity.com/sharedfiles/filedetails/?id=1925911074) | comunidad |
| `gamefaqs` | [GameFAQs — Training Guide](https://gamefaqs.gamespot.com/pc/713603-game-dev-tycoon/faqs/67064) | comunidad |
| `reddit178` | [Reddit — Simple(-ish) guide for 1.7.8](https://www.reddit.com/r/GameDevTycoon/comments/1o1nmk2/simpleish_guide_for_178/) | comunidad |

La fórmula real del Game Score procede de la wiki (*Review Algorithm 1.4.4*) y es más precisa que la prosa de la guía:

```
Game_score = Design_and_Tech × Quality × Platform_x_Genre × Topic_x_Audience × Bug_Ratio × Trend_Factor
```

Multi-género: `T/G = (T/G₁ × 2 + T/G₂) / 3`.

## Nota de método

Fandom devuelve `HTTP 402` a la obtención automatizada, así que las cifras de la wiki se verificaron por búsqueda y por fuentes que las citan. Lo que no pudo confirmarse **no se implementó**: quedó como `null` y la interfaz lo muestra como «sin dato publicado».
