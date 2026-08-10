/**
 * GAME DEV TYCOON — BASE DE DATOS
 * ================================
 * Fichero .js plano (no .json) a propósito: `fetch()` de un JSON local falla por
 * CORS bajo `file://`, y la guía debe funcionar abriendo index.html con doble clic.
 *
 * Reglas del modelo:
 *  1. Todo valor cuantitativo es `number`. El formateo vive en la capa de presentación.
 *  2. Los registros guardan `id`, nunca texto traducible. Las etiquetas viven en GDT.i18n.
 *  3. Todo registro declara `src` con las claves de GDT.sources que lo respaldan.
 */

window.GDT = (function () {
  'use strict';

  // ── FUENTES ────────────────────────────────────────────────────────────────
  // Cada dato de la interfaz enlaza a la fuente que lo respalda.
  const sources = {
    guia: {
      label: 'Guía Magistral (docs/)',
      url: 'docs/Guia-Completa-Game-Dev-Tycoon.md',
      kind: 'primary'
    },
    wiki139: {
      label: 'GDT Wiki — Game Development 1.3.9',
      url: 'https://gamedevtycoon.fandom.com/wiki/Game_Development/1.3.9',
      kind: 'primary'
    },
    wiki144: {
      label: 'GDT Wiki — Review Algorithm 1.4.4',
      url: 'https://gamedevtycoon.fandom.com/wiki/Review_Algorithm/1.4.4',
      kind: 'primary'
    },
    wikiEE: {
      label: 'GDT Wiki — Easter Eggs',
      url: 'https://gamedevtycoon.fandom.com/wiki/Easter_Eggs',
      kind: 'primary'
    },
    forum7705: {
      label: 'Foro Greenheart — Combinaciones y sliders',
      url: 'https://forum.greenheartgames.com/t/great-combinations-list-time-allocation-sliders/7705',
      kind: 'community'
    },
    forum5442: {
      label: 'Foro Greenheart — Formación de empleados',
      url: 'https://forum.greenheartgames.com/t/how-to-train-your-employees/5442',
      kind: 'community'
    },
    steamUltimate: {
      label: 'Steam — Ultimate Guide',
      url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=216784744',
      kind: 'community'
    },
    steamSpecialists: {
      label: 'Steam — Specialists & Development',
      url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1842635307',
      kind: 'community'
    },
    steamPirate: {
      label: 'Steam — How to win Pirate Mode',
      url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1925911074',
      kind: 'community'
    },
    gamefaqs: {
      label: 'GameFAQs — Training Guide',
      url: 'https://gamefaqs.gamespot.com/pc/713603-game-dev-tycoon/faqs/67064',
      kind: 'community'
    },
    steam1365613422: {
      label: 'Steam — Combinaciones nuevas de la v1.6',
      url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1365613422',
      kind: 'community'
    },
    steam1577227575: {
      label: 'Steam — Todas las combinaciones tema/público (v1.6)',
      url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1577227575',
      kind: 'community'
    },
    reddit178: {
      label: 'Reddit — Simple(-ish) guide for 1.7.8',
      url: 'https://www.reddit.com/r/GameDevTycoon/comments/1o1nmk2/simpleish_guide_for_178/',
      kind: 'community'
    }
  };

  // ── CAMPOS DE DESARROLLO ───────────────────────────────────────────────────
  // El aporte inherente T/D de cada campo. Esta tabla es lo que hace posible
  // calcular el ratio Tecnología/Diseño real a partir de las posiciones de los
  // sliders — sin ella la calculadora solo puede pintar barras decorativas.
  const fields = [
    { id: 'engine',      phase: 1, tech: 0.80, design: 0.20, src: ['guia', 'wiki139'] },
    { id: 'gameplay',    phase: 1, tech: 0.20, design: 0.80, src: ['guia', 'wiki139'] },
    { id: 'story',       phase: 1, tech: 0.20, design: 0.80, src: ['guia', 'wiki139'] },
    { id: 'dialogues',   phase: 2, tech: 0.10, design: 0.90, src: ['guia', 'wiki139'] },
    { id: 'levelDesign', phase: 2, tech: 0.60, design: 0.40, src: ['guia', 'wiki139'] },
    { id: 'ai',          phase: 2, tech: 0.80, design: 0.20, src: ['guia', 'wiki139'] },
    { id: 'worldDesign', phase: 3, tech: 0.40, design: 0.60, src: ['guia', 'wiki139'] },
    { id: 'graphics',    phase: 3, tech: 0.50, design: 0.50, src: ['guia', 'wiki139'] },
    { id: 'sound',       phase: 3, tech: 0.40, design: 0.60, src: ['guia', 'wiki139'] }
  ];

  // Orden canónico de los campos dentro de cada fase (el mismo que muestra el juego).
  const phases = [
    { n: 1, fields: ['engine', 'gameplay', 'story'] },
    { n: 2, fields: ['dialogues', 'levelDesign', 'ai'] },
    { n: 3, fields: ['worldDesign', 'graphics', 'sound'] }
  ];

  // ── GÉNEROS ────────────────────────────────────────────────────────────────
  // `ratio`   → exigencia T/D del género y rango tolerado (guía).
  // `sliders` → posiciones concretas recomendadas 0-100 (foro Greenheart 7705).
  // `rules`   → regla de tiempo de la guía: '+' >40%, '~' 20-40%, '-' <20%.
  //
  // Las dos últimas proceden de fuentes distintas y en algunos campos discrepan.
  // Se conservan ambas a propósito: el motor de cálculo marca la discrepancia en
  // lugar de ocultarla eligiendo una.
  const genres = [
    {
      id: 'action',
      ratio: { td: 1.80, techPct: 64.0, designPct: 36.0, min: 1.44, max: 2.40 },
      sliders: { engine: 100, gameplay: 80, story: 0, dialogues: 0, levelDesign: 80, ai: 100, worldDesign: 0, graphics: 100, sound: 80 },
      rules:   { engine: '+', gameplay: '+', story: '-', dialogues: '-', levelDesign: '+', ai: '+', worldDesign: '~', graphics: '+', sound: '+' },
      src: ['guia', 'forum7705']
    },
    {
      id: 'adventure',
      ratio: { td: 0.40, techPct: 29.0, designPct: 71.0, min: 0.15, max: 0.65 },
      sliders: { engine: 0, gameplay: 0, story: 100, dialogues: 100, levelDesign: 0, ai: 0, worldDesign: 100, graphics: 80, sound: 0 },
      rules:   { engine: '-', gameplay: '~', story: '+', dialogues: '+', levelDesign: '~', ai: '-', worldDesign: '+', graphics: '+', sound: '~' },
      src: ['guia', 'forum7705']
    },
    {
      id: 'rpg',
      ratio: { td: 0.60, techPct: 37.5, designPct: 62.5, min: 0.35, max: 0.85 },
      sliders: { engine: 0, gameplay: 80, story: 100, dialogues: 100, levelDesign: 80, ai: 0, worldDesign: 100, graphics: 80, sound: 0 },
      rules:   { engine: '-', gameplay: '+', story: '+', dialogues: '+', levelDesign: '+', ai: '~', worldDesign: '+', graphics: '+', sound: '~' },
      src: ['guia', 'forum7705']
    },
    {
      id: 'simulation',
      ratio: { td: 1.60, techPct: 61.5, designPct: 38.5, min: 1.28, max: 2.13 },
      sliders: { engine: 80, gameplay: 100, story: 0, dialogues: 0, levelDesign: 80, ai: 100, worldDesign: 0, graphics: 100, sound: 80 },
      rules:   { engine: '+', gameplay: '+', story: '~', dialogues: '-', levelDesign: '+', ai: '+', worldDesign: '~', graphics: '+', sound: '+' },
      src: ['guia', 'forum7705']
    },
    {
      id: 'strategy',
      ratio: { td: 1.40, techPct: 58.3, designPct: 41.7, min: 1.12, max: 1.86 },
      sliders: { engine: 80, gameplay: 100, story: 0, dialogues: 0, levelDesign: 100, ai: 80, worldDesign: 100, graphics: 0, sound: 80 },
      rules:   { engine: '+', gameplay: '+', story: '~', dialogues: '-', levelDesign: '+', ai: '+', worldDesign: '~', graphics: '+', sound: '+' },
      src: ['guia', 'forum7705']
    },
    {
      id: 'casual',
      ratio: { td: 0.50, techPct: 33.3, designPct: 66.7, min: 0.25, max: 0.75 },
      sliders: { engine: 0, gameplay: 100, story: 0, dialogues: 0, levelDesign: 100, ai: 0, worldDesign: 0, graphics: 100, sound: 80 },
      rules:   { engine: '-', gameplay: '+', story: '-', dialogues: '-', levelDesign: '+', ai: '-', worldDesign: '-', graphics: '+', sound: '+' },
      src: ['guia', 'forum7705']
    }
  ];

  const genreOrder = ['action', 'adventure', 'rpg', 'simulation', 'strategy', 'casual'];

  // ── MATRIZ TEMA × GÉNERO ───────────────────────────────────────────────────
  // Multiplicadores de compatibilidad. 1.0 = óptimo, 0.6 = incompatible.
  // Los 12 temas de la guía tienen la matriz completa (72 celdas con valor exacto).
  const topics = [
    { id: 'aliens',    m: { action: 1.0, adventure: 0.8, rpg: 1.0, simulation: 0.6, strategy: 0.9, casual: 0.7 }, src: ['guia'] },
    { id: 'cyberpunk', m: { action: 1.0, adventure: 0.8, rpg: 1.0, simulation: 0.8, strategy: 0.7, casual: 0.6 }, src: ['guia'] },
    { id: 'sports',    m: { action: 1.0, adventure: 0.6, rpg: 0.6, simulation: 1.0, strategy: 0.7, casual: 1.0 }, src: ['guia'] },
    { id: 'detective', m: { action: 0.6, adventure: 1.0, rpg: 1.0, simulation: 0.8, strategy: 0.6, casual: 0.9 }, src: ['guia'] },
    { id: 'fantasy',   m: { action: 1.0, adventure: 1.0, rpg: 1.0, simulation: 0.8, strategy: 1.0, casual: 0.6 }, src: ['guia'] },
    { id: 'military',  m: { action: 1.0, adventure: 0.6, rpg: 0.8, simulation: 1.0, strategy: 1.0, casual: 0.6 }, src: ['guia'] },
    { id: 'mystery',   m: { action: 0.6, adventure: 1.0, rpg: 1.0, simulation: 0.8, strategy: 0.6, casual: 0.8 }, src: ['guia'] },
    { id: 'business',  m: { action: 0.6, adventure: 0.8, rpg: 0.8, simulation: 1.0, strategy: 1.0, casual: 0.6 }, src: ['guia'] },
    { id: 'pirate',    m: { action: 0.8, adventure: 1.0, rpg: 0.8, simulation: 0.8, strategy: 0.7, casual: 0.8 }, src: ['guia'] },
    { id: 'scifi',     m: { action: 1.0, adventure: 1.0, rpg: 1.0, simulation: 1.0, strategy: 1.0, casual: 0.8 }, src: ['guia'] },
    { id: 'horror',    m: { action: 1.0, adventure: 0.8, rpg: 0.8, simulation: 0.6, strategy: 0.7, casual: 0.8 }, src: ['guia'] },
    { id: 'vampire',   m: { action: 1.0, adventure: 0.8, rpg: 1.0, simulation: 0.6, strategy: 0.6, casual: 0.7 }, src: ['guia'] }
  ];

  // Combos adicionales reportados como "grandes" por la comunidad. No traen
  // multiplicador numérico, así que viven aparte en lugar de contaminar la matriz
  // con valores inventados.
  const communityCombos = {
    action:    ['airplane', 'altHistory', 'dungeon', 'hunting', 'medieval', 'music', 'martialArts', 'history', 'postApocalyptic', 'prison', 'space', 'spy', 'superheroes', 'timeTravel', 'rhythm', 'werewolf', 'zombies'],
    adventure: ['spy', 'school', 'timeTravel', 'zombies', 'law', 'life', 'medieval', 'prison', 'romance'],
    rpg:       ['altHistory', 'dungeon', 'fashion', 'history', 'martialArts', 'medieval', 'postApocalyptic', 'school', 'spy', 'werewolf', 'wildWest'],
    strategy:  ['airplane', 'city', 'dungeon', 'evolution', 'government', 'hacking', 'history', 'medieval', 'space', 'school', 'transport', 'ufo', 'vocabulary'],
    simulation: [],
    casual:     []
  };

  // ── CATÁLOGO COMPLETO DE TEMAS ─────────────────────────────────────────────
  // La matriz numérica de arriba solo cubre los 12 temas que la guía publica con
  // multiplicador. El juego tiene muchos más, así que aquí va el catálogo
  // completo con la escala cualitativa que sí está documentada.
  //
  // Codificación compacta, seis caracteres para los géneros en el orden
  // action · adventure · rpg · simulation · strategy · casual, y tres para los
  // públicos en el orden young · everyone · mature:
  //
  //   A = +++ excelente   B = ++ bueno   C = + aceptable
  //   D = --  malo        E = --- pésimo  . = sin dato publicado
  //
  // El punto importa: para los temas anteriores a la 1.6 la fuente publica solo
  // las combinaciones excelentes, así que el resto queda «sin dato» y NO se
  // marca como malo. Los 15 temas de la 1.6 sí traen la fila completa.
  const RATING = { A: 3, B: 2, C: 1, D: -1, E: -2, '.': null };

  const TOPIC_ROWS = [
    // id                 género   público  origen del cruce por género
    ['abstract',        'BAEECE', 'BAE', 'full'],
    ['airplane',        'A..AAA', 'AAB', 'great'],
    ['aliens',          'A.A.A.', 'ABA', 'great'],
    ['altHistory',      'A.A...', 'ABA', 'great'],
    ['assassin',        'ADACEE', 'AEA', 'full'],
    ['business',        '...AA.', 'EBD', 'great'],
    ['city',            '...AA.', 'DBC', 'great'],
    ['colonization',    'DEEAAD', 'DDC', 'full'],
    ['comedy',          '.A...A', 'ECA', 'great'],
    ['construction',    'DEEABC', 'DCB', 'full'],
    ['cooking',         'BDCADA', 'BCE', 'full'],
    ['crime',           'ADCBDE', 'AEA', 'full'],
    ['cyberpunk',       'A.A...', 'ADA', 'great'],
    ['dance',           '...A.A', 'DAC', 'great'],
    ['detective',       '.AA...', 'EBC', 'great'],
    ['disasters',       'BCDAAD', 'BDA', 'full'],
    ['dungeon',         'A.AAA.', 'ACA', 'great'],
    ['dystopian',       'CBCABE', 'CEA', 'full'],
    ['evolution',       '...AA.', 'DCD', 'great'],
    ['expedition',      'DBEBAE', 'DCB', 'full'],
    ['extremeSports',   'AEEADB', 'AAD', 'full'],
    ['fantasy',         'AAA.A.', 'AAA', 'great'],
    ['farming',         'EDEAEA', 'EBC', 'full'],
    ['fashion',         '..AA.A', 'EAE', 'great'],
    ['gameDev',         '...A..', 'EBD', 'great'],
    ['government',      '...AA.', 'EEC', 'great'],
    ['hacking',         '...AA.', 'DDA', 'great'],
    ['history',         '...AA.', 'CCB', 'great'],
    ['horror',          'A.....', 'AEA', 'great'],
    ['hospital',        '...A..', 'EDC', 'great'],
    ['hunting',         'A..A..', 'ABB', 'great'],
    ['law',             '.A....', 'ECD', 'great'],
    ['life',            '.A.A..', 'EAC', 'great'],
    ['madScience',      'BADBEE', 'BCA', 'full'],
    ['martialArts',     'A.AA.A', 'ADA', 'great'],
    ['medieval',        'AAA.A.', 'AAB', 'great'],
    ['military',        'A..AA.', 'ADA', 'great'],
    ['movies',          '...A.A', 'CBB', 'great'],
    ['music',           'A..A.A', 'AAC', 'great'],
    ['mystery',         '.AA...', 'ECA', 'great'],
    ['mythology',       'ACBBCD', 'ADA', 'full'],
    ['ninja',           'A.....', 'AAB', 'great'],
    ['pirate',          '.A....', 'CAC', 'great'],
    ['postApocalyptic', 'A.A...', 'AEA', 'great'],
    ['prison',          'AA.A..', 'ADA', 'great'],
    ['racing',          '...A.A', 'BAB', 'great'],
    ['rhythm',          'A..A.A', 'AAC', 'great'],
    ['romance',         '.A....', 'ECA', 'great'],
    ['school',          '.AAAA.', 'CAD', 'great'],
    ['scifi',           'AAAAA.', 'ACA', 'great'],
    ['space',           'A..AA.', 'ACA', 'great'],
    ['sports',          'A..A.A', 'AAC', 'great'],
    ['spy',             'AAA...', 'ACA', 'great'],
    ['startups',        '...A..', '...', 'great'],
    ['superheroes',     'A.....', 'AAA', 'great'],
    ['surgery',         '...A..', 'CCB', 'great'],
    ['technology',      'EDEABE', 'ECB', 'full'],
    ['thief',           'BCABEB', 'BDA', 'full'],
    ['timeTravel',      'AA....', 'BBC', 'great'],
    ['transport',       '...AA.', 'EBD', 'great'],
    ['ufo',             '....A.', 'ACB', 'great'],
    ['vampire',         '..A...', 'ADA', 'great'],
    ['virtualPet',      '...A.A', 'EAD', 'great'],
    ['vocabulary',      '...AA.', 'EBE', 'great'],
    ['werewolf',        'A.A...', 'ADA', 'great'],
    ['wildWest',        '..A...', 'BAA', 'great'],
    ['zombies',         'AA....', 'ABA', 'great']
  ];

  const AUDIENCE_ORDER = ['young', 'everyone', 'mature'];

  const topicCatalog = TOPIC_ROWS.map(([id, g, a, genreSrc]) => {
    const genres = {};
    genreOrder.forEach((key, i) => { genres[key] = RATING[g[i]]; });
    const audience = {};
    AUDIENCE_ORDER.forEach((key, i) => { audience[key] = RATING[a[i]]; });
    return {
      id, genres, audience,
      // 'full' = la fuente publica la fila entera; 'great' = solo las excelentes,
      // así que un null significa «no publicado», nunca «malo».
      genreSrc,
      // Los 12 de la matriz llevan además multiplicador numérico exacto.
      hasMatrix: topics.some(t => t.id === id),
      src: genreSrc === 'full' ? ['steam1365613422', 'steam1577227575'] : ['forum7705', 'steam1577227575']
    };
  });

  // ── PLATAFORMAS ────────────────────────────────────────────────────────────
  // Costes en dólares como número. `audienceM` solo se rellena donde la guía
  // aporta el multiplicador; `null` significa "sin dato citado", no cero.
  const platforms = [
    { id: 'pc',          real: 'PC',                year: 1,  month: 1,  devCost: 30000,  licCost: 0,       eternal: true,  bestGenres: ['simulation', 'strategy', 'rpg', 'action'], audienceM: { young: null, everyone: 1.15, mature: 1.30 }, src: ['guia'] },
    { id: 'govodore',    real: 'Commodore 64',      year: 1,  month: 1,  devCost: 20000,  licCost: 0,       eternal: false, bestGenres: ['action', 'adventure', 'rpg', 'simulation'], audienceM: { young: 1.0, everyone: 1.0, mature: 1.0 }, src: ['guia'] },
    { id: 'tes',         real: 'NES (Famicom)',     year: 2,  month: 1,  devCost: 80000,  licCost: 80000,   eternal: false, bestGenres: ['action', 'rpg', 'adventure'], audienceM: { young: 1.0, everyone: 0.8, mature: 0.6 }, src: ['guia'] },
    { id: 'masterV',     real: 'Master System',     year: 3,  month: 2,  devCost: 70000,  licCost: 60000,   eternal: false, bestGenres: ['action', 'casual'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'gameling',    real: 'Game Boy',          year: 3,  month: 9,  devCost: 90000,  licCost: 100000,  eternal: false, bestGenres: ['casual', 'adventure', 'rpg'], audienceM: { young: 1.0, everyone: 0.7, mature: 0.6 }, src: ['guia'] },
    { id: 'venaGear',    real: 'Game Gear',         year: 4,  month: 2,  devCost: 110000, licCost: 120000,  eternal: false, bestGenres: ['action'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'venaOasis',   real: 'Sega Genesis',      year: 5,  month: 2,  devCost: 150000, licCost: 200000,  eternal: false, bestGenres: ['action', 'sports'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'superTes',    real: 'SNES',              year: 5,  month: 12, devCost: 160000, licCost: 220000,  eternal: false, bestGenres: ['rpg', 'adventure', 'action'], audienceM: { young: 1.0, everyone: 0.8, mature: 0.6 }, src: ['guia'] },
    { id: 'playsystem',  real: 'PlayStation',       year: 7,  month: 7,  devCost: 250000, licCost: 500000,  eternal: false, bestGenres: ['action', 'rpg', 'simulation'], audienceM: { young: null, everyone: 0.85, mature: 0.75 }, src: ['guia'] },
    { id: 'tes64',       real: 'Nintendo 64',       year: 9,  month: 2,  devCost: 280000, licCost: 550000,  eternal: false, bestGenres: ['adventure', 'action'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'dreamvast',   real: 'Dreamcast',         year: 10, month: 8,  devCost: 300000, licCost: 600000,  eternal: false, bestGenres: ['action'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'playsystem2', real: 'PlayStation 2',     year: 11, month: 5,  devCost: 400000, licCost: 1000000, eternal: false, bestGenres: ['action', 'rpg', 'simulation'], audienceM: { young: null, everyone: 1.10, mature: 1.00 }, src: ['guia'] },
    { id: 'mbox',        real: 'Xbox',              year: 11, month: 12, devCost: 420000, licCost: 1100000, eternal: false, bestGenres: ['action', 'strategy'], audienceM: { young: null, everyone: 1.30, mature: 1.20 }, src: ['guia'] },
    { id: 'gameSphere',  real: 'GameCube',          year: 12, month: 12, devCost: 380000, licCost: 900000,  eternal: false, bestGenres: ['adventure', 'casual'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'pps',         real: 'PSP',               year: 14, month: 3,  devCost: 450000, licCost: 1200000, eternal: false, bestGenres: ['action', 'rpg'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'mbox360',     real: 'Xbox 360',          year: 16, month: 8,  devCost: 600000, licCost: 2000000, eternal: false, bestGenres: ['action', 'rpg', 'strategy'], audienceM: { young: null, everyone: 1.30, mature: 1.20 }, src: ['guia'] },
    { id: 'nuu',         real: 'Nintendo Wii',      year: 17, month: 4,  devCost: 500000, licCost: 1800000, eternal: false, bestGenres: ['casual'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'playsystem3', real: 'PlayStation 3',     year: 17, month: 12, devCost: 650000, licCost: 2200000, eternal: false, bestGenres: ['action', 'rpg', 'adventure'], audienceM: { young: null, everyone: 1.20, mature: 1.10 }, src: ['guia'] },
    { id: 'grPhone',     real: 'iOS / Android',     year: 18, month: 1,  devCost: 100000, licCost: 300000,  eternal: true,  bestGenres: ['casual'], audienceM: { young: null, everyone: null, mature: null }, src: ['steamUltimate'] },
    { id: 'playsystem4', real: 'PlayStation 4',     year: 22, month: 3,  devCost: 900000, licCost: 3500000, eternal: false, bestGenres: ['action', 'rpg'], audienceM: { young: null, everyone: 1.30, mature: 1.20 }, src: ['guia'] },
    { id: 'custom',      real: 'Hardware Lab',      year: null, month: null, devCost: null, licCost: 0,     eternal: true,  custom: true, bestGenres: [], audienceM: { young: null, everyone: null, mature: null }, src: ['guia'] }
  ];

  // ── HITOS DE PROGRESIÓN ────────────────────────────────────────────────────
  // Cifras exactas de la guía. Sustituyen a las inventadas de la versión anterior.
  const milestones = [
    { id: 'office2',      stage: 1, cash: 1000000,   year: null, month: null, week: null, staff: 0, rp: 0,   src: ['guia', 'steamUltimate'] },
    { id: 'office2plus',  stage: 2, cash: 5000000,   year: 11,   month: 6,    week: 2,    staff: 2, rp: 0,   src: ['guia', 'steamUltimate'] },
    { id: 'office3',      stage: 2, cash: 16000000,  year: 13,   month: 9,    week: 2,    staff: 4, rp: 0,   src: ['guia', 'steamUltimate'] },
    { id: 'rndLab',       stage: 3, cash: 5000000,   year: null, month: null, week: null, staff: 1, rp: 100, specialist: 'design', specialistPts: 700, src: ['guia'] },
    { id: 'hardwareLab',  stage: 4, cash: 5000000,   year: null, month: null, week: null, staff: 1, rp: 100, specialist: 'tech', specialistPts: 700, src: ['guia'] },
    { id: 'aaa',          stage: 4, cash: null,      year: null, month: null, week: null, staff: 3, rp: 0,   src: ['guia'] },
    { id: 'ownConsole',   stage: 4, cash: 200000000, year: null, month: null, week: null, staff: 1, rp: 0,   src: ['guia'] }
  ];

  // Desbloqueos por investigación, con marca temporal exacta.
  const researchUnlocks = [
    { id: 'targetAudience', year: 3,  month: 1,  week: 1,    src: ['guia'] },
    { id: 'casualGames',    year: 3,  month: 11, week: 1,    src: ['guia'] },
    { id: 'marketing',      year: 4,  month: 5,  week: 2,    src: ['guia'] },
    { id: 'sequels',        year: 8,  month: 6,  week: null, src: ['guia'] },
    { id: 'multiGenre',     year: 12, month: 8,  week: null, src: ['forum7705'] },
    { id: 'expansionPack',  year: null, month: null, week: null, requires: 'mmo', src: ['forum7705'] }
  ];

  // ── PENALIZACIONES ALGORÍTMICAS ────────────────────────────────────────────
  // Las cinco reglas cuya violación hunde el Game Score de forma automática.
  const penalties = [
    { id: 'repeatCombo',   severity: 'high',     src: ['guia', 'wiki139'] },
    { id: 'earlySequel',   severity: 'high',     threshold: 40, unit: 'weeks', src: ['guia', 'wiki139'] },
    { id: 'staleEngine',   severity: 'medium',   src: ['guia', 'wiki139'] },
    { id: 'scaleMismatch', severity: 'critical', src: ['guia', 'wiki139'] },
    { id: 'aaaRequirements', severity: 'critical', src: ['guia', 'wiki139'] }
  ];

  // ── PERSONAL ───────────────────────────────────────────────────────────────
  // Sesgo D:T que aplica cada método de búsqueda al contratar.
  const recruiting = [
    { id: 'algorithms', biasDesign: 1, biasTech: 4, roles: ['engine', 'ai'], src: ['guia', 'steamSpecialists'] },
    { id: 'showreel',   biasDesign: 4, biasTech: 1, roles: ['gameplay', 'story', 'dialogues'], src: ['guia', 'steamSpecialists'] },
    { id: 'gameDemo',   biasDesign: 3, biasTech: 2, roles: ['levelDesign', 'worldDesign', 'graphics', 'sound'], src: ['guia', 'steamSpecialists'] }
  ];

  // Requisitos para especializar a un empleado en un campo (900 puntos totales).
  const specializations = fields.map(f => ({
    id: f.id,
    design: Math.round(900 * f.design),
    tech:   Math.round(900 * f.tech),
    level:  7,
    rp:     200,
    cost:   5000000,
    src: ['guia', 'gamefaqs']
  }));

  const training = {
    welcomeTrainingCost: 10000,
    efficiencyFrom: 0.05,
    efficiencyTo: 0.28,
    cooldownGamesBetween: 1,
    src: ['guia', 'forum5442', 'reddit178']
  };

  // ── MODO PIRATA ────────────────────────────────────────────────────────────
  // Cifras verificadas. Sustituyen al "95% de piratería" y al inexistente
  // "rescate bancario a -$50K" de la versión anterior.
  const pirateMode = {
    incomeLossPct: 50,
    garageRentMonthly: 8000,
    officeRentMonthly: 48000,
    initialShareSalePct: 20,
    shareBuybackCost: 275000,
    drmInEngineTree: true,
    drmV6RequiresRndLab: true,
    src: ['steamPirate']
  };

  // ── EASTER EGGS ────────────────────────────────────────────────────────────
  const easterEggs = [
    { id: 'pong',           stage: 'garage',            src: ['wikiEE'] },
    { id: 'wingCommander',  stage: 'office2-pre',       src: ['wikiEE'] },
    { id: 'doom',           stage: 'office2-pre',       src: ['wikiEE'] },
    { id: 'halfLife',       stage: 'office2-post',      src: ['wikiEE'] },
    { id: 'themeHospital',  stage: 'office2-post',      src: ['wikiEE'] },
    { id: 'halo',           stage: 'rndLab',            src: ['wikiEE'] },
    { id: 'starCitizen',    stage: 'rndLab',            src: ['wikiEE'] },
    { id: 'okami',          stage: 'rndLab',            src: ['wikiEE'] },
    { id: 'greenheartName', stage: 'any',               src: ['wikiEE'] },
    { id: 'gdtGame',        stage: 'any',               src: ['wikiEE'] },
    { id: 'redBarrels',     stage: 'any',               src: ['wikiEE'] },
    { id: 'elevenOutOfTen', stage: 'any',               src: ['wikiEE'] }
  ];

  return {
    sources, fields, phases, genres, genreOrder, topics, communityCombos,
    topicCatalog, RATING, AUDIENCE_ORDER,
    platforms, milestones, researchUnlocks, penalties,
    recruiting, specializations, training, pirateMode, easterEggs
  };
})();
