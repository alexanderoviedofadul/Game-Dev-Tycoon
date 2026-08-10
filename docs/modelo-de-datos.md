# Modelo de datos

Todo vive en `js/data.js` bajo `window.GDT`.

## Tres reglas

1. **Todo valor cuantitativo es `number`.** `devCost: 650000`, nunca `"$650.0K"`. El formateo es responsabilidad de la capa de presentación vía `Intl.NumberFormat`. Esto permite ordenar, filtrar con exactitud, escalar colores y calcular — nada de eso es posible con un string formateado, que es como estaban los datos antes.
2. **Los registros guardan `id`, nunca texto traducible.** Las etiquetas viven en `js/i18n.js` indexadas por el mismo `id`. Consecuencia buscada: **añadir un idioma no puede alterar un multiplicador**.
3. **Todo registro declara `src`** con las claves de `GDT.sources` que lo respaldan. `tests/audit.js` falla si una clave no resuelve.

## `GDT.sources`

Once fuentes, cada una con `kind: 'primary' | 'community'`. La interfaz las distingue con chips ◆ y ◇, y cada chip enlaza al ancla correspondiente.

```js
guia: { label: 'Guía Magistral (docs/)', url: 'docs/…', kind: 'primary' }
```

## `GDT.fields` — los nueve campos de desarrollo

La tabla que hace posible todo el cálculo. Sin ella, una calculadora de sliders solo puede pintar barras.

| Campo | Fase | Tecnología | Diseño |
|---|---|---|---|
| `engine` | 1 | 0.80 | 0.20 |
| `gameplay` | 1 | 0.20 | 0.80 |
| `story` | 1 | 0.20 | 0.80 |
| `dialogues` | 2 | 0.10 | 0.90 |
| `levelDesign` | 2 | 0.60 | 0.40 |
| `ai` | 2 | 0.80 | 0.20 |
| `worldDesign` | 3 | 0.40 | 0.60 |
| `graphics` | 3 | 0.50 | 0.50 |
| `sound` | 3 | 0.40 | 0.60 |

**Invariante:** `tech + design === 1` en los nueve. Verificado en CI.

`GDT.phases` fija el orden canónico dentro de cada fase — el mismo que muestra el juego. La versión anterior lo tenía mal: renderizaba la fase 2 como *IA / Nivel / Diálogos* cuando el orden real es *Diálogos / Nivel / IA*.

## `GDT.genres`

Cada género lleva **tres cosas de dos fuentes distintas**, conservadas a propósito:

```js
{
  id: 'action',
  ratio:   { td: 1.80, techPct: 64.0, designPct: 36.0, min: 1.44, max: 2.40 },
  sliders: { engine: 100, gameplay: 80, story: 0, … },   // preset de la comunidad
  rules:   { engine: '+', gameplay: '+', story: '-', … }, // bandas de la guía
  src: ['guia', 'forum7705']
}
```

- `ratio` — exigencia T/D del género y rango tolerado (guía).
- `rules` — banda de tiempo por campo: `'+'` >40 %, `'~'` 20–40 %, `'-'` <20 % (guía).
- `sliders` — posiciones concretas publicadas por el foro de Greenheart.

Las dos últimas **discrepan en varios campos**. No se elige una y se descarta la otra: el motor marca la discrepancia y la interfaz ofrece ambos presets. Ver [hallazgos](hallazgos.md).

## `GDT.topics` — la matriz

Doce temas con la matriz completa 12 × 6 de multiplicadores de compatibilidad, valores discretos en `{0.6, 0.7, 0.8, 0.9, 1.0}`.

```js
{ id: 'aliens', m: { action: 1.0, adventure: 0.8, rpg: 1.0,
                     simulation: 0.6, strategy: 0.9, casual: 0.7 }, src: ['guia'] }
```

**Lo que no se hace:** el juego tiene ~50 temas, pero la fuente solo publica la matriz de 12. Los demás no reciben un multiplicador inventado — van a `GDT.communityCombos`, una lista por género de combos reportados como buenos, que la interfaz muestra **aparte y etiquetados como comunidad**.

Esta es la diferencia concreta con la versión anterior, que tenía 54 filas planas marcadas todas como «excelente», sin un solo número.

## `GDT.platforms`

21 plataformas con costes numéricos y multiplicadores de público.

```js
{ id: 'pc', real: 'PC', year: 1, month: 1, devCost: 30000, licCost: 0,
  eternal: true, bestGenres: ['simulation', 'strategy', 'rpg', 'action'],
  audienceM: { young: null, everyone: 1.15, mature: 1.30 }, src: ['guia'] }
```

**`null` significa «la fuente no publica este valor»**, no cero. La interfaz lo renderiza como *«sin dato publicado»*. De las 21 plataformas, solo las que la guía documenta tienen multiplicador; el resto lo declara ausente en lugar de estimarlo.

## `GDT.milestones` y `GDT.researchUnlocks`

Requisitos tipados en vez de prosa, lo que permite renderizarlos como checklist:

```js
{ id: 'office3', stage: 2, cash: 16000000, year: 13, month: 9, week: 2, staff: 4, rp: 0 }
{ id: 'rndLab',  stage: 3, cash: 5000000, rp: 100,
  specialist: 'design', specialistPts: 700 }
```

Estas cifras sustituyen a las inventadas de la versión anterior (que decía «$16M, hasta 6 empleados» cuando son **4**).

## `GDT.specializations` — derivadas, no transcritas

Los requisitos de especialización son exactamente 900 puntos repartidos según el aporte T/D del campo. En vez de transcribir nueve pares de números —y arriesgar una errata—, se derivan:

```js
const specializations = fields.map(f => ({
  id: f.id,
  design: Math.round(900 * f.design),
  tech:   Math.round(900 * f.tech),
  level: 7, rp: 200, cost: 5000000
}));
```

**Invariante:** `design + tech === 900`. Verificado en CI.

## `GDT.pirateMode`, `GDT.easterEggs`, `GDT.penalties`, `GDT.recruiting`, `GDT.training`

Tablas menores con la misma disciplina: valores numéricos, `id` sin texto, `src` obligatorio. Las cifras de `pirateMode` sustituyen a las falsas de la versión anterior — ver [hallazgos](hallazgos.md).

## El i18n no puede romper los números

```js
GDT.i18n.DICT = {
  es: { genre: { action: 'Acción' }, field: { engine: 'Motor' }, … },
  en: { genre: { action: 'Action' }, field: { engine: 'Engine' }, … }
};
```

Solo cadenas. La auditoría comprueba:

- **Paridad de claves**: la diferencia simétrica entre `es` y `en` debe ser vacía (252 claves).
- **Cobertura**: todo `id` de los datos tiene etiqueta en ambos idiomas.
- **Resolución**: toda clave usada en `js/ui.js` resuelve, incluidas las construidas por concatenación (`t('genre.' + id)`). Este último test existe porque una clave mal encajada llegó a pantalla mostrando `verdict.off` en vez de «Fuera de rango».
