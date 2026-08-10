// ===== GAME DEV TYCOON INTERACTIVE GUIDE ENGINE =====

// ── COMBOS DATABASE (Topics, Genres & Target Audiences) ──────────────
const combosData = [
  // ACTION
  { topic: "Aliens / Extraterrestres", genre: "Acción / Action", rating: "Great", audience: "Todos / Everyone", desc: "Sinergia estelar. Gráficos e IA altos aseguran éxito masivo." },
  { topic: "Cyberpunk", genre: "Acción / Action", rating: "Great", audience: "Maduro / Mature", desc: "Uno de los mejores combos para el mercado maduro con gráficos 3D." },
  { topic: "Dungeon / Mazmorras", genre: "Acción / Action", rating: "Great", audience: "Todos / Everyone", desc: "Excelente rendimiento crítico desde consolas de 16-bit." },
  { topic: "Martial Arts / Artes Marciales", genre: "Acción / Action", rating: "Great", audience: "Joven / Young", desc: "Ideal para el público joven en consolas portátiles como Gameling." },
  { topic: "Military / Militar", genre: "Acción / Action", rating: "Great", audience: "Maduro / Mature", desc: "Superventas constante en mBox y Playsystem." },
  { topic: "Post-Apocalyptic", genre: "Acción / Action", rating: "Great", audience: "Maduro / Mature", desc: "Fuerza visual y sonido potentes. Gran potencial de franquicia." },
  { topic: "Sci-Fi / Ciencia Ficción", genre: "Acción / Action", rating: "Great", audience: "Todos / Everyone", desc: "Combo comodín de altísimas ventas en todas las eras." },
  { topic: "Superheroes", genre: "Acción / Action", rating: "Great", audience: "Todos / Everyone", desc: "Éxito asegurado en consolas de sobremesa." },
  { topic: "Zombies", genre: "Acción / Action", rating: "Great", audience: "Maduro / Mature", desc: "Rendimiento crítico excelente con motores 3D v2+." },

  // ADVENTURE
  { topic: "Detective", genre: "Aventura / Adventure", rating: "Great", audience: "Todos / Everyone", desc: "Guión y Diálogos al 100% garantizan notas de 9-10." },
  { topic: "Mystery / Misterio", genre: "Aventura / Adventure", rating: "Great", audience: "Todos / Everyone", desc: "Excelente combinación narrativa de bajo costo en Tech." },
  { topic: "Fantasy / Fantasía", genre: "Aventura / Adventure", rating: "Great", audience: "Todos / Everyone", desc: "Gran atracción en consolas TES y Super TES." },
  { topic: "History / Historia", genre: "Aventura / Adventure", rating: "Great", audience: "Todos / Everyone", desc: "Combinación educativa y entretenida." },
  { topic: "Medieval", genre: "Aventura / Adventure", rating: "Great", audience: "Todos / Everyone", desc: "Gran profundidad de mundo del juego." },
  { topic: "Time Travel / Viaje en el Tiempo", genre: "Aventura / Adventure", rating: "Great", audience: "Todos / Everyone", desc: "Innovación narrativa muy valorada por las revistas." },
  { topic: "Vampire / Vampiros", genre: "Aventura / Adventure", rating: "Great", audience: "Maduro / Mature", desc: "Atrae al público maduro y exigente." },
  { topic: "Pirate / Piratas", genre: "Aventura / Adventure", rating: "Great", audience: "Todos / Everyone", desc: "⭐ Combo inicial perfecto desde el Garaje en PC." },
  { topic: "Wild West / Oeste", genre: "Aventura / Adventure", rating: "Great", audience: "Todos / Everyone", desc: "Excelente estética y guión." },

  // CASUAL
  { topic: "Comedy / Comedia", genre: "Casual", rating: "Great", audience: "Joven / Young", desc: "⭐ Rápido y barato de desarrollar en el Garaje." },
  { topic: "Music / Música", genre: "Casual", rating: "Great", audience: "Todos / Everyone", desc: "Ventas masivas en consolas con sensor de movimiento (Nuu)." },
  { topic: "Dance / Danza", genre: "Casual", rating: "Great", audience: "Todos / Everyone", desc: "Sinergia perfecta en Nuu (Wii)." },
  { topic: "Fashion / Moda", genre: "Casual", rating: "Great", audience: "Joven / Young", desc: "Popular en portátiles como Gameling y GS." },
  { topic: "Hospital", genre: "Casual", rating: "Great", audience: "Todos / Everyone", desc: "Fácil de desarrollar con alto nivel de jugabilidad." },
  { topic: "Racing / Carreras", genre: "Casual", rating: "Great", audience: "Joven / Young", desc: "⭐ Excelente opción inicial barata y rentabilísima." },
  { topic: "Sports / Deportes", genre: "Casual", rating: "Great", audience: "Todos / Everyone", desc: "Ventas constantes con bajo costo de motor." },
  { topic: "Virtual Pet / Mascota Virtual", genre: "Casual", rating: "Great", audience: "Joven / Young", desc: "Superventas en consolas portátiles." },

  // RPG
  { topic: "Dungeon / Mazmorras", genre: "RPG", rating: "Great", audience: "Todos / Everyone", desc: "Clásico infalible de RPG occidental o japonés." },
  { topic: "Fantasy / Fantasía", genre: "RPG", rating: "Great", audience: "Todos / Everyone", desc: "👑 EL REY DEL GOTY. Máximo potencial de ventas y crítica." },
  { topic: "Medieval", genre: "RPG", rating: "Great", audience: "Todos / Everyone", desc: "Mundo del juego profundo y guión épico." },
  { topic: "Sci-Fi / Ciencia Ficción", genre: "RPG", rating: "Great", audience: "Todos / Everyone", desc: "Excelente alternativa futurista para consolas CD-ROM." },
  { topic: "Superheroes", genre: "RPG", rating: "Great", audience: "Todos / Everyone", desc: "Combinación única de alto impacto comercial." },
  { topic: "Vampire / Vampiros", genre: "RPG", rating: "Great", audience: "Maduro / Mature", desc: "Gran lealtad de fans y secuelas millonarias." },
  { topic: "Post-Apocalyptic", genre: "RPG", rating: "Great", audience: "Maduro / Mature", desc: "Crea franquicias épicas estilo Fallout." },

  // SIMULATION
  { topic: "Airplane / Aviones", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Requiere IA y Gráficos de alta fidelidad." },
  { topic: "City / Ciudad", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Simulador urbano súper ventajoso en PC." },
  { topic: "Evolution / Evolución", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Innovación altísima y gran respuesta de la crítica." },
  { topic: "Farming / Granja", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Ventas muy estables a largo plazo." },
  { topic: "Government / Gobierno", genre: "Simulación / Simulation", rating: "Great", audience: "Maduro / Mature", desc: "Ideal para PC y consolas de sobremesa." },
  { topic: "Hospital", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "El mejor simulador comercial." },
  { topic: "Life / Vida", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Ventas multimillonarias en consolas de última generación." },
  { topic: "Martial Arts / Artes Marciales", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Combinación deportiva realista." },
  { topic: "Racing / Carreras", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Alto nivel de Física e IA requeridos." },
  { topic: "School / Escuela", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Muy popular en el mercado asiático e internacional." },
  { topic: "Space / Espacio", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Simulación profunda con gran motor gráfico." },
  { topic: "Transport / Transporte", genre: "Simulación / Simulation", rating: "Great", audience: "Todos / Everyone", desc: "Gran éxito en PC." },

  // STRATEGY
  { topic: "Business / Negocios", genre: "Estrategia / Strategy", rating: "Great", audience: "Todos / Everyone", desc: "Estrategia comercial pura con IA avanzada." },
  { topic: "City / Ciudad", genre: "Estrategia / Strategy", rating: "Great", audience: "Todos / Everyone", desc: "Construcción táctica de alto rendimiento." },
  { topic: "Evolution / Evolución", genre: "Estrategia / Strategy", rating: "Great", audience: "Todos / Everyone", desc: "Innovación temática superior." },
  { topic: "Government / Gobierno", genre: "Estrategia / Strategy", rating: "Great", audience: "Maduro / Mature", desc: "Geopolítica y táctica profunda." },
  { topic: "History / Historia", genre: "Estrategia / Strategy", rating: "Great", audience: "Todos / Everyone", desc: "El clásico de la estrategia por turnos." },
  { topic: "Medieval", genre: "Estrategia / Strategy", rating: "Great", audience: "Todos / Everyone", desc: "Conquista táctica con alta rejugabilidad." },
  { topic: "Military / Militar", genre: "Estrategia / Strategy", rating: "Great", audience: "Maduro / Mature", desc: "Ventas masivas aseguradas." },
  { topic: "Sci-Fi / Ciencia Ficción", genre: "Estrategia / Strategy", rating: "Great", audience: "Todos / Everyone", desc: "Estrategia espacial en tiempo real." },
  { topic: "Space / Espacio", genre: "Estrategia / Strategy", rating: "Great", audience: "Todos / Everyone", desc: "Gran cuota de mercado en PC." },
  { topic: "Transport / Transporte", genre: "Estrategia / Strategy", rating: "Great", audience: "Todos / Everyone", desc: "Logística y simulación táctica." }
];

// ── CONSOLES DATABASE (Platforms & Specs) ───────────────────────────
const consolesData = [
  { name: "Govodore G64", real: "Commodore 64", time: "Año 1, M1", devCost: "$20K", licCost: "Gratis", share: "Medio", audience: "Joven / Todos", bestGenres: "Casual, Acción", desc: "Consola inicial. Baja cuota pero ideal para el Garaje." },
  { name: "PC", real: "PC Ordenador", time: "Año 1, M1", devCost: "$30K", licCost: "Gratis", share: "Constante", audience: "Todos / Maduro", bestGenres: "Estrategia, Simulación, RPG", desc: "Plataforma permanente. Nunca expira del mercado.", eternal: true },
  { name: "TES", real: "NES (Famicom)", time: "Año 2, M1", devCost: "$80K", licCost: "$80K", share: "Dominante", audience: "Joven / Todos", bestGenres: "Acción, Aventura", desc: "Primera gran consola de sobremesa de 8-bits." },
  { name: "Master V", real: "Master System", time: "Año 3, M2", devCost: "$70K", licCost: "$60K", share: "Medio", audience: "Joven", bestGenres: "Acción, Casual", desc: "Competencia de TES con buena acogida en público joven." },
  { name: "Gameling", real: "Game Boy", time: "Año 3, M9", devCost: "$90K", licCost: "$100K", share: "Masivo (Portátil)", audience: "Joven / Todos", bestGenres: "Casual, Aventura, RPG", desc: "La reina de las portátiles durante años." },
  { name: "Vena Gear", real: "Game Gear", time: "Año 4, M2", devCost: "$110K", licCost: "$120K", share: "Bajo", audience: "Joven", bestGenres: "Acción", desc: "Portátil a color de menor cuota que Gameling." },
  { name: "Vena Oasis", real: "Sega Genesis", time: "Año 5, M2", devCost: "$150K", licCost: "$200K", share: "Alto", audience: "Todos / Maduro", bestGenres: "Acción, Deportes", desc: "Gran consola de 16-bits." },
  { name: "Super TES", real: "SNES", time: "Año 5, M12", devCost: "$160K", licCost: "$220K", share: "Dominante", audience: "Todos / Maduro", bestGenres: "RPG, Aventura, Acción", desc: "Plataforma dorada para RPGs de 16-bits." },
  { name: "Playsystem", real: "PlayStation 1", time: "Año 7, M7", devCost: "$250K", licCost: "$500K", share: "Líder 32-bit", audience: "Todos / Maduro", bestGenres: "Acción, RPG, Simulación", desc: "Revolución 3D y CD-ROM." },
  { name: "TES 64", real: "Nintendo 64", time: "Año 9, M2", devCost: "$280K", licCost: "$550K", share: "Alto", audience: "Todos", bestGenres: "Aventura, Acción", desc: "Consola 3D de alta fidelidad." },
  { name: "DreamVast", real: "Dreamcast", time: "Año 10, M8", devCost: "$300K", licCost: "$600K", share: "Medio", audience: "Todos", bestGenres: "Acción, Carreras", desc: "Pionera online." },
  { name: "Playsystem 2", real: "PlayStation 2", time: "Año 11, M5", devCost: "$400K", licCost: "$1M", share: "Superventas Histórico", audience: "Todos / Maduro", bestGenres: "Acción, RPG, Simulación", desc: "La consola más exitosa de la historia en el juego." },
  { name: "mBox", real: "Xbox", time: "Año 11, M12", devCost: "$420K", licCost: "$1.1M", share: "Alto", audience: "Maduro", bestGenres: "Acción, Shooter, Estrategia", desc: "Excelente para el mercado maduro." },
  { name: "Game Sphere", real: "GameCube", time: "Año 12, M12", devCost: "$380K", licCost: "$900K", share: "Medio", audience: "Joven / Todos", bestGenres: "Aventura, Casual", desc: "Gran afinidad con público familiar." },
  { name: "PPS", real: "PSP", time: "Año 14, M3", devCost: "$450K", licCost: "$1.2M", share: "Alto (Portátil)", audience: "Todos", bestGenres: "Acción, RPG", desc: "Portátil multimedia de alta definición." },
  { name: "mBox 360", real: "Xbox 360", time: "Año 16, M8", devCost: "$600K", licCost: "$2M", share: "Líder HD", audience: "Maduro / Todos", bestGenres: "Acción, RPG, Shooters", desc: "Dominante en la era HD." },
  { name: "Nuu", real: "Nintendo Wii", time: "Año 17, M4", devCost: "$500K", licCost: "$1.8M", share: "Masivo Casual", audience: "Joven / Todos", bestGenres: "Casual, Música, Deportes", desc: "Revolución de controles por movimiento." },
  { name: "Playsystem 3", real: "PlayStation 3", time: "Año 17, M12", devCost: "$650K", licCost: "$2.2M", share: "Líder HD", audience: "Todos / Maduro", bestGenres: "Acción, RPG, Aventura", desc: "Potencia gráfica Blu-ray." },
  { name: "GrPhone / MPad", real: "iOS / Android / iPad", time: "Año 18+", devCost: "$100K", licCost: "$300K", share: "Masivo Móvil", audience: "Joven / Casual", bestGenres: "Casual, Puzzles", desc: "Mercado móvil con costos de dev bajos y microtransacciones." },
  { name: "Playsystem 4", real: "PlayStation 4", time: "Año 22, M3", devCost: "$900K", licCost: "$3.5M", share: "Generación Actual", audience: "Todos / Maduro", bestGenres: "AAA, RPG, Acción", desc: "Requerida para juegos AAA de máxima categoría." },
  { name: "Consola Propia", real: "Hardware Lab Custom", time: "Etapa 4 (I+D)", devCost: "Variable", licCost: "Propietario", share: "100% de Ganancias", audience: "Ajustable", bestGenres: "Todos", desc: "Desbloqueada en el Laboratorio de Hardware. ¡Genera regalías absolutas!", custom: true }
];

// ── SLIDERS DATABASE (By Genre & Development Phase) ─────────────────
const slidersDB = {
  action: {
    label: "Acción / Action",
    ratio: "Alto Tech / Medio Diseño",
    phase1: { engine: 100, gameplay: 80, story: 20 },
    phase2: { ai: 100, level: 80, dialogues: 20 },
    phase3: { graphics: 100, sound: 80, world: 20 },
    tips: [
      "Prioriza el Motor Gráfico y la IA por encima del Guión.",
      "Excelente sinergia con consolas Vena Oasis, Playsystem y mBox.",
      "Invierte en Gráficos 3D en cuanto los investigues."
    ]
  },
  adventure: {
    label: "Aventura / Adventure",
    ratio: "Alto Diseño / Bajo Tech",
    phase1: { story: 100, gameplay: 80, engine: 20 },
    phase2: { dialogues: 100, level: 80, ai: 20 },
    phase3: { world: 100, sound: 80, graphics: 40 },
    tips: [
      "El Guión y los Diálogos son el 80% del éxito crítico.",
      "Puedes ahorrar significativamente en el Motor Gráfico.",
      "Ideal para lanzar en consolas con CD-ROM y PC."
    ]
  },
  casual: {
    label: "Casual",
    ratio: "Medio Tech / Medio Diseño",
    phase1: { gameplay: 100, engine: 80, story: 0 },
    phase2: { level: 100, ai: 60, dialogues: 0 },
    phase3: { graphics: 100, sound: 80, world: 0 },
    tips: [
      "Elimina por completo el Guión y los Diálogos (0%).",
      "Maximiza la Jugabilidad y el Diseño de Niveles.",
      "Bajísimo costo de producción, ideal para acumular capital rápido."
    ]
  },
  rpg: {
    label: "RPG",
    ratio: "Alto Diseño / Alto Tech (Exigente)",
    phase1: { story: 100, gameplay: 80, engine: 40 },
    phase2: { dialogues: 100, world: 80, level: 40 },
    phase3: { graphics: 100, sound: 80, ai: 40 },
    tips: [
      "Requiere un equipo equilibrado de especialistas en Diseño y Tech.",
      "RPG + Fantasía es la combinación con mayor tasa de GOTY en el juego.",
      "Evita lanzar RPGs en consolas portátiles baratas."
    ]
  },
  simulation: {
    label: "Simulación / Simulation",
    ratio: "Alto Tech / Medio Diseño",
    phase1: { engine: 100, gameplay: 100, story: 0 },
    phase2: { ai: 100, level: 80, dialogues: 20 },
    phase3: { graphics: 80, sound: 80, world: 40 },
    tips: [
      "El Motor y la IA deben estar al máximo absoluto.",
      "El Guión no aporta valor relevante.",
      "Plataforma estrella: PC y consolas de sobremesa."
    ]
  },
  strategy: {
    label: "Estrategia / Strategy",
    ratio: "Alto Tech / Medio Diseño",
    phase1: { gameplay: 100, engine: 80, story: 20 },
    phase2: { ai: 100, level: 80, dialogues: 20 },
    phase3: { graphics: 80, sound: 60, world: 40 },
    tips: [
      "La Inteligencia Artificial (IA) y la Jugabilidad son fundamentales.",
      "Superventas indiscutible en la plataforma PC.",
      "Guarda tus mejores motores de física para este género."
    ]
  }
};

// ── TAB SWITCHING LOGIC ──────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  const targetContent = document.getElementById(`sec-${tabId}`);
  const targetBtn     = document.getElementById(`tab-${tabId}`);
  
  if (targetContent) targetContent.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── RENDER & FILTER COMBOS TABLE ─────────────────────────────────────
function renderCombos(list) {
  const tbody = document.getElementById('combo-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--clr-muted);">No se encontraron combinaciones que coincidan con la búsqueda.</td></tr>`;
    return;
  }
  
  list.forEach(item => {
    const tr = document.createElement('tr');
    const badgeClass = item.rating === 'Great' ? 'badge-great' : (item.rating === 'Good' ? 'badge-good' : 'badge-bad');
    const badgeText  = item.rating === 'Great' ? '⭐ ¡Excelente!' : (item.rating === 'Good' ? '✅ Bueno' : '❌ Malo');
    
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--clr-cyan);">${item.topic}</td>
      <td style="font-weight:600;">${item.genre}</td>
      <td><span class="badge ${badgeClass}">${badgeText}</span></td>
      <td><span class="badge badge-purple"><i class="fa-solid fa-users" style="margin-right:4px;"></i>${item.audience}</span></td>
      <td style="font-size:0.82rem; color:var(--clr-muted);">${item.desc}</td>
    `;
    tbody.appendChild(tr);
  });
}

function filterCombos() {
  const searchVal   = (document.getElementById('combo-search')?.value || '').toLowerCase();
  const genreVal    = document.getElementById('combo-genre-filter')?.value || 'ALL';
  const audienceVal = document.getElementById('combo-audience-filter')?.value || 'ALL';
  
  const filtered = combosData.filter(item => {
    const matchSearch   = item.topic.toLowerCase().includes(searchVal) ||
                          item.genre.toLowerCase().includes(searchVal) ||
                          item.desc.toLowerCase().includes(searchVal);
    const matchGenre    = genreVal === 'ALL' || item.genre.includes(genreVal);
    const matchAudience = audienceVal === 'ALL' || item.audience.includes(audienceVal);
    
    return matchSearch && matchGenre && matchAudience;
  });
  
  renderCombos(filtered);
}

// ── RENDER & FILTER CONSOLES ─────────────────────────────────────────
function renderConsoles(filter = 'ALL') {
  const container = document.getElementById('consoles-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  const filtered = consolesData.filter(c => {
    if (filter === 'ALL') return true;
    if (filter === 'ETERNAL') return c.eternal === true;
    if (filter === 'CUSTOM') return c.custom === true;
    return true;
  });
  
  filtered.forEach(c => {
    const card = document.createElement('div');
    card.className = `console-card ${c.custom ? 'border-gold' : ''}`;
    
    card.innerHTML = `
      <div class="console-header">
        <div class="console-title">${c.name}</div>
        ${c.eternal ? `<span class="badge badge-great">∞ Permanente</span>` : ''}
        ${c.custom ? `<span class="badge badge-gold">⭐ Consola Propia</span>` : ''}
      </div>
      <div style="font-size:0.82rem; color:var(--clr-cyan); margin-bottom:0.4rem;">
        <i class="fa-solid fa-gamepad"></i> Real: <strong>${c.real}</strong> | 🗓️ <strong>${c.time}</strong>
      </div>
      <div style="font-size:0.85rem; color:var(--clr-muted); margin-bottom:0.75rem;">${c.desc}</div>
      <div class="console-stats">
        <div><span style="color:var(--clr-subtle)">Dev:</span> <strong>${c.devCost}</strong></div>
        <div><span style="color:var(--clr-subtle)">Licencia:</span> <strong style="color:var(--clr-gold)">${c.licCost}</strong></div>
        <div><span style="color:var(--clr-subtle)">Público:</span> <strong>${c.audience}</strong></div>
        <div><span style="color:var(--clr-subtle)">Mejores:</span> <strong style="color:var(--clr-green)">${c.bestGenres}</strong></div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ── INTERACTIVE SLIDERS CALCULATOR UPDATER ──────────────────────────
function updateSlidersCalculator() {
  const genreKey = document.getElementById('calc-genre-select')?.value || 'action';
  const data     = slidersDB[genreKey];
  
  if (!data) return;
  
  // Update header text & ratio
  const labelEl = document.getElementById('calc-genre-label');
  const ratioEl = document.getElementById('calc-ratio-badge');
  
  if (labelEl) labelEl.textContent = data.label;
  if (ratioEl) ratioEl.textContent = `⚖️ Balance: ${data.ratio}`;
  
  // Phase 1 Sliders
  setSliderVisual('p1-s1', 'Engine / Motor', data.phase1.engine);
  setSliderVisual('p1-s2', 'Gameplay / Jugabilidad', data.phase1.gameplay);
  setSliderVisual('p1-s3', 'Story / Guión', data.phase1.story);
  
  // Phase 2 Sliders
  setSliderVisual('p2-s1', 'AI / Inteligencia Artificial', data.phase2.ai || data.phase2.dialogues);
  setSliderVisual('p2-s2', 'Level Design / Diseño Niveles', data.phase2.level || data.phase2.world);
  setSliderVisual('p2-s3', 'Dialogues / Diálogos', data.phase2.dialogues !== undefined ? data.phase2.dialogues : 20);
  
  // Phase 3 Sliders
  setSliderVisual('p3-s1', 'Graphics / Gráficos', data.phase3.graphics);
  setSliderVisual('p3-s2', 'Sound / Sonido', data.phase3.sound);
  setSliderVisual('p3-s3', 'World Design / Mundo', data.phase3.world);
  
  // Tips list
  const tipsEl = document.getElementById('calc-tips-list');
  if (tipsEl) {
    tipsEl.innerHTML = data.tips.map(t => `<li style="margin-bottom:0.3rem; color:var(--clr-muted); font-size:0.85rem;"><i class="fa-solid fa-check" style="color:var(--clr-green); margin-right:6px;"></i>${t}</li>`).join('');
  }
}

function setSliderVisual(idPrefix, title, value) {
  const fillEl  = document.getElementById(`${idPrefix}-fill`);
  const valEl   = document.getElementById(`${idPrefix}-val`);
  const titleEl = document.getElementById(`${idPrefix}-title`);
  
  if (fillEl) fillEl.style.width = `${value}%`;
  if (valEl) valEl.textContent  = `${value}%`;
  if (titleEl) titleEl.textContent = title;
}

// ── INIT ON DOM LOAD ────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  renderCombos(combosData);
  renderConsoles('ALL');
  updateSlidersCalculator();
});
