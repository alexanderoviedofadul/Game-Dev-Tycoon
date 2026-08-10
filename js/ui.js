/**
 * GAME DEV TYCOON — RENDERIZADORES
 * =================================
 * Construyen el DOM de cada sección a partir de GDT (datos) y GDT.engine (cálculo).
 * Todo texto visible pasa por GDT.i18n.t.
 */

(function (global) {
  'use strict';

  const D = global.GDT;
  const E = D.engine;
  const I = D.i18n;
  const t = (k, v) => I.t(k, v);

  // ── Ayudas de construcción ─────────────────────────────────────────────────

  function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v === null || v === undefined) continue;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
      }
    }
    (children || []).filter(Boolean).forEach(c => {
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  const clear = n => { while (n.firstChild) n.removeChild(n.firstChild); return n; };

  /** Chips que enlazan una afirmación con la fuente que la respalda. */
  function refs(srcKeys) {
    if (!srcKeys || !srcKeys.length) return null;
    const wrap = el('span', { class: 'refs' });
    srcKeys.forEach(key => {
      const s = D.sources[key];
      if (!s) return;
      wrap.appendChild(el('a', {
        class: 'ref ref--' + s.kind,
        href: '#src-' + key,
        title: t('ui.sources.ref', { label: s.label }),
        text: s.kind === 'primary' ? '◆' : '◇'
      }));
    });
    return wrap;
  }

  function sectionHeading(key, icon) {
    return el('h2', { class: 'section-title' }, [
      el('span', { class: 'section-icon', 'aria-hidden': 'true', text: icon }),
      el('span', { text: t(key) })
    ]);
  }

  // ── 1. CÓMO PUNTÚA EL JUEGO ────────────────────────────────────────────────

  function renderAlgorithm(root) {
    clear(root);
    root.appendChild(sectionHeading('ui.algorithm.title', '∑'));

    // La fórmula, tal y como la publica la wiki.
    root.appendChild(el('div', { class: 'card card--formula' }, [
      el('h3', { class: 'card-title', text: t('ui.algorithm.formulaTitle') }),
      // Solo caracteres que existen en Press Start 2P: un glifo ausente cae en
      // un sustituto de otra fuente y rompe la línea visualmente.
      el('p', { class: 'formula', text: 'Game Score = (Puntos D + T) x Calidad x (Plataforma x Genero) x (Tema x Publico) x Ratio de errores x Tendencia' }),
      el('p', { class: 'muted' }, [
        document.createTextNode(t('ui.algorithm.modifiers') + ' — 0.6 … 1.0.'),
        refs(['guia', 'wiki144'])
      ])
    ]));

    // Los seis factores, pintados con la misma rampa que el heatmap.
    const grid = el('div', { class: 'grid grid--3' });
    ['topicGenre', 'platformGenre', 'tdRatio', 'sliderTime', 'bugsCleared', 'trend'].forEach(id => {
      grid.appendChild(el('div', { class: 'card card--modifier' }, [
        el('h4', { class: 'card-title-sm', text: t('modifier.' + id) }),
        el('div', { class: 'scale-strip', 'aria-hidden': 'true' },
          [1, 2, 3, 4, 5].map(s => el('span', { class: 'scale-step', dataset: { step: String(s) } })))
      ]));
    });
    root.appendChild(grid);

    // La trampa de inflación: la mecánica central y la que más partidas arruina.
    root.appendChild(el('div', { class: 'card card--warn' }, [
      el('h3', { class: 'card-title', text: t('ui.algorithm.inflationTitle') }),
      el('p', {}, [document.createTextNode(
        I.getLang() === 'es'
          ? 'El juego no compara tu nota contra una escala absoluta, sino contra el promedio de tus propios mejores registros. Para sacar 9.5 o 10 tienes que superar ligeramente esa marca previa. Si disparas la producción de puntos de golpe —fichando personal de alto nivel o metiendo un motor muy avanzado— subes el listón a un ritmo que luego no puedes sostener, y las siguientes producciones se quedan cortas. La progresión debe ser aritmética y constante: absorbe los saltos de plantilla con juegos de bajo presupuesto o contratos de edición.'
          : 'The game does not compare your score against an absolute scale, but against the average of your own best past records. To score 9.5 or 10 you must slightly beat that previous mark. If you spike point production all at once — hiring high-level staff or dropping in a very advanced engine — you raise the bar faster than you can sustain, and later releases fall short. Progression must be arithmetic and steady: absorb staff jumps with low-budget games or publisher contracts.'
      ), refs(['guia', 'reddit178'])])
    ]));

    // Penalizaciones: severidad con icono + etiqueta, nunca solo color.
    const table = el('table', { class: 'data-table' }, [
      el('caption', { text: t('ui.algorithm.penaltiesTitle') }),
      el('thead', {}, [el('tr', {}, [
        el('th', { scope: 'col', text: t('ui.algorithm.colInfraction') }),
        el('th', { scope: 'col', text: t('ui.algorithm.colMechanism') }),
        el('th', { scope: 'col', text: t('ui.algorithm.colSeverity') })
      ])]),
      el('tbody', {}, D.penalties.map(p => el('tr', {}, [
        el('th', { scope: 'row' }, [document.createTextNode(t('penalty.' + p.id)), refs(p.src)]),
        el('td', { text: t('penaltyBody.' + p.id) }),
        el('td', {}, [el('span', { class: 'sev sev--' + p.severity }, [
          el('span', { 'aria-hidden': 'true', text: p.severity === 'critical' ? '⛔' : p.severity === 'high' ? '⚠' : '•' }),
          document.createTextNode(' ' + t('ui.severity.' + p.severity))
        ])])
      ])))
    ]);
    root.appendChild(el('div', { class: 'table-scroll' }, [table]));
  }

  // ── 2. PROGRESIÓN ──────────────────────────────────────────────────────────

  function formatReq(m) {
    const parts = [];
    if (m.cash) parts.push(`${t('ui.progress.req.cash')}: ${I.money(m.cash)}`);
    if (m.year) parts.push(`${t('ui.progress.req.time')}: ${t('ui.platforms.year', { y: m.year, m: m.month })}${m.week ? ', s. ' + m.week : ''}`);
    if (m.staff) parts.push(`${t('ui.progress.req.staff')}: ${m.staff}`);
    if (m.rp) parts.push(`${t('ui.progress.req.rp')}: ${m.rp}`);
    if (m.specialist) {
      const axis = m.specialist === 'design' ? t('ui.sliders.design') : t('ui.sliders.tech');
      parts.push(`${t('ui.progress.req.specialist')}: ${axis} ≥ ${m.specialistPts}`);
    }
    return parts;
  }

  function renderProgress(root, state, onToggle) {
    clear(root);
    root.appendChild(sectionHeading('ui.progress.title', '⌁'));

    const done = state.milestonesDone || {};
    const total = D.milestones.length;
    const doneCount = D.milestones.filter(m => done[m.id]).length;

    root.appendChild(el('p', { class: 'progress-count', 'aria-live': 'polite',
      text: t('ui.progress.completed', { done: doneCount, total }) }));

    const list = el('ol', { class: 'timeline' });
    D.milestones.forEach(m => {
      const id = 'ms-' + m.id;
      const cb = el('input', { type: 'checkbox', id, class: 'ms-check' });
      cb.checked = !!done[m.id];
      cb.addEventListener('change', () => onToggle(m.id, cb.checked));

      list.appendChild(el('li', { class: 'timeline-item', dataset: { stage: String(m.stage) } }, [
        el('div', { class: 'timeline-head' }, [
          cb,
          el('label', { for: id, class: 'timeline-title' }, [
            document.createTextNode(t('milestone.' + m.id)), refs(m.src)
          ])
        ]),
        el('p', { class: 'muted', text: t('milestoneBody.' + m.id) }),
        el('ul', { class: 'req-list' }, formatReq(m).map(p => el('li', { text: p })))
      ]));
    });
    root.appendChild(list);

    root.appendChild(el('h3', { class: 'card-title', text: t('ui.progress.unlocks') }));
    root.appendChild(el('ul', { class: 'chip-list' }, D.researchUnlocks.map(r => {
      const when = r.year ? t('ui.platforms.year', { y: r.year, m: r.month }) + (r.week ? ', s. ' + r.week : '') : '—';
      return el('li', { class: 'chip' }, [
        el('strong', { text: t('research.' + r.id) }),
        document.createTextNode(' · ' + when), refs(r.src)
      ]);
    })));
  }

  // ── 3. MATRIZ TEMA × GÉNERO ────────────────────────────────────────────────

  // 0.6→1 se mapea a cinco peldaños discretos de una rampa secuencial de un solo
  // tono, validada con el validador del skill dataviz en claro y en oscuro.
  const stepOf = v => Math.max(1, Math.min(5, Math.round((v - 0.6) / 0.1) + 1));

  function renderMatrix(root, state, onToggleColor) {
    clear(root);
    root.appendChild(sectionHeading('ui.matrix.title', '▦'));
    root.appendChild(el('p', { class: 'muted', text: t('ui.matrix.caption') }));

    // Leyenda: obligatoria, y cada peldaño filtra el resto (KPI clicable accesible).
    const legend = el('div', { class: 'legend', role: 'group', 'aria-label': t('ui.matrix.legend') }, [
      el('span', { class: 'legend-end', text: t('ui.matrix.worst') })
    ]);
    [0.6, 0.7, 0.8, 0.9, 1.0].forEach(v => {
      const s = stepOf(v);
      const btn = el('button', {
        type: 'button', class: 'legend-swatch', dataset: { step: String(s), value: String(v) },
        'aria-pressed': state.matrixHighlight === v ? 'true' : 'false',
        text: v.toFixed(1)
      });
      btn.addEventListener('click', () => {
        state.matrixHighlight = state.matrixHighlight === v ? null : v;
        renderMatrix(root, state, onToggleColor);
      });
      legend.appendChild(btn);
    });
    legend.appendChild(el('span', { class: 'legend-end', text: t('ui.matrix.best') }));

    const plainBtn = el('button', {
      type: 'button', class: 'btn btn--ghost',
      'aria-pressed': state.matrixPlain ? 'true' : 'false',
      text: state.matrixPlain ? t('ui.matrix.plainOn') : t('ui.matrix.plain')
    });
    plainBtn.addEventListener('click', () => onToggleColor());

    root.appendChild(el('div', { class: 'toolbar' }, [legend, plainBtn]));

    // La base semántica es una tabla real: el lector de pantalla recibe el
    // número, y la "vista alternativa sin color" es la propia tabla despintada.
    const thead = el('thead', {}, [el('tr', {},
      [el('th', { scope: 'col', text: t('ui.matrix.topic') })].concat(
        D.genreOrder.map(g => el('th', { scope: 'col', text: t('genre.' + g) }))))]);

    const tbody = el('tbody', {}, D.topics.map(topic => el('tr', {},
      [el('th', { scope: 'row' }, [document.createTextNode(t('topic.' + topic.id)), refs(topic.src)])].concat(
        D.genreOrder.map(g => {
          const v = topic.m[g];
          const dimmed = state.matrixHighlight !== null && Math.abs(v - state.matrixHighlight) > 1e-9;
          return el('td', {
            class: 'hm-cell' + (dimmed ? ' is-dimmed' : ''),
            dataset: { step: String(stepOf(v)) },
            'aria-label': t('ui.matrix.cellLabel', { topic: t('topic.' + topic.id), genre: t('genre.' + g), value: v.toFixed(1) }),
            text: v.toFixed(1)
          });
        })))));

    const table = el('table', { class: 'heatmap' + (state.matrixPlain ? ' is-plain' : '') }, [
      el('caption', { class: 'sr-only', text: t('ui.matrix.title') }), thead, tbody
    ]);
    root.appendChild(el('div', { class: 'table-scroll' }, [table]));

    // Combos de la comunidad: se listan aparte porque no traen multiplicador.
    root.appendChild(el('h3', { class: 'card-title', text: t('ui.matrix.community') }));
    root.appendChild(el('p', { class: 'muted' }, [
      document.createTextNode(t('ui.matrix.communityNote')), refs(['forum7705'])
    ]));
    const cg = el('div', { class: 'grid grid--3' });
    D.genreOrder.forEach(g => {
      const ids = D.communityCombos[g] || [];
      if (!ids.length) return;
      cg.appendChild(el('div', { class: 'card' }, [
        el('h4', { class: 'card-title-sm', text: t('genre.' + g) }),
        el('ul', { class: 'chip-list chip-list--tight' },
          ids.map(id => el('li', { class: 'chip chip--soft', text: t('topic.' + id) })))
      ]));
    });
    root.appendChild(cg);
  }

  // ── 4. SLIDERS Y RATIO T/D ─────────────────────────────────────────────────

  function renderSliders(root, state, onChange) {
    clear(root);
    root.appendChild(sectionHeading('ui.sliders.title', '⇄'));

    const genreSel = el('select', { id: 'slider-genre', class: 'form-select' },
      D.genres.map(g => el('option', { value: g.id, text: t('genre.' + g.id) })));
    genreSel.value = state.genre;
    genreSel.addEventListener('change', () => onChange({ genre: genreSel.value, positions: null }));

    const presetBtn = el('button', { type: 'button', class: 'btn', text: t('ui.sliders.preset') });
    presetBtn.addEventListener('click', () => onChange({ positions: E.suggestion(state.genre).positions }));

    const communityBtn = el('button', { type: 'button', class: 'btn btn--ghost', text: t('ui.sliders.presetCommunity') });
    communityBtn.addEventListener('click', () => {
      onChange({ positions: Object.assign({}, D.genres.find(g => g.id === state.genre).sliders) });
    });

    root.appendChild(el('div', { class: 'toolbar' }, [
      el('label', { class: 'field' }, [
        el('span', { text: t('ui.sliders.genre') }), genreSel
      ]),
      presetBtn, communityBtn
    ]));

    const alloc = E.allocate(state.positions);
    const points = E.techDesignPoints(alloc);
    const ratio = E.ratioTD(points);
    const verdict = E.verdictForGenre(ratio, state.genre);
    const rules = E.validateTimeRules(alloc, state.genre);
    const genre = D.genres.find(g => g.id === state.genre);

    // Sliders reales: arrastrables, con teclado nativo y etiqueta asociada.
    const phasesWrap = el('div', { class: 'phases' });
    D.phases.forEach((p, i) => {
      const group = el('fieldset', { class: 'phase' }, [
        el('legend', { text: t('ui.sliders.phase', { n: p.n }) })
      ]);
      p.fields.forEach(id => {
        const inputId = 'sl-' + id;
        const share = alloc.byPhase[i][id];
        const mark = genre.rules[id];
        const issue = rules.issues.find(x => x.field === id);

        const input = el('input', {
          type: 'range', min: '0', max: '100', step: '5', id: inputId,
          value: String(state.positions[id]),
          'aria-describedby': inputId + '-out'
        });
        input.addEventListener('input', () => {
          const next = Object.assign({}, state.positions);
          next[id] = Number(input.value);
          onChange({ positions: next });
        });

        group.appendChild(el('div', { class: 'slider-row' + (issue ? ' has-issue' : '') }, [
          el('label', { for: inputId, class: 'slider-label' }, [
            document.createTextNode(t('field.' + id)),
            el('span', { class: 'band band--' + (mark === '+' ? 'hi' : mark === '~' ? 'mid' : 'lo'), text: mark })
          ]),
          input,
          el('output', { id: inputId + '-out', class: 'slider-out' + (issue ? ' is-bad' : ''),
            for: inputId, text: I.pct(share) })
        ]));
      });
      phasesWrap.appendChild(group);
    });

    // Panel de veredicto, anunciado a lectores de pantalla al recalcular.
    const gap = E.staffGap(state.genre);
    const panel = el('div', { class: 'verdict verdict--' + verdict.status, 'aria-live': 'polite' }, [
      el('h3', { class: 'card-title', text: t('ui.sliders.verdict') }),
      el('p', { class: 'verdict-status' }, [
        el('span', { class: 'verdict-dot', 'aria-hidden': 'true' }),
        el('strong', { text: t('ui.verdict.' + verdict.status) })
      ]),
      el('dl', { class: 'kv' }, [
        el('dt', { text: t('ui.sliders.ratio') }), el('dd', { class: 'num', text: I.num(ratio) }),
        el('dt', { text: t('ui.sliders.target') }), el('dd', { class: 'num', text: I.num(genre.ratio.td) }),
        el('dt', { text: t('ui.sliders.range') }), el('dd', { class: 'num', text: `${I.num(genre.ratio.min)} – ${I.num(genre.ratio.max)}` }),
        el('dt', { text: t('ui.sliders.reachable') }), el('dd', { class: 'num', text: `${I.num(gap.range.min)} – ${I.num(gap.range.max)}` })
      ]),
      el('div', { class: 'td-bar', 'aria-hidden': 'true' }, [
        el('span', { class: 'td-bar-tech', style: `width:${(points.tech * 100).toFixed(1)}%` }),
        el('span', { class: 'td-bar-design', style: `width:${(points.design * 100).toFixed(1)}%` })
      ]),
      el('p', { class: 'td-legend' }, [
        el('span', { class: 'key key--tech' }, [el('i', { 'aria-hidden': 'true' }), document.createTextNode(`${t('ui.sliders.tech')} ${I.pct(points.tech)}`)]),
        el('span', { class: 'key key--design' }, [el('i', { 'aria-hidden': 'true' }), document.createTextNode(`${t('ui.sliders.design')} ${I.pct(points.design)}`)])
      ]),
      rules.ok
        ? el('p', { class: 'ok-note', text: t('ui.sliders.rulesOk') })
        : el('div', { class: 'issue-note' }, [
            el('p', { text: t('ui.sliders.rulesIssues') }),
            el('ul', {}, rules.issues.map(x => el('li', {
              text: t(x.direction === 'under' ? 'ui.sliders.issueUnder' : 'ui.sliders.issueOver', {
                field: t('field.' + x.field), actual: I.pct(x.actual),
                band: `${I.pct(x.band.min)}–${I.pct(x.band.max)}`
              })
            })))
          ])
    ]);

    // Cuando el objetivo del género queda fuera de lo que los sliders pueden
    // producir, se dice explícitamente y se enlaza con la contratación.
    if (gap.severity !== 'none') {
      panel.appendChild(el('div', { class: 'card card--warn' }, [
        el('h4', { class: 'card-title-sm', text: t(gap.severity === 'contradiction' ? 'ui.sliders.contradiction' : 'ui.sliders.minor') }),
        el('p', { text: t('ui.sliders.staffGapBody', {
          max: I.num(gap.direction === 'tech' ? gap.range.max : gap.range.min),
          target: I.num(gap.target),
          method: t('recruiting.' + gap.recruiting),
          direction: gap.direction === 'tech' ? t('ui.sliders.tech') : t('ui.sliders.design')
        }) }),
        refs(['guia', 'wiki139'])
      ]));
    }

    root.appendChild(el('div', { class: 'calc-layout' }, [phasesWrap, panel]));

    // Tabla auditable: de dónde sale cada punto.
    const rows = D.fields.map(f => {
      const c = points.byField[f.id];
      return el('tr', {}, [
        el('th', { scope: 'row', text: t('field.' + f.id) }),
        el('td', { class: 'num', text: I.pct(c.share) }),
        el('td', { class: 'num', text: I.num(c.tech, 3) }),
        el('td', { class: 'num', text: I.num(c.design, 3) })
      ]);
    });
    root.appendChild(el('div', { class: 'table-scroll' }, [
      el('table', { class: 'data-table' }, [
        el('caption', { text: t('ui.sliders.contribution') }),
        el('thead', {}, [el('tr', {}, [
          el('th', { scope: 'col', text: t('ui.sliders.colField') }),
          el('th', { scope: 'col', text: t('ui.sliders.colShare') }),
          el('th', { scope: 'col', text: t('ui.sliders.colTech') }),
          el('th', { scope: 'col', text: t('ui.sliders.colDesign') })
        ])]),
        el('tbody', {}, rows)
      ])
    ]));
  }

  // ── 5. PLATAFORMAS ─────────────────────────────────────────────────────────

  function renderPlatforms(root, state, onFilter) {
    clear(root);
    root.appendChild(sectionHeading('ui.platforms.title', '▤'));

    const filters = el('div', { class: 'toolbar', role: 'group', 'aria-label': t('ui.platforms.title') });
    [['ALL', 'ui.platforms.all'], ['ETERNAL', 'ui.platforms.eternal'], ['CUSTOM', 'ui.platforms.custom']]
      .forEach(([val, key]) => {
        const b = el('button', {
          type: 'button', class: 'btn btn--ghost',
          'aria-pressed': state.platformFilter === val ? 'true' : 'false',
          text: t(key)
        });
        b.addEventListener('click', () => onFilter(val));
        filters.appendChild(b);
      });
    root.appendChild(filters);

    const list = D.platforms.filter(p =>
      state.platformFilter === 'ALL' ||
      (state.platformFilter === 'ETERNAL' && p.eternal) ||
      (state.platformFilter === 'CUSTOM' && p.custom));

    const body = el('tbody', {}, list.map(p => {
      const audience = ['young', 'everyone', 'mature']
        .map(a => {
          const v = p.audienceM ? p.audienceM[a] : null;
          return v === null || v === undefined ? null : `${t('audience.' + a)} ${I.num(v)}`;
        })
        .filter(Boolean);
      return el('tr', {}, [
        el('th', { scope: 'row' }, [
          document.createTextNode(t('platform.' + p.id)),
          p.eternal ? el('span', { class: 'tag', text: '∞' }) : null,
          refs(p.src)
        ]),
        el('td', { text: p.real }),
        el('td', { text: p.year ? t('ui.platforms.year', { y: p.year, m: p.month }) : '—' }),
        el('td', { class: 'num', text: I.money(p.devCost) }),
        el('td', { class: 'num', text: I.money(p.licCost) }),
        el('td', { text: p.bestGenres.map(g => t('genre.' + g)).join(', ') || '—' }),
        el('td', { class: audience.length ? '' : 'muted',
          text: audience.length ? audience.join(' · ') : t('ui.platforms.noData') })
      ]);
    }));

    root.appendChild(el('div', { class: 'table-scroll' }, [
      el('table', { class: 'data-table' }, [
        el('thead', {}, [el('tr', {}, [
          'colName', 'colReal', 'colRelease', 'colDev', 'colLic', 'colGenres', 'colAudience'
        ].map(k => el('th', { scope: 'col', text: t('ui.platforms.' + k) })))]),
        body
      ])
    ]));
  }

  // ── 6. EQUIPO ──────────────────────────────────────────────────────────────

  function renderTeam(root) {
    clear(root);
    root.appendChild(sectionHeading('ui.team.title', '👥'));

    root.appendChild(el('h3', { class: 'card-title', text: t('ui.team.recruiting') }));
    root.appendChild(el('p', { class: 'muted', text: t('ui.team.recruitingNote') }));

    root.appendChild(el('div', { class: 'grid grid--3' }, D.recruiting.map(r => {
      const total = r.biasDesign + r.biasTech;
      return el('div', { class: 'card' }, [
        el('h4', { class: 'card-title-sm' }, [document.createTextNode(t('recruiting.' + r.id)), refs(r.src)]),
        el('p', { class: 'muted', text: `${t('ui.team.bias')}: ${r.biasDesign}:${r.biasTech}` }),
        el('div', { class: 'td-bar', 'aria-hidden': 'true' }, [
          el('span', { class: 'td-bar-design', style: `width:${(r.biasDesign / total * 100).toFixed(1)}%` }),
          el('span', { class: 'td-bar-tech', style: `width:${(r.biasTech / total * 100).toFixed(1)}%` })
        ]),
        el('p', { class: 'muted-sm', text: `${t('ui.team.roles')}: ${r.roles.map(x => t('field.' + x)).join(', ')}` })
      ]);
    })));

    root.appendChild(el('div', { class: 'table-scroll' }, [
      el('table', { class: 'data-table' }, [
        el('caption', { text: t('ui.team.specializations') }),
        el('thead', {}, [el('tr', {}, [
          el('th', { scope: 'col', text: t('ui.team.colField') }),
          el('th', { scope: 'col', text: t('ui.team.colDesign') }),
          el('th', { scope: 'col', text: t('ui.team.colTech') }),
          el('th', { scope: 'col', text: t('ui.team.colLevel') }),
          el('th', { scope: 'col', text: t('ui.team.colCost') })
        ])]),
        el('tbody', {}, D.specializations.map(s => el('tr', {}, [
          el('th', { scope: 'row' }, [document.createTextNode(t('field.' + s.id)), refs(s.src)]),
          el('td', { class: 'num', text: String(s.design) }),
          el('td', { class: 'num', text: String(s.tech) }),
          el('td', { class: 'num', text: String(s.level) }),
          el('td', { class: 'num', text: `${s.rp} RP + ${I.money(s.cost)}` })
        ])))
      ])
    ]));

    const tr = D.training;
    root.appendChild(el('div', { class: 'card' }, [
      el('h3', { class: 'card-title' }, [document.createTextNode(t('ui.team.trainingTitle')), refs(tr.src)]),
      el('p', {}, [document.createTextNode(I.getLang() === 'es'
        ? `El sistema de capacitación tiene un enfriamiento oculto que degrada la ganancia si encadenas cursos. Intercala exactamente un programa de formación por empleado entre cada desarrollo. Con las nuevas contrataciones, empieza por el Staff Welcome Training (${I.money(tr.welcomeTrainingCost)}): sube la eficiencia de ${tr.efficiencyFrom} a ${tr.efficiencyTo}. Guarda las cargas de impulso para los periodos de entrenamiento, no para el desarrollo.`
        : `Training has a hidden cooldown that degrades gains if you chain courses. Interleave exactly one training programme per employee between developments. For new hires, start with Staff Welcome Training (${I.money(tr.welcomeTrainingCost)}): it lifts efficiency from ${tr.efficiencyFrom} to ${tr.efficiencyTo}. Save Boost charges for training periods, not for development.`)])
    ]));
  }

  // ── 7. EXTRAS ──────────────────────────────────────────────────────────────

  function renderExtras(root) {
    clear(root);
    root.appendChild(sectionHeading('ui.extras.title', '☠'));

    const p = D.pirateMode;
    root.appendChild(el('div', { class: 'card' }, [
      el('h3', { class: 'card-title' }, [document.createTextNode(t('ui.extras.pirate')), refs(p.src)]),
      el('ul', { class: 'bullet' }, (I.getLang() === 'es' ? [
        `La piratería te cuesta alrededor del ${p.incomeLossPct}% de los ingresos, y golpea desde el primer día.`,
        'La protección DRM no es una investigación suelta: es un nodo dentro del árbol de desarrollo de motor propio.',
        'DRM v5 aguanta durante buena parte de la partida; DRM v6 exige tener el Laboratorio de I+D abierto.',
        `Para sobrevivir al arranque se venden acciones de la empresa —en torno al ${p.initialShareSalePct}%— y se recompran después (unos ${I.money(p.shareBuybackCost)} por ese ${p.initialShareSalePct}%).`,
        `El alquiler del garaje ronda los ${I.money(p.garageRentMonthly)} al mes y el de la oficina los ${I.money(p.officeRentMonthly)}.`,
        'Los informes de juego indican lo eficaz que está siendo tu DRM actual.'
      ] : [
        `Piracy costs you roughly ${p.incomeLossPct}% of income, and it hits from day one.`,
        'DRM protection is not a standalone research item: it is a node inside the custom-engine development tree.',
        'DRM v5 holds up for much of a playthrough; DRM v6 requires an open R&D Lab.',
        `To survive the opening you sell company shares — around ${p.initialShareSalePct}% — and buy them back later (about ${I.money(p.shareBuybackCost)} for that ${p.initialShareSalePct}%).`,
        `Garage rent runs about ${I.money(p.garageRentMonthly)} a month and office rent about ${I.money(p.officeRentMonthly)}.`,
        'Game reports tell you how effective your current DRM is.'
      ]).map(x => el('li', { text: x })))
    ]));

    root.appendChild(el('div', { class: 'card card--warn' }, [
      el('h3', { class: 'card-title', text: t('ui.extras.corrections') }),
      el('ul', { class: 'bullet' }, (I.getLang() === 'es' ? [
        'Versiones anteriores de esta guía afirmaban que «hasta el 95% de tus jugadores piratearán». La cifra documentada es cercana al 50% de los ingresos.',
        'También afirmaban que hay que «investigar DRM al ingresar a la segunda oficina». El DRM depende del árbol de motor propio, no de la oficina.',
        'Y que «si tus fondos caen por debajo de −$50K, la banca te ofrecerá un rescate». No existe tal rescate: la vía documentada es vender acciones de tu empresa.',
        'Los hitos de progresión estaban inventados. Ahora salen de la ruta crítica citada.',
        'Los juegos AAA exigen motor 3D v6, no «v5 o v6».'
      ] : [
        'Earlier versions of this guide claimed “up to 95% of your players will pirate”. The documented figure is close to 50% of income.',
        'They also claimed you must “research DRM when you reach the second office”. DRM depends on the custom-engine tree, not on the office.',
        'And that “if funds drop below −$50K the bank offers a bailout”. No such bailout exists: the documented route is selling company shares.',
        'The progression milestones were invented. They now come from the cited critical path.',
        'AAA games require a 3D v6 engine, not “v5 or v6”.'
      ]).map(x => el('li', { text: x })))
    ]));

    root.appendChild(el('h3', { class: 'card-title', text: t('ui.extras.eggs') }));
    root.appendChild(el('ul', { class: 'bullet' }, D.easterEggs.map(e =>
      el('li', {}, [document.createTextNode(t('easterEgg.' + e.id)), refs(e.src)]))));
  }

  // ── 8. FUENTES ─────────────────────────────────────────────────────────────

  function renderSources(root) {
    clear(root);
    root.appendChild(sectionHeading('ui.sources.title', '❖'));
    root.appendChild(el('p', { class: 'muted', text: t('ui.sources.note') }));

    root.appendChild(el('ol', { class: 'source-list' }, Object.entries(D.sources).map(([key, s]) =>
      el('li', { id: 'src-' + key, class: 'source' }, [
        el('span', { class: 'ref ref--' + s.kind, 'aria-hidden': 'true', text: s.kind === 'primary' ? '◆' : '◇' }),
        el('a', { href: s.url, rel: 'noopener', target: s.url.startsWith('http') ? '_blank' : null, text: s.label }),
        el('span', { class: 'muted-sm', text: ' — ' + t(s.kind === 'primary' ? 'ui.sources.primary' : 'ui.sources.community') })
      ]))));
  }

  global.GDT.ui = {
    el, clear, refs,
    renderAlgorithm, renderProgress, renderMatrix, renderSliders,
    renderPlatforms, renderTeam, renderExtras, renderSources
  };
})(window);
