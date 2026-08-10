/**
 * GAME DEV TYCOON — ARRANQUE, ESTADO Y ENRUTADO
 * ==============================================
 * Este fichero ya no contiene datos: solo estado, routing y cableado.
 * Las bases de datos viven en js/data.js, el cálculo en js/engine.js,
 * los textos en js/i18n.js y el render en js/ui.js.
 */

(function () {
  'use strict';

  // ── Almacenamiento tolerante a fallos ──────────────────────────────────────
  // Bajo file:// el origen es `null` y algunos navegadores lanzan al tocar
  // localStorage. Sin esta envoltura, una excepción tumbaría el arranque entero.
  const store = (function () {
    const memory = {};
    let usable = true;
    try {
      const probe = '__gdt__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
    } catch (_) { usable = false; }
    return {
      get(key, fallback) {
        try {
          const raw = usable ? window.localStorage.getItem(key) : memory[key];
          return raw === null || raw === undefined ? fallback : JSON.parse(raw);
        } catch (_) { return fallback; }
      },
      set(key, value) {
        const raw = JSON.stringify(value);
        try { if (usable) window.localStorage.setItem(key, raw); else memory[key] = raw; }
        catch (_) { memory[key] = raw; }
      }
    };
  })();

  const SECTIONS = ['algorithm', 'progress', 'matrix', 'sliders', 'platforms', 'team', 'extras', 'sources'];
  const KEY = 'gdt.v2';

  // ── Estado ─────────────────────────────────────────────────────────────────
  // Precedencia, definida una sola vez: hash > localStorage > sistema > defecto.
  const saved = store.get(KEY, {});

  const browserLang = (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es';

  const state = {
    section: SECTIONS[0],
    lang: saved.lang || browserLang,
    theme: saved.theme || null,
    genre: saved.genre || 'action',
    positions: null,
    platformFilter: saved.platformFilter || 'ALL',
    matrixPlain: !!saved.matrixPlain,
    matrixHighlight: null,
    milestonesDone: saved.milestonesDone || {}
  };

  function persist() {
    store.set(KEY, {
      lang: state.lang, theme: state.theme, genre: state.genre,
      platformFilter: state.platformFilter, matrixPlain: state.matrixPlain,
      milestonesDone: state.milestonesDone
    });
  }

  // ── Tema ───────────────────────────────────────────────────────────────────
  function applyTheme() {
    if (state.theme) document.documentElement.dataset.theme = state.theme;
    else delete document.documentElement.dataset.theme;
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const dark = state.theme
        ? state.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', GDT.i18n.t('ui.theme.toggle'));
      // Icono de pixel-art, no un glifo: Press Start 2P no tiene ni sol ni luna
      // y el navegador los sustituiría por otra fuente.
      const use = btn.querySelector('use');
      if (use) use.setAttribute('href', dark ? '#i-sun' : '#i-moon');
    }
  }

  // ── Enrutado por hash ──────────────────────────────────────────────────────
  // El hash funciona bajo file:// (no dispara CORS) y da enlaces compartibles,
  // botón Atrás operativo y una URL indexable por sección.
  function parseHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '');
    const [path, query] = raw.split('?');
    return { section: SECTIONS.includes(path) ? path : null, params: new URLSearchParams(query || '') };
  }

  function writeHash(replace) {
    const params = new URLSearchParams();
    // El idioma viaja en el enlace: un enlace compartido llega en el idioma
    // en que se compartió, sin depender del localStorage de quien lo abre.
    if (state.lang !== 'es') params.set('lang', state.lang);
    if (state.theme) params.set('tema', state.theme);
    if (state.section === 'sliders') params.set('genero', state.genre);
    if (state.section === 'platforms' && state.platformFilter !== 'ALL') params.set('filtro', state.platformFilter);
    const qs = params.toString();
    const next = '#/' + state.section + (qs ? '?' + qs : '');
    if (location.hash === next) return;
    if (replace) history.replaceState(null, '', next);
    else history.pushState(null, '', next);
  }

  function readRoute() {
    const { section, params } = parseHash();
    if (section) state.section = section;
    if (params.has('lang') && GDT.i18n.available.includes(params.get('lang'))) {
      state.lang = params.get('lang');
    }
    // El tema también viaja en el enlace. Además de ser compartible, hace que
    // las pruebas puedan fijarlo de forma determinista: la preferencia del
    // navegador depende del entorno y no es fiable para automatizar.
    if (params.has('tema') && ['light', 'dark'].includes(params.get('tema'))) {
      state.theme = params.get('tema');
    }
    if (params.has('genero') && GDT.genres.some(g => g.id === params.get('genero'))) {
      state.genre = params.get('genero');
      state.positions = null;
    }
    if (params.has('filtro')) state.platformFilter = params.get('filtro');
  }

  // ── Pestañas con patrón ARIA completo ──────────────────────────────────────
  function wireTabs() {
    const tablist = document.getElementById('tablist');
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

    function focusTab(i) {
      const next = (i + tabs.length) % tabs.length;
      tabs[next].focus();
      select(tabs[next].dataset.section);
    }

    tablist.addEventListener('click', e => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) select(tab.dataset.section);
    });

    tablist.addEventListener('keydown', e => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (e.key in map) { e.preventDefault(); focusTab(map[e.key]); }
    });
  }

  function syncTabs() {
    document.querySelectorAll('[role="tab"]').forEach(tab => {
      const active = tab.dataset.section === state.section;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;   // roving tabindex
      tab.classList.toggle('active', active);
    });
    document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
      const active = panel.dataset.section === state.section;
      panel.hidden = !active;
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function panel(section) { return document.querySelector(`[role="tabpanel"][data-section="${section}"]`); }

  function renderCurrent() {
    const root = panel(state.section);
    if (!root) return;
    const U = GDT.ui;

    switch (state.section) {
      case 'algorithm': U.renderAlgorithm(root); break;
      case 'progress': {
        // El contador de hitos se reconstruye tras cada marca; se recuerda el
        // foco para no perderlo al re-renderizar la lista.
        const onToggle = (id, done) => {
          if (done) state.milestonesDone[id] = true;
          else delete state.milestonesDone[id];
          persist();
          const focused = document.activeElement && document.activeElement.id;
          U.renderProgress(root, state, onToggle);
          if (focused) {
            const again = document.getElementById(focused);
            if (again) again.focus();
          }
        };
        U.renderProgress(root, state, onToggle);
        break;
      }
      case 'matrix':
        U.renderMatrix(root, state, () => {
          state.matrixPlain = !state.matrixPlain; persist(); renderCurrent();
        });
        break;
      case 'sliders':
        if (!state.positions) state.positions = GDT.engine.suggestion(state.genre).positions;
        U.renderSliders(root, state, patch => {
          if (patch.genre) { state.genre = patch.genre; state.positions = null; persist(); writeHash(true); }
          if (patch.positions) state.positions = patch.positions;
          if (!state.positions) state.positions = GDT.engine.suggestion(state.genre).positions;
          renderCurrent();
        });
        break;
      case 'platforms':
        U.renderPlatforms(root, state, val => {
          state.platformFilter = val; persist(); writeHash(true); renderCurrent();
        });
        break;
      case 'team': U.renderTeam(root); break;
      case 'extras': U.renderExtras(root); break;
      case 'sources': U.renderSources(root); break;
    }
  }

  /**
   * Un chip de referencia vive en una sección y su ancla en otra. Se abre la
   * pestaña de fuentes y se lleva el foco al ancla, en vez de dejar un salto
   * que el navegador no puede resolver por estar el panel oculto.
   */
  function wireRefLinks() {
    document.addEventListener('click', e => {
      const link = e.target.closest('a.ref');
      if (!link) return;
      const id = (link.getAttribute('href') || '').slice(1);
      if (!id.startsWith('src-')) return;
      e.preventDefault();
      select('sources');
      const target = document.getElementById(id);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: 'center' });
      }
    });
  }

  function select(section, opts) {
    if (!SECTIONS.includes(section)) return;
    state.section = section;
    if (state.section === 'sliders' && !state.positions) {
      state.positions = GDT.engine.suggestion(state.genre).positions;
    }
    syncTabs();
    renderCurrent();
    writeHash(opts && opts.replace);
  }

  function renderAll() {
    GDT.i18n.setLang(state.lang);
    GDT.i18n.apply(document);
    // Las fuentes se renderizan siempre, aunque su panel esté oculto: los chips
    // de referencia de las demás secciones apuntan a sus anclas, y un enlace a
    // un ancla inexistente es un fallo de WCAG 2.4.1.
    GDT.ui.renderSources(panel('sources'));
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.textContent = state.lang === 'es' ? 'EN' : 'ES';
    applyTheme();
    syncTabs();
    renderCurrent();
  }

  // ── Arranque ───────────────────────────────────────────────────────────────
  function boot() {
    // Sin datos no hay página: se avisa en vez de dejar un main en blanco.
    if (!window.GDT || !GDT.genres || !GDT.engine || !GDT.ui) {
      const main = document.getElementById('main');
      if (main) {
        main.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'boot-error';
        p.textContent = 'No se han podido cargar los datos de la guía. Comprueba que la carpeta js/ acompaña a index.html.';
        main.appendChild(p);
      }
      return;
    }

    readRoute();
    wireTabs();
    wireRefLinks();

    // El logotipo es un enlace real a la raíz —funciona sin JS— pero con JS se
    // intercepta para volver a la primera sección sin recargar.
    const brand = document.getElementById('brand-home');
    if (brand) brand.addEventListener('click', e => { e.preventDefault(); select(SECTIONS[0]); });

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.addEventListener('click', () => {
      state.lang = state.lang === 'es' ? 'en' : 'es';
      persist();
      renderAll();
      writeHash(true);
    });

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', () => {
      const dark = state.theme
        ? state.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.theme = dark ? 'light' : 'dark';
      persist();
      applyTheme();
    });

    // renderAll y no renderCurrent: el hash puede traer también idioma.
    window.addEventListener('hashchange', () => { readRoute(); renderAll(); });
    window.addEventListener('popstate', () => { readRoute(); renderAll(); });

    renderAll();
    writeHash(true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
