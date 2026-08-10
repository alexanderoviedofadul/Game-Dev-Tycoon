/**
 * Auditoría de datos y motor. Node puro, sin dependencias ni package.json:
 *   node tests/audit.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);

for (const f of ['js/data.js', 'js/engine.js', 'js/i18n.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
}

const GDT = sandbox.GDT;
const E = GDT.engine;

let failures = 0;
function check(name, ok, detail) {
  if (!ok) failures++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${name}${detail ? ' — ' + detail : ''}`);
}

console.log('\n── DATOS ──────────────────────────────────────────────');

check('6 géneros', GDT.genres.length === 6, `${GDT.genres.length}`);
check('9 campos de desarrollo', GDT.fields.length === 9, `${GDT.fields.length}`);
check('12 temas con matriz completa', GDT.topics.length === 12, `${GDT.topics.length}`);

check('tech + design === 1 en todos los campos',
  GDT.fields.every(f => Math.abs(f.tech + f.design - 1) < 1e-9));

check('cada tema cubre los 6 géneros',
  GDT.topics.every(t => GDT.genreOrder.every(g => typeof t.m[g] === 'number')));

check('multiplicadores dentro de {0.6 … 1.0}',
  GDT.topics.every(t => Object.values(t.m).every(v => v >= 0.6 - 1e-9 && v <= 1 + 1e-9)));

check('cada especialización suma 900 puntos',
  GDT.specializations.every(s => s.design + s.tech === 900));

check('cada género declara regla para los 9 campos',
  GDT.genres.every(g => GDT.fields.every(f => ['+', '~', '-'].includes(g.rules[f.id]))));

const srcKeys = new Set(Object.keys(GDT.sources));
const allRecords = [].concat(
  GDT.fields, GDT.genres, GDT.topics, GDT.platforms, GDT.milestones,
  GDT.researchUnlocks, GDT.penalties, GDT.recruiting, GDT.specializations, GDT.easterEggs
);
check('todas las referencias `src` resuelven a una fuente conocida',
  allRecords.every(r => (r.src || []).every(s => srcKeys.has(s))),
  allRecords.flatMap(r => (r.src || []).filter(s => !srcKeys.has(s))).join(', ') || 'todas ok');

check('ningún coste es string',
  GDT.platforms.every(p => p.devCost === null || typeof p.devCost === 'number'));

console.log('\n── SATISFACIBILIDAD DE LAS 18 FASES ───────────────────');

const audit = E.auditPlans();
const bad = audit.filter(r => !r.satisfiable);
audit.forEach(r => {
  console.log(`  ${r.satisfiable ? 'ok  ' : 'FAIL'}  ${r.genreId.padEnd(11)} F${r.phase}  [${r.pattern}]`);
});
check('las 18 fases admiten al menos un reparto válido', bad.length === 0,
  bad.map(r => `${r.genreId} F${r.phase}`).join(', ') || `${audit.length} fases`);

console.log('\n── MOTOR: INVARIANTES ─────────────────────────────────');

// T + D = 1 sobre repartos aleatorios.
let tdOk = true, ratioMin = Infinity, ratioMax = -Infinity;
for (let i = 0; i < 20000; i++) {
  const pos = {};
  GDT.fields.forEach(f => { pos[f.id] = Math.random(); });
  const pts = E.techDesignPoints(E.allocate(pos));
  if (Math.abs(pts.tech + pts.design - 1) > 1e-9) tdOk = false;
  const r = E.ratioTD(pts);
  ratioMin = Math.min(ratioMin, r); ratioMax = Math.max(ratioMax, r);
}
check('T + D === 1 en 20 000 repartos aleatorios', tdOk);
console.log(`         ratio observado: ${ratioMin.toFixed(3)} … ${ratioMax.toFixed(3)}`);

console.log('\n── PRESETS CALCULADOS DESDE LA GUÍA ───────────────────');

GDT.genres.forEach(g => {
  const s = E.suggestion(g.id);
  if (s.error) { check(`preset ${g.id}`, false, s.error); return; }
  check(
    `${g.id.padEnd(11)} ratio ${s.ratio.toFixed(3)} (objetivo ${g.ratio.td}) — respeta las bandas`,
    s.rules.ok
  );
});

console.log('\n── COHERENCIA INTERNA DE LA GUÍA ──────────────────────');
console.log('  ¿Puede el reparto de sliders, por sí solo, alcanzar el ratio T/D exigido?\n');

const LABEL = { none: 'ok    ', minor: 'menor ', contradiction: 'CONTRA' };

GDT.genres.forEach(g => {
  const gap = E.staffGap(g.id);
  const r = gap.range;
  console.log(`  ${LABEL[gap.severity]} ${g.id.padEnd(11)} objetivo ${String(g.ratio.td).padEnd(5)} rango tolerado ${g.ratio.min}–${g.ratio.max}  ·  alcanzable con sliders ${r.min.toFixed(3)}–${r.max.toFixed(3)}`);
  if (gap.severity !== 'none') {
    console.log(`         → la plantilla debe aportar ×${gap.factor.toFixed(2)} hacia ${gap.direction} (contratación: ${gap.recruiting})`);
  }
});

// Las contradicciones conocidas se fijan como expectativa: si una corrección
// futura de los datos las resuelve, o si aparece una nueva, el test avisa.
const contradictions = GDT.genres
  .filter(g => E.staffGap(g.id).severity === 'contradiction').map(g => g.id).sort();
check('las contradicciones guía-interna son exactamente las conocidas',
  JSON.stringify(contradictions) === JSON.stringify(['action', 'simulation']),
  contradictions.join(', ') || 'ninguna');

console.log('\n── PRESET DE LA COMUNIDAD vs REGLAS DE LA GUÍA ────────');
console.log('  (informativo: documenta dónde discrepan las fuentes)\n');

GDT.genres.forEach(g => {
  const conflicts = E.communityPresetConflicts(g.id);
  const pts = E.techDesignPoints(E.allocate(g.sliders));
  const r = E.ratioTD(pts);
  console.log(`  ${g.id.padEnd(11)} ratio ${r.toFixed(3)}  ${conflicts.length} discrepancia(s)` +
    (conflicts.length ? ': ' + conflicts.map(c => `${c.field} F${c.phase} ${c.mark} ${(c.actual * 100).toFixed(0)}%`).join(', ') : ''));
});

console.log('\n── I18N ───────────────────────────────────────────────');

const DICT = GDT.i18n.DICT;

// Paridad de claves: la deriva es/en se detecta en el build, no en producción.
function flatten(obj, prefix, out) {
  out = out || new Set();
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out.add(key);
  }
  return out;
}
const esKeys = flatten(DICT.es);
const enKeys = flatten(DICT.en);
const onlyEs = [...esKeys].filter(k => !enKeys.has(k));
const onlyEn = [...enKeys].filter(k => !esKeys.has(k));
check('los diccionarios es/en tienen exactamente las mismas claves',
  onlyEs.length === 0 && onlyEn.length === 0,
  [...onlyEs.map(k => 'solo es: ' + k), ...onlyEn.map(k => 'solo en: ' + k)].join(', ') || `${esKeys.size} claves`);

// Cobertura: todo id de los datos debe tener etiqueta en ambos idiomas.
const coverage = [
  ['genre', GDT.genres.map(g => g.id)],
  ['field', GDT.fields.map(f => f.id)],
  ['topic', GDT.topics.map(t => t.id)],
  ['platform', GDT.platforms.map(p => p.id)],
  ['milestone', GDT.milestones.map(m => m.id)],
  ['penalty', GDT.penalties.map(p => p.id)],
  ['recruiting', GDT.recruiting.map(r => r.id)],
  ['research', GDT.researchUnlocks.map(r => r.id)],
  ['easterEgg', GDT.easterEggs.map(e => e.id)]
];
coverage.forEach(([group, ids]) => {
  const missing = [];
  ids.forEach(id => ['es', 'en'].forEach(l => {
    if (!DICT[l][group] || DICT[l][group][id] === undefined) missing.push(`${l}.${group}.${id}`);
  }));
  check(`etiquetas de ${group} (${ids.length})`, missing.length === 0, missing.join(', ') || 'completas');
});

// Todo tema del catálogo completo necesita etiqueta en ambos idiomas.
const catalogIds = GDT.topicCatalog.map(t => t.id);
const missingCatalog = [];
catalogIds.forEach(id => ['es', 'en'].forEach(l => {
  if (DICT[l].topic[id] === undefined) missingCatalog.push(`${l}.${id}`);
}));
check(`etiquetas del catálogo de temas (${catalogIds.length})`,
  missingCatalog.length === 0, missingCatalog.join(', ') || 'completas');

// Coherencia: un tema con multiplicador numérico debe estar en el catálogo.
check('los 12 temas con multiplicador están en el catálogo',
  GDT.topics.every(t => catalogIds.includes(t.id)),
  GDT.topics.filter(t => !catalogIds.includes(t.id)).map(t => t.id).join(', ') || 'todos');

// Los temas de la comunidad también necesitan etiqueta.
const communityIds = [...new Set(Object.values(GDT.communityCombos).flat())];
const missingCommunity = [];
communityIds.forEach(id => ['es', 'en'].forEach(l => {
  if (DICT[l].topic[id] === undefined) missingCommunity.push(`${l}.topic.${id}`);
}));
check(`etiquetas de temas de la comunidad (${communityIds.length})`,
  missingCommunity.length === 0, missingCommunity.join(', ') || 'completas');

// Toda clave usada en js/ui.js debe resolver. Sin esto, una clave mal encajada
// (p. ej. 'verdict.off' cuando vive en el grupo 'ui') se cuela hasta la pantalla
// mostrando su propio nombre en vez del texto.
const uiSrc = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const t = GDT.i18n.t;

const literals = [...uiSrc.matchAll(/\bt\('([^']+)'\)/g)].map(m => m[1]);
const unresolvedLiterals = literals.filter(k => t(k) === k);
check(`claves literales de ui.js resueltas (${literals.length})`,
  unresolvedLiterals.length === 0, unresolvedLiterals.join(', ') || 'todas');

// Claves construidas por concatenación: t('grupo.' + id) — se valida el grupo.
const prefixes = [...new Set([...uiSrc.matchAll(/\bt\('([^']+)\.'\s*\+/g)].map(m => m[1]))];
const badPrefixes = prefixes.filter(p => {
  const parts = p.split('.');
  const group = parts[0];
  if (!DICT.es[group]) return true;
  // Grupo anidado como 'ui.verdict': debe existir al menos una clave con ese prefijo.
  if (parts.length > 1) {
    const sub = parts.slice(1).join('.') + '.';
    return !Object.keys(DICT.es[group]).some(k => k.startsWith(sub));
  }
  return false;
});
check(`prefijos de clave construidos en ui.js (${prefixes.length})`,
  badPrefixes.length === 0, badPrefixes.join(', ') || prefixes.join(', '));

console.log(`\n${failures === 0 ? '✓ Todo en verde' : '✗ ' + failures + ' comprobación(es) fallida(s)'}\n`);
process.exit(failures === 0 ? 0 : 1);
