/**
 * GAME DEV TYCOON — SUGERENCIAS DE TÍTULO
 * ========================================
 * Genera nombres para un juego a partir del tema y el género elegidos.
 *
 * IMPORTANTE — no es un dato del juego. El resto de la guía solo muestra cifras
 * con fuente; esto es una ayuda creativa y se etiqueta como tal en la interfaz.
 * Lo que sí está documentado son los PATRONES: la convención «Título: Subtítulo»,
 * la fórmula «{Sustantivo} of {Sustantivo}» con los repertorios clásicos
 * (Age, Gods, Lords, Shadow, Rise, Fall, Chronicles, Guardians × Darkness,
 * Light, War, Chaos, Fallen, Infinity, Ancients), el prefijo «Re-» para
 * secuelas y la tendencia moderna a suprimir los dos puntos.
 *
 * Fuentes de los patrones: Nintendo Life, «Playing The Name Game»; TV Tropes,
 * «Colon Cancer»; Wikipedia, convenciones de nomenclatura de videojuegos.
 */

(function (global) {
  'use strict';

  // Repertorios clásicos documentados, en el mismo orden en ambos idiomas.
  //
  // Cada palabra del repertorio final lleva su género y número gramatical, para
  // que el conector se construya bien: en español «de + el» se contrae en «del»
  // y los sustantivos abstractos piden artículo («Era de la Oscuridad», no «Era
  // de Oscuridad»). En inglés solo los plurales lo llevan («of the Fallen»).
  const POOLS = {
    es: {
      head: ['Era', 'Dioses', 'Señores', 'Sombra', 'Auge', 'Caída', 'Crónicas', 'Guardianes', 'Leyenda', 'Reino'],
      tail: [
        { w: 'Oscuridad', a: 'f' }, { w: 'Luz', a: 'f' },      { w: 'Guerra', a: 'f' },
        { w: 'Caos', a: 'm' },      { w: 'Caídos', a: 'mp' },  { w: 'Infinito', a: 'm' },
        { w: 'Ancestros', a: 'mp' },{ w: 'Abismo', a: 'm' },   { w: 'Tormenta', a: 'f' },
        { w: 'Silencio', a: 'm' }
      ],
      of: 'de',
      joinDe: (x) => ({ f: 'de la ', m: 'del ', fp: 'de las ', mp: 'de los ' }[x.a] || 'de ') + x.w
    },
    en: {
      head: ['Age', 'Gods', 'Lords', 'Shadow', 'Rise', 'Fall', 'Chronicles', 'Guardians', 'Legend', 'Realm'],
      tail: [
        { w: 'Darkness', a: 's' }, { w: 'Light', a: 's' },   { w: 'War', a: 's' },
        { w: 'Chaos', a: 's' },    { w: 'Fallen', a: 'p' },  { w: 'Infinity', a: 's' },
        { w: 'Ancients', a: 'p' }, { w: 'Abyss', a: 's' },   { w: 'Storm', a: 's' },
        { w: 'Silence', a: 's' }
      ],
      of: 'of',
      joinDe: (x) => (x.a === 'p' ? 'of the ' : 'of ') + x.w
    }
  };

  // Palabra de sabor por género: fija el tono del título.
  const GENRE_WORDS = {
    action:     { es: ['Asalto', 'Furia', 'Estruendo', 'Impacto', 'Represalia'], en: ['Assault', 'Havoc', 'Strike', 'Rampage', 'Reprisal'] },
    adventure:  { es: ['Odisea', 'Senda', 'Travesía', 'Enigma', 'Expedición'],   en: ['Odyssey', 'Trail', 'Voyage', 'Enigma', 'Expedition'] },
    rpg:        { es: ['Saga', 'Destino', 'Alianza', 'Estirpe', 'Profecía'],     en: ['Saga', 'Destiny', 'Covenant', 'Bloodline', 'Prophecy'] },
    simulation: { es: ['Imperio', 'Magnate', 'Taller', 'Distrito', 'Rutina'],    en: ['Empire', 'Tycoon', 'Works', 'District', 'Routine'] },
    strategy:   { es: ['Conquista', 'Dominio', 'Mando', 'Frente', 'Doctrina'],   en: ['Conquest', 'Dominion', 'Command', 'Front', 'Doctrine'] },
    casual:     { es: ['Fiesta', 'Frenesí', 'Manía', 'Torbellino', 'Rally'],     en: ['Party', 'Frenzy', 'Mania', 'Whirl', 'Rally'] }
  };

  // Plantillas. {t} = tema, {g} = palabra de género, {h} y {a} = repertorios
  // clásicos, {of} = conector.
  //
  // Todas usan conector explícito a propósito: el inglés admite yuxtaponer dos
  // sustantivos («Shadow Fantasy») pero el español no («Sombra Fantasía» no se
  // dice). Con el conector, la misma plantilla funciona en los dos idiomas.
  // {aDe} = repertorio final ya con su conector y artículo; {a} = forma desnuda.
  const PATTERNS = [
    { id: 'colonSub',     f: (v) => `${v.t}: ${v.h} ${v.aDe}` },
    { id: 'ofFormula',    f: (v) => `${v.h} ${v.of} ${v.t}` },
    { id: 'topicGenre',   f: (v) => `${v.t}: ${v.g}` },
    { id: 'genreOfTopic', f: (v) => `${v.g} ${v.of} ${v.t}` },
    { id: 'poolPair',     f: (v) => `${v.h} ${v.aDe}` },
    { id: 'topicDash',    f: (v) => `${v.t} — ${v.g}` },
    { id: 'topicPool',    f: (v) => `${v.t}: ${v.a}` },
    { id: 'sequel',       f: (v) => `${v.t}: ${v.g} II` }
  ];

  /** PRNG determinista: la misma semilla devuelve siempre la misma tanda. */
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let x = Math.imul(s ^ (s >>> 15), 1 | s);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * @param {object} o
   * @param {string} o.topic  nombre del tema ya traducido
   * @param {string} o.genreId
   * @param {string} o.lang
   * @param {number} o.count   cuántos títulos (mínimo 5)
   * @param {number} o.seed
   * @returns {{title:string, pattern:string}[]}
   */
  function generate(o) {
    const lang = POOLS[o.lang] ? o.lang : 'es';
    const pool = POOLS[lang];
    const gw = (GENRE_WORDS[o.genreId] || GENRE_WORDS.action)[lang];
    const rand = rng(o.seed || 1);
    const pick = arr => arr[Math.floor(rand() * arr.length)];

    // Las plantillas se barajan con la semilla y se consumen en ese orden, de
    // modo que una tanda de N títulos usa N estructuras distintas. Rotar con un
    // contador que también avanza en los descartes se salta plantillas y acaba
    // repitiendo dos o tres.
    const order = PATTERNS.slice();
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    const out = [];
    const seen = new Set();
    const want = Math.max(5, o.count || 5);
    for (let i = 0; out.length < want && i < order.length * 4; i++) {
      const p = order[i % order.length];
      const tail = pick(pool.tail);
      const title = p.f({
        t: o.topic,
        g: pick(gw),
        h: pick(pool.head),
        a: tail.w,
        aDe: pool.joinDe(tail),
        of: pool.of
      });
      if (seen.has(title)) continue;
      seen.add(title);
      out.push({ title, pattern: p.id });
    }
    return out;
  }

  global.GDT.names = { generate, PATTERNS, POOLS, GENRE_WORDS };
})(window);
