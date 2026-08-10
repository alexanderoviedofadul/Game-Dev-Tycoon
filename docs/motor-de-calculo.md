# Motor de cálculo

`js/engine.js`. Cálculo puro, sin DOM. Convierte un reparto de sliders en un veredicto.

## El problema

Una guía normal dice «pon el motor alto y el guión bajo». Eso no es accionable: el juego exige un **ratio Tecnología/Diseño** concreto por género (Acción 1.80, Aventura 0.40…), y el jugador no tiene forma de saber qué ratio produce su reparto.

El puente es la tabla de aporte T/D por campo. Con ella, un reparto de tiempo se convierte en puntos.

## De posiciones a cuota de tiempo

Las posiciones de los sliders son anchos de barra (0–100). El **tiempo real** de cada campo es su proporción dentro de la fase:

```
normalizePhase({engine:100, gameplay:80, story:0})
  → { engine: 0.556, gameplay: 0.444, story: 0 }
```

`100 / (100+80+0) = 55,6 %`. Esto importa: la interfaz anterior mostraba «100 % / 80 % / 20 %», tres números que no suman nada y que el jugador no puede trasladar al juego.

Si la fase está entera a cero se reparte uniforme, para que el resto del cálculo siga estando definido.

## De cuota a puntos

Cada fase aporta un tercio del esfuerzo del proyecto:

```
for cada fase p (peso 1/3):
  for cada campo f de p:
    tech   += (1/3) · cuota[f] · fields[f].tech
    design += (1/3) · cuota[f] · fields[f].design

ratio = tech / design
```

**Propiedad:** como las cuotas suman 1 dentro de cada fase y los pesos suman 1, siempre se cumple `T + D = 1`, y por tanto `ratio = T / (1 − T)`. Verificado sobre 20 000 repartos aleatorios en CI.

### Rango teórico alcanzable

Maximizar tecnología significa poner todo en el campo más técnico de cada fase:

| Fase | Campo más técnico | Aporte T |
|---|---|---|
| 1 | `engine` 0.80 | 0.2667 |
| 2 | `ai` 0.80 | 0.2667 |
| 3 | `graphics` **0.50** | 0.1667 |

`T_máx = 0.70` → `ratio_máx = 2.333`. La fase 3 es el cuello de botella: su campo más técnico solo aporta 0.50, así que **ningún reparto puede superar 2.33**, por mucho que se fuerce.

Por el otro extremo, `T_mín = 0.2333` → `ratio_mín = 0.304`.

## Las bandas de tiempo y por qué son inclusivas

La guía enuncia tres reglas: `'+'` >40 %, `'~'` 20–40 %, `'-'` <20 %.

**Se evalúan sobre la cuota intra-fase, no sobre el proyecto.** Demostración: Acción marca seis campos con `'+'`; seis campos con más del 40 % del proyecto completo es imposible con nueve campos que suman 1.

Pero con lectura **estricta** hay fases imposibles. Cualquier patrón `{+, +, ~}` exigiría `>0.40 + >0.40 + ≥0.20 > 1.00`, y las tres posiciones de una fase reparten como mucho el 100 % de esa fase. Afecta a **8 de las 18 fases**:

| Género | Fase | Patrón |
|---|---|---|
| action | 3 | `~ + +` |
| adventure | 3 | `+ + ~` |
| rpg | 2 | `+ + ~` |
| rpg | 3 | `+ + ~` |
| simulation | 1 | `+ + ~` |
| simulation | 3 | `~ + +` |
| strategy | 1 | `+ + ~` |
| strategy | 3 | `~ + +` |

**Resolución:** comparadores inclusivos (`≥0.40`, `[0.20, 0.40]`, `≤0.20`), que hacen el caso frontera `0.40 / 0.40 / 0.20` exactamente satisfacible. La decisión está documentada en el propio código y `auditPlans()` es el test ejecutable que la respalda: si un plan vuelve a volverse imposible, CI falla.

## Presets calculados, no copiados

El reparto recomendado **se busca**, no se transcribe. Así el preset y las reglas nunca pueden contradecirse.

```
GRID = [0, 0.25, 0.50, 0.75, 1.00]

por cada fase:
  candidatos = todos los (a,b,c) de GRID³ (salvo 0,0,0)
               cuya normalización respeta las tres bandas
               → típicamente 5–30 por fase

por cada combinación de candidatos (≲ 27 000):
  ratio = ratioTD(techDesignPoints(allocate(…)))
  coste = |ratio − objetivo| / objetivo
  quedarse con el mínimo
```

Decenas de miles de operaciones triviales, por debajo de 20 ms, y se cachea por género. Si alguna fase no tiene candidatos se devuelve un error explícito en vez de un preset silenciosamente inválido.

## El veredicto

```js
verdictForGenre(ratio, genreId) → { status, ratio, target, min, max, deltaPct, positionInRange }
```

- `|Δ| ≤ 5 %` → **óptimo**
- dentro de `[min, max]` → **aceptable**
- fuera → **fuera de rango**

**Regla de honestidad:** no se emite ningún modificador numérico derivado de la desviación. La fuente dice que desviarse «conlleva reducciones» pero no publica la función. Se muestra estado y distancia; inventar un número aquí sería exactamente el defecto que este rediseño corrige.

## `staffGap` — el hallazgo

Al comparar el rango alcanzable con el rango exigido aparece una contradicción entre dos tablas de la misma fuente:

| Género | Objetivo | Rango tolerado | Alcanzable solo con sliders | Severidad |
|---|---|---|---|---|
| action | 1.80 | 1.44 – 2.40 | **0.948 – 1.344** | contradicción |
| simulation | 1.60 | 1.28 – 2.13 | **0.948 – 1.143** | contradicción |
| strategy | 1.40 | 1.12 – 1.86 | 0.948 – 1.143 | menor |
| casual | 0.50 | 0.25 – 0.75 | 0.613 – 0.899 | menor |
| adventure | 0.40 | 0.15 – 0.65 | 0.389 – 0.667 | — |
| rpg | 0.60 | 0.35 – 0.85 | 0.563 – 0.667 | — |

Dos severidades distintas:

- **`contradiction`** — no se alcanza ni siquiera el rango tolerado. Acción y Simulación.
- **`minor`** — no se clava el óptimo exacto, pero sí se entra en el rango. Estrategia y Casual.

### La reconciliación

No es un error de la fuente. El ratio se mide sobre los **puntos acumulados**, y esos puntos dependen de las habilidades D/T de quien los genera, no solo del reparto de tiempo. La diferencia la aporta la composición de la plantilla — que es exactamente el propósito de los sesgos de contratación: *Algorithms* 1:4 hacia Tecnología, *Showreel* 4:1 hacia Diseño.

Esto conecta dos secciones de la guía que estaban sueltas. `staffGap()` devuelve el factor necesario y el método de contratación recomendado, y la interfaz lo muestra en el panel de veredicto.

`tests/audit.js` fija `['action', 'simulation']` como las contradicciones conocidas: si una corrección futura las resuelve, o si aparece una nueva, el test avisa.

## `qualityProfile` — agregación honesta

De los seis factores de la fórmula del Game Score, la fuente solo publica cifras para uno (compatibilidad tema × género). En vez de fabricar una nota de 0 a 10:

```js
{ modifiers: [...], productKnown, knownCount, unknownCount }
```

Se multiplica solo lo conocido y se declara cuántos factores quedan sin dato publicado.

## API

```js
GDT.engine.normalizePhase(positions, fieldIds)  → { fieldId: cuotaEnFase }
GDT.engine.allocate(positions, phaseWeights?)   → { byPhase, byField, weights }
GDT.engine.techDesignPoints(alloc)              → { tech, design, byField }
GDT.engine.ratioTD(points)                      → number
GDT.engine.verdictForGenre(ratio, genreId)      → { status, deltaPct, … }
GDT.engine.validateTimeRules(alloc, genreId)    → { ok, issues[] }
GDT.engine.suggestAllocation(genreId, opts?)    → { positions, ratio, verdict, rules }
GDT.engine.suggestion(genreId)                  → idem, cacheado
GDT.engine.achievableRange(genreId)             → { min, max }
GDT.engine.staffGap(genreId)                    → { severity, factor, recruiting, … }
GDT.engine.auditPlans()                         → [{ genreId, phase, satisfiable, … }]
GDT.engine.communityPresetConflicts(genreId)    → issues[]
GDT.engine.topicGenreMult(topicId, genreId)     → number | null
GDT.engine.platformMult(platformId, g, a)       → { audience, genrePreferred }
GDT.engine.qualityProfile(ctx)                  → { modifiers, productKnown, unknownCount }
```
