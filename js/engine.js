/**
 * GAME DEV TYCOON — MOTOR DE CÁLCULO
 * ===================================
 * Convierte posiciones de sliders en un veredicto: puntos de Tecnología y Diseño,
 * ratio T/D resultante y contraste contra el rango que exige cada género.
 *
 * Script clásico (no ES module): `import` también falla por CORS bajo `file://`,
 * no solo `fetch`. Depende de que js/data.js se haya cargado antes.
 */

(function (global) {
  'use strict';

  const DATA = global.GDT;
  if (!DATA) throw new Error('engine.js requiere que js/data.js se cargue antes.');

  const fieldById = Object.fromEntries(DATA.fields.map(f => [f.id, f]));
  const genreById = Object.fromEntries(DATA.genres.map(g => [g.id, g]));

  /**
   * Bandas de tiempo de la guía: '+' >40%, '~' 20-40%, '-' <20%.
   *
   * Los comparadores son INCLUSIVOS a propósito. Con lectura estricta, 8 de las
   * 18 fases del juego son aritméticamente insatisfacibles: cualquier fase con
   * patrón {+, +, ~} exigiría >0.40 + >0.40 + >=0.20 > 1.00, y las tres
   * posiciones de una fase reparten como mucho el 100% del tiempo de esa fase.
   *
   * Afecta a: action F3, adventure F3, rpg F2, rpg F3, simulation F1,
   * simulation F3, strategy F1 y strategy F3.
   *
   * Con comparadores inclusivos el caso frontera 0.40 / 0.40 / 0.20 es
   * exactamente satisfacible. `auditPlans()` es el test ejecutable que lo prueba
   * y que fallará si algún plan vuelve a volverse imposible.
   */
  const BANDS = {
    '+': { min: 0.40, max: 1.00 },
    '~': { min: 0.20, max: 0.40 },
    '-': { min: 0.00, max: 0.20 }
  };

  const EPS = 1e-9;

  // Las bandas se evalúan sobre la cuota DENTRO de la fase, no sobre el proyecto:
  // 'action' marca seis campos con '+', y seis campos con >40% del proyecto
  // completo es imposible con nueve campos que suman 1.
  function normalizePhase(positions, fieldIds) {
    const total = fieldIds.reduce((s, id) => s + Math.max(0, positions[id] || 0), 0);
    const out = {};
    if (total <= 0) {
      // Sin asignación no hay reparto significativo: se reparte uniforme para
      // que el resto del cálculo siga siendo definido.
      fieldIds.forEach(id => { out[id] = 1 / fieldIds.length; });
      return out;
    }
    fieldIds.forEach(id => { out[id] = Math.max(0, positions[id] || 0) / total; });
    return out;
  }

  /** Reparto completo: cuota intra-fase y cuota sobre el proyecto entero. */
  function allocate(positions, phaseWeights) {
    const weights = phaseWeights || [1 / 3, 1 / 3, 1 / 3];
    const byPhase = DATA.phases.map(p => normalizePhase(positions, p.fields));
    const byField = {};
    DATA.phases.forEach((p, i) => {
      p.fields.forEach(id => { byField[id] = byPhase[i][id] * weights[i]; });
    });
    return { byPhase, byField, weights };
  }

  /**
   * Puntos de Tecnología y Diseño generados.
   * Como las cuotas suman 1 y cada campo reparte su aporte entre T y D,
   * se cumple siempre T + D = 1, y por tanto ratio = T / (1 - T).
   */
  function techDesignPoints(alloc) {
    let tech = 0, design = 0;
    const byField = {};
    for (const [id, share] of Object.entries(alloc.byField)) {
      const f = fieldById[id];
      const t = share * f.tech;
      const d = share * f.design;
      tech += t; design += d;
      byField[id] = { tech: t, design: d, share };
    }
    return { tech, design, byField };
  }

  function ratioTD(points) {
    return points.design <= EPS ? Infinity : points.tech / points.design;
  }

  /** Veredicto del ratio obtenido frente al rango que exige el género. */
  function verdictForGenre(ratio, genreId) {
    const g = genreById[genreId];
    if (!g) return null;
    const { td: target, min, max } = g.ratio;
    const deltaPct = (ratio - target) / target;

    let status;
    if (Math.abs(deltaPct) <= 0.05) status = 'optimal';
    else if (ratio >= min - EPS && ratio <= max + EPS) status = 'acceptable';
    else status = 'off';

    return {
      status, ratio, target, min, max, deltaPct,
      positionInRange: (ratio - min) / (max - min)
    };
  }

  /** Contrasta el reparto contra las reglas +/~/- del género, fase a fase. */
  function validateTimeRules(alloc, genreId) {
    const g = genreById[genreId];
    if (!g) return { ok: true, issues: [] };
    const issues = [];

    DATA.phases.forEach((p, i) => {
      p.fields.forEach(id => {
        const mark = g.rules[id];
        const band = BANDS[mark];
        const actual = alloc.byPhase[i][id];
        if (actual < band.min - EPS) {
          issues.push({ field: id, phase: p.n, mark, band, actual, direction: 'under' });
        } else if (actual > band.max + EPS) {
          issues.push({ field: id, phase: p.n, mark, band, actual, direction: 'over' });
        }
      });
    });

    return { ok: issues.length === 0, issues };
  }

  // ── BÚSQUEDA DEL REPARTO ÓPTIMO ────────────────────────────────────────────
  // Los presets no se copian de ninguna fuente: se calculan. Se buscan los
  // repartos que respetan las bandas de la guía y, entre ellos, se elige el que
  // deja el ratio T/D más cerca del objetivo del género. Así el preset y las
  // reglas nunca pueden contradecirse.

  const GRID = [0, 0.25, 0.5, 0.75, 1];

  function phaseCandidates(genreId, phaseIndex) {
    const g = genreById[genreId];
    const ids = DATA.phases[phaseIndex].fields;
    const out = [];

    for (const a of GRID) for (const b of GRID) for (const c of GRID) {
      if (a + b + c === 0) continue;
      const positions = { [ids[0]]: a, [ids[1]]: b, [ids[2]]: c };
      const shares = normalizePhase(positions, ids);
      const fits = ids.every(id => {
        const band = BANDS[g.rules[id]];
        return shares[id] >= band.min - EPS && shares[id] <= band.max + EPS;
      });
      if (fits) out.push({ positions, shares });
    }
    return out;
  }

  function suggestAllocation(genreId, opts) {
    const g = genreById[genreId];
    if (!g) return null;
    const weights = (opts && opts.phaseWeights) || [1 / 3, 1 / 3, 1 / 3];

    const cands = [0, 1, 2].map(i => phaseCandidates(genreId, i));
    if (cands.some(c => c.length === 0)) {
      // Fallo explícito antes que un preset silenciosamente inválido.
      return { error: 'unsatisfiable', genreId,
               emptyPhases: cands.map((c, i) => c.length === 0 ? i + 1 : null).filter(Boolean) };
    }

    let best = null;
    for (const x of cands[0]) for (const y of cands[1]) for (const z of cands[2]) {
      const positions = Object.assign({}, x.positions, y.positions, z.positions);
      const alloc = allocate(positions, weights);
      const points = techDesignPoints(alloc);
      const ratio = ratioTD(points);
      const cost = Math.abs(ratio - g.ratio.td) / g.ratio.td;
      if (!best || cost < best.cost) {
        best = { cost, positions, alloc, points, ratio };
      }
    }

    // Se devuelven en la escala 0-100 que usa la interfaz del juego.
    const positions100 = {};
    for (const [id, v] of Object.entries(best.positions)) positions100[id] = Math.round(v * 100);

    return {
      genreId,
      positions: positions100,
      ratio: best.ratio,
      points: best.points,
      verdict: verdictForGenre(best.ratio, genreId),
      rules: validateTimeRules(best.alloc, genreId)
    };
  }

  const suggestionCache = new Map();
  function suggestion(genreId) {
    if (!suggestionCache.has(genreId)) suggestionCache.set(genreId, suggestAllocation(genreId));
    return suggestionCache.get(genreId);
  }

  /**
   * Rango de ratio T/D que los sliders pueden producir sin salirse de las bandas
   * del género. Existe porque las dos tablas de la guía no siempre son
   * compatibles entre sí: para Acción y Simulación, las reglas +/~/- acotan el
   * ratio por debajo del mínimo que la tabla de ratios exige.
   */
  function achievableRange(genreId, phaseWeights) {
    const weights = phaseWeights || [1 / 3, 1 / 3, 1 / 3];
    const cands = [0, 1, 2].map(i => phaseCandidates(genreId, i));
    if (cands.some(c => c.length === 0)) return null;

    let lo = Infinity, hi = -Infinity;
    for (const x of cands[0]) for (const y of cands[1]) for (const z of cands[2]) {
      const positions = Object.assign({}, x.positions, y.positions, z.positions);
      const r = ratioTD(techDesignPoints(allocate(positions, weights)));
      if (r < lo) lo = r;
      if (r > hi) hi = r;
    }
    return { min: lo, max: hi };
  }

  /**
   * Cuánto del ratio objetivo NO pueden aportar los sliders.
   *
   * La guía define el ratio sobre "los puntos finales acumulados de Tecnología y
   * Diseño", y esos puntos dependen tanto del reparto de tiempo como de las
   * habilidades D/T de la plantilla que los genera. Cuando el objetivo del
   * género queda fuera del rango alcanzable solo con sliders, la diferencia la
   * tiene que cubrir la composición del equipo — que es justo lo que persiguen
   * los sesgos de contratación (Algorithms 1:4 hacia Tecnología, Showreel 4:1
   * hacia Diseño).
   */
  function staffGap(genreId) {
    const g = genreById[genreId];
    const range = achievableRange(genreId);
    if (!g || !range) return null;

    const target = g.ratio.td;

    // Dos severidades distintas: no poder clavar el óptimo es una cosa; no poder
    // entrar siquiera en el rango tolerado es una contradicción de la guía.
    const targetReachable = target >= range.min - EPS && target <= range.max + EPS;
    const rangeReachable = g.ratio.max >= range.min - EPS && g.ratio.min <= range.max + EPS;

    const nearest = targetReachable ? target : (target > range.max ? range.max : range.min);
    const severity = rangeReachable ? (targetReachable ? 'none' : 'minor') : 'contradiction';

    return {
      genreId, target, range, targetReachable, rangeReachable, severity,
      // Factor por el que la composición de la plantilla debe desplazar el ratio.
      factor: nearest > 0 ? target / nearest : null,
      direction: targetReachable ? 'none' : (target > range.max ? 'tech' : 'design'),
      recruiting: targetReachable ? null : (target > range.max ? 'algorithms' : 'showreel')
    };
  }

  /**
   * Comprueba que las 18 fases (6 géneros × 3) admiten al menos un reparto
   * válido. Es el test que respalda la decisión de usar bandas inclusivas.
   */
  function auditPlans() {
    const rows = [];
    DATA.genres.forEach(g => {
      DATA.phases.forEach((p, i) => {
        const c = phaseCandidates(g.id, i);
        rows.push({
          genreId: g.id, phase: p.n,
          pattern: p.fields.map(id => g.rules[id]).join(' '),
          satisfiable: c.length > 0,
          example: c.length ? c[0].shares : null
        });
      });
    });
    return rows;
  }

  /** Contrasta el preset publicado por la comunidad con las reglas de la guía. */
  function communityPresetConflicts(genreId) {
    const g = genreById[genreId];
    if (!g) return [];
    return validateTimeRules(allocate(g.sliders), genreId).issues;
  }

  // ── PREPRODUCCIÓN ──────────────────────────────────────────────────────────

  function topicGenreMult(topicId, genreId) {
    const t = DATA.topics.find(x => x.id === topicId);
    return t ? (t.m[genreId] ?? null) : null;
  }

  function platformMult(platformId, genreId, audienceId) {
    const p = DATA.platforms.find(x => x.id === platformId);
    if (!p) return null;
    return {
      audience: p.audienceM ? (p.audienceM[audienceId] ?? null) : null,
      genrePreferred: Array.isArray(p.bestGenres) && p.bestGenres.includes(genreId)
    };
  }

  /**
   * Perfil de calidad honesto: multiplica solo los factores con dato publicado y
   * declara cuántos quedan sin dato, en lugar de inventar una nota de 0 a 10.
   */
  function qualityProfile(ctx) {
    const modifiers = [
      { id: 'topicGenre',    value: topicGenreMult(ctx.topicId, ctx.genreId), src: ['guia'] },
      { id: 'platformGenre', value: null, src: ['guia'] },
      { id: 'tdRatio',       value: null, src: ['guia'] },
      { id: 'sliderTime',    value: null, src: ['guia'] },
      { id: 'bugsCleared',   value: null, src: ['guia'] },
      { id: 'trend',         value: null, src: ['guia'] }
    ];
    const known = modifiers.filter(m => m.value !== null);
    return {
      modifiers,
      productKnown: known.reduce((acc, m) => acc * m.value, 1),
      knownCount: known.length,
      unknownCount: modifiers.length - known.length
    };
  }

  global.GDT.engine = {
    BANDS, normalizePhase, allocate, techDesignPoints, ratioTD,
    verdictForGenre, validateTimeRules, suggestAllocation, suggestion,
    auditPlans, communityPresetConflicts, achievableRange, staffGap,
    topicGenreMult, platformMult, qualityProfile
  };
})(window);
