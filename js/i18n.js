/**
 * GAME DEV TYCOON — DICCIONARIO ES/EN
 * ====================================
 * Solo cadenas. Ni un solo número vive aquí: los datos numéricos están en
 * js/data.js indexados por el mismo `id`, así que añadir un idioma no puede
 * alterar un multiplicador.
 */

(function (global) {
  'use strict';

  const DICT = {
    es: {
      ui: {
        'brand.subtitle': 'Guía Estratégica Basada en Fuentes',
        'nav.label': 'Secciones de la guía',
        'nav.algorithm': 'Cómo puntúa',
        'nav.progress': 'Progresión',
        'nav.matrix': 'Matriz',
        'nav.sliders': 'Sliders',
        'nav.platforms': 'Plataformas',
        'nav.team': 'Equipo',
        'nav.extras': 'Extras',
        'nav.sources': 'Fuentes',
        'skip': 'Saltar al contenido',
        'lang.toggle': 'Cambiar idioma',
        'theme.toggle': 'Cambiar tema',
        'theme.light': 'Tema claro',
        'theme.dark': 'Tema oscuro',

        'matrix.title': 'Multiplicador de compatibilidad tema × género',
        'matrix.caption': 'Valores de 0.6 (incompatible) a 1.0 (óptimo). El número se imprime en cada celda: el color nunca es la única señal.',
        'matrix.topic': 'Tema',
        'matrix.legend': 'Escala de compatibilidad',
        'matrix.worst': 'Incompatible',
        'matrix.best': 'Óptimo',
        'matrix.plain': 'Sin color',
        'matrix.plainOn': 'Mostrar color',
        'matrix.community': 'Combos reportados por la comunidad',
        'matrix.communityNote': 'Estas combinaciones se citan como buenas en el foro de Greenheart, pero no tienen multiplicador numérico publicado. Se listan aparte para no rellenar la matriz con valores inventados.',
        'matrix.cellLabel': '{topic} con {genre}: {value}',

        'sliders.title': 'Reparto de tiempo y ratio Tecnología / Diseño',
        'sliders.genre': 'Género del juego',
        'sliders.preset': 'Reparto óptimo calculado',
        'sliders.presetCommunity': 'Reparto de la comunidad',
        'sliders.reset': 'Restablecer',
        'sliders.phase': 'Etapa {n}',
        'sliders.share': 'del tiempo de la etapa',
        'sliders.verdict': 'Veredicto',
        'sliders.ratio': 'Ratio T/D obtenido',
        'sliders.target': 'Objetivo del género',
        'sliders.range': 'Rango tolerado',
        'sliders.tech': 'Tecnología',
        'sliders.design': 'Diseño',
        'sliders.rulesOk': 'El reparto respeta las tres reglas de tiempo de la guía.',
        'sliders.rulesIssues': 'Campos fuera de su banda de tiempo:',
        'sliders.issueUnder': '{field}: {actual} — la guía pide {band}',
        'sliders.issueOver': '{field}: {actual} — la guía pide {band}',
        'sliders.contribution': 'Aporte por campo',
        'sliders.colField': 'Campo',
        'sliders.colShare': 'Cuota',
        'sliders.colTech': 'Puntos T',
        'sliders.colDesign': 'Puntos D',
        'sliders.reachable': 'Alcanzable solo con sliders',
        'sliders.staffGapTitle': 'Los sliders no bastan para este género',
        'sliders.staffGapBody': 'Con las reglas de tiempo que la propia guía exige, el reparto de sliders solo alcanza un ratio de {max}. El objetivo del género es {target}. La diferencia la aporta la composición de la plantilla: el ratio se mide sobre los puntos acumulados, y esos puntos dependen de las habilidades D/T de quien los genera. Contrata con el método {method} para desplazar el ratio hacia {direction}.',
        'sliders.contradiction': 'Contradicción entre dos tablas de la guía',
        'sliders.minor': 'El óptimo exacto no es alcanzable solo con sliders',

        'verdict.optimal': 'Óptimo',
        'verdict.acceptable': 'Aceptable',
        'verdict.off': 'Fuera de rango',

        'algorithm.title': 'Cómo puntúa el juego',
        'algorithm.formulaTitle': 'La fórmula del Game Score',
        'algorithm.modifiers': 'Los seis factores de calidad',
        'algorithm.inflationTitle': 'La trampa de inflación de puntuación',
        'algorithm.penaltiesTitle': 'Penalizaciones automáticas',
        'algorithm.colInfraction': 'Infracción',
        'algorithm.colMechanism': 'Mecanismo',
        'algorithm.colSeverity': 'Severidad',

        'severity.critical': 'Crítica',
        'severity.high': 'Alta',
        'severity.medium': 'Media',

        'progress.title': 'Ruta crítica de progresión',
        'progress.stage': '¿En qué etapa vas?',
        'progress.stageAll': 'Ver todo',
        'progress.next': 'Siguiente hito',
        'progress.req.cash': 'Caja',
        'progress.req.time': 'Momento',
        'progress.req.staff': 'Empleados',
        'progress.req.rp': 'Puntos de investigación',
        'progress.req.specialist': 'Especialista',
        'progress.unlocks': 'Desbloqueos por investigación',
        'progress.done': 'Hecho',
        'progress.completed': '{done} de {total} hitos marcados',

        'platforms.title': 'Plataformas y multiplicadores',
        'platforms.all': 'Todas',
        'platforms.eternal': 'Permanentes',
        'platforms.custom': 'Consola propia',
        'platforms.colName': 'Plataforma',
        'platforms.colReal': 'Equivalente real',
        'platforms.colRelease': 'Disponible',
        'platforms.colDev': 'Coste de desarrollo',
        'platforms.colLic': 'Licencia',
        'platforms.colGenres': 'Géneros afines',
        'platforms.colAudience': 'Multiplicador de público',
        'platforms.free': 'Gratis',
        'platforms.noData': 'sin dato publicado',
        'platforms.year': 'Año {y}, mes {m}',

        'team.title': 'Equipo, formación e I+D',
        'team.recruiting': 'Métodos de contratación',
        'team.recruitingNote': 'El método de búsqueda sesga las estadísticas del candidato.',
        'team.bias': 'Sesgo Diseño : Tecnología',
        'team.roles': 'Destinos recomendados',
        'team.specializations': 'Requisitos de especialización',
        'team.colField': 'Especialidad',
        'team.colDesign': 'Diseño',
        'team.colTech': 'Tecnología',
        'team.colLevel': 'Nivel',
        'team.colCost': 'Coste',
        'team.trainingTitle': 'Formación y enfriamiento',

        'extras.title': 'Modo pirata y secretos',
        'extras.pirate': 'Modo antipiratería',
        'extras.eggs': 'Easter eggs verificados',
        'extras.corrections': 'Correcciones respecto a versiones anteriores de esta guía',

        'sources.title': 'Fuentes',
        'sources.primary': 'Fuente primaria',
        'sources.community': 'Comunidad',
        'sources.note': 'Cada dato numérico de esta guía enlaza a la fuente que lo respalda. Donde una fuente no publica un valor, se muestra «sin dato» en lugar de una estimación.',
        'sources.ref': 'Fuente: {label}',

        'empty': 'No hay resultados para esta combinación.',
        'error.data': 'No se han podido cargar los datos de la guía. Comprueba que la carpeta js/ acompaña a index.html.'
      },
      genre: { action: 'Acción', adventure: 'Aventura', rpg: 'RPG', simulation: 'Simulación', strategy: 'Estrategia', casual: 'Casual' },
      audience: { young: 'Joven', everyone: 'Todos', mature: 'Maduro' },
      field: {
        engine: 'Motor', gameplay: 'Jugabilidad', story: 'Historia / Misiones',
        dialogues: 'Diálogos', levelDesign: 'Diseño de nivel', ai: 'Inteligencia artificial',
        worldDesign: 'Diseño de mundo', graphics: 'Gráficos', sound: 'Sonido'
      },
      topic: {
        aliens: 'Aliens', cyberpunk: 'Ciberpunk', sports: 'Deportes', detective: 'Detective',
        fantasy: 'Fantasía', military: 'Militar', mystery: 'Misterio', business: 'Negocios',
        pirate: 'Piratas', scifi: 'Ciencia ficción', horror: 'Terror', vampire: 'Vampiros',
        airplane: 'Aviones', altHistory: 'Historia alternativa', dungeon: 'Mazmorras',
        hunting: 'Caza', medieval: 'Medieval', music: 'Música', martialArts: 'Artes marciales',
        history: 'Historia', postApocalyptic: 'Postapocalíptico', prison: 'Prisión',
        space: 'Espacio', spy: 'Espionaje', superheroes: 'Superhéroes', timeTravel: 'Viaje en el tiempo',
        rhythm: 'Ritmo', werewolf: 'Hombre lobo', zombies: 'Zombis', school: 'Escuela',
        law: 'Derecho', life: 'Vida', romance: 'Romance', fashion: 'Moda', wildWest: 'Lejano Oeste',
        city: 'Ciudad', evolution: 'Evolución', government: 'Gobierno', hacking: 'Hacking',
        transport: 'Transporte', ufo: 'OVNIs', vocabulary: 'Vocabulario'
      },
      platform: {
        pc: 'PC', govodore: 'Govodore G64', tes: 'TES', masterV: 'Master V', gameling: 'Gameling',
        venaGear: 'Vena Gear', venaOasis: 'Vena Oasis', superTes: 'Super TES', playsystem: 'Playsystem',
        tes64: 'TES 64', dreamvast: 'DreamVast', playsystem2: 'Playsystem 2', mbox: 'mBox',
        gameSphere: 'Game Sphere', pps: 'PPS', mbox360: 'mBox 360', nuu: 'Nuu',
        playsystem3: 'Playsystem 3', grPhone: 'GrPhone / mPad', playsystem4: 'Playsystem 4',
        custom: 'Consola propia'
      },
      modifier: {
        topicGenre: 'Compatibilidad tema × género',
        platformGenre: 'Afinidad plataforma × género',
        tdRatio: 'Alineación del ratio T/D',
        sliderTime: 'Cumplimiento de las bandas de tiempo',
        bugsCleared: 'Erradicación de errores antes del lanzamiento',
        trend: 'Aprovechamiento de tendencias'
      },
      milestone: {
        office2: 'Oficina Nivel 2',
        office2plus: 'Ampliación de la Oficina Nivel 2',
        office3: 'Oficina Nivel 3 (sede final)',
        rndLab: 'Laboratorio de I+D',
        hardwareLab: 'Laboratorio de Hardware',
        aaa: 'Producciones AAA',
        ownConsole: 'Consola propia'
      },
      milestoneBody: {
        office2: 'Sales del garaje. Desbloquea contratación de personal, juegos medianos y contratos de edición.',
        office2plus: 'Amplía la primera oficina y habilita formación avanzada.',
        office3: 'Sede definitiva. Desbloquea juegos grandes, los laboratorios especializados y tu propia convención.',
        rndLab: 'Habilita la investigación de redes MMO, Codename: Grid y los proyectos AAA. Asígnale presupuesto continuo cuando no investigue nada concreto: genera puntos de investigación sin consumir tiempo del equipo.',
        hardwareLab: 'Habilita la fabricación y comercialización de tu propia consola.',
        aaa: 'Exige motor 3D v6 y tres especialistas asignados. Sin ambos, la puntuación técnica se desploma.',
        ownConsole: 'Las especificaciones se adaptan a tu historial: los dos géneros que más hayas producido y el público más frecuentado reciben el multiplicador máximo.'
      },
      research: {
        targetAudience: 'Público objetivo', casualGames: 'Juegos casuales', marketing: 'Marketing',
        sequels: 'Secuelas', multiGenre: 'Multi-género', expansionPack: 'Paquetes de expansión'
      },
      penalty: {
        repeatCombo: 'Repetición consecutiva',
        earlySequel: 'Secuela prematura',
        staleEngine: 'Motor obsoleto en secuela',
        scaleMismatch: 'Escala incompatible con el motor',
        aaaRequirements: 'Requisitos AAA incompletos'
      },
      penaltyBody: {
        repeatCombo: 'Lanzar dos juegos seguidos con el mismo tema y género.',
        earlySequel: 'Publicar una secuela o expansión antes de que pasen 40 semanas.',
        staleEngine: 'Desarrollar una secuela con el mismo motor que el título original.',
        scaleMismatch: 'Crear juegos grandes con gráficos 2D v3 o inferiores, o 3D v2 o inferiores.',
        aaaRequirements: 'Producir un título AAA sin motor 3D v6 o sin tres especialistas asignados.'
      },
      recruiting: { algorithms: 'Algoritmos', showreel: 'Muestra de trabajos', gameDemo: 'Demo de juego' },
      easterEgg: {
        pong: 'Llama «Pong» a tu primer juego mientras estás en el garaje.',
        wingCommander: 'Llama «Wing Commander» a un juego en la segunda oficina, antes de la reforma.',
        doom: 'Llama «Doom» a un juego en la segunda oficina, antes de la reforma.',
        halfLife: 'Llama «Half-Life» a un juego en la segunda oficina, tras la reforma.',
        themeHospital: 'Llama «Theme Hospital» a un juego en la segunda oficina, tras la reforma.',
        halo: 'Llama «Halo» a un juego una vez abierto el Laboratorio de I+D.',
        starCitizen: 'Llama «Star Citizen» a un juego una vez abierto el Laboratorio de I+D.',
        okami: 'Llama «Okami» a un juego una vez abierto el Laboratorio de I+D.',
        greenheartName: 'Nombra tu empresa «Greenheart Games».',
        gdtGame: 'Crea un juego llamado «Game Dev Tycoon» del género Game Dev Sim.',
        redBarrels: 'Dave Johnson te pedirá barriles rojos explosivos: inclúyelos en un juego de acción y te ofrecerá tarta.',
        elevenOutOfTen: 'Tras un juego con nota 10 perfecta, puedes recibir aleatoriamente un 11.'
      },
      stage: { 1: 'Garaje', 2: 'Oficina 2', 3: 'Oficina 3', 4: 'Sede final' }
    },

    en: {
      ui: {
        'brand.subtitle': 'Source-Backed Strategy Guide',
        'nav.label': 'Guide sections',
        'nav.algorithm': 'Scoring',
        'nav.progress': 'Progression',
        'nav.matrix': 'Matrix',
        'nav.sliders': 'Sliders',
        'nav.platforms': 'Platforms',
        'nav.team': 'Team',
        'nav.extras': 'Extras',
        'nav.sources': 'Sources',
        'skip': 'Skip to content',
        'lang.toggle': 'Switch language',
        'theme.toggle': 'Switch theme',
        'theme.light': 'Light theme',
        'theme.dark': 'Dark theme',

        'matrix.title': 'Topic × genre compatibility multiplier',
        'matrix.caption': 'Values from 0.6 (incompatible) to 1.0 (optimal). The number is printed in every cell: colour is never the only cue.',
        'matrix.topic': 'Topic',
        'matrix.legend': 'Compatibility scale',
        'matrix.worst': 'Incompatible',
        'matrix.best': 'Optimal',
        'matrix.plain': 'No colour',
        'matrix.plainOn': 'Show colour',
        'matrix.community': 'Community-reported combos',
        'matrix.communityNote': 'These combinations are cited as strong on the Greenheart forum but have no published numeric multiplier. They are listed separately rather than padding the matrix with invented values.',
        'matrix.cellLabel': '{topic} with {genre}: {value}',

        'sliders.title': 'Time allocation and Tech / Design ratio',
        'sliders.genre': 'Game genre',
        'sliders.preset': 'Computed optimal allocation',
        'sliders.presetCommunity': 'Community allocation',
        'sliders.reset': 'Reset',
        'sliders.phase': 'Stage {n}',
        'sliders.share': 'of the stage time',
        'sliders.verdict': 'Verdict',
        'sliders.ratio': 'Resulting T/D ratio',
        'sliders.target': 'Genre target',
        'sliders.range': 'Tolerated range',
        'sliders.tech': 'Technology',
        'sliders.design': 'Design',
        'sliders.rulesOk': 'The allocation respects all three time rules from the guide.',
        'sliders.rulesIssues': 'Fields outside their time band:',
        'sliders.issueUnder': '{field}: {actual} — the guide asks for {band}',
        'sliders.issueOver': '{field}: {actual} — the guide asks for {band}',
        'sliders.contribution': 'Contribution by field',
        'sliders.colField': 'Field',
        'sliders.colShare': 'Share',
        'sliders.colTech': 'T points',
        'sliders.colDesign': 'D points',
        'sliders.reachable': 'Reachable with sliders alone',
        'sliders.staffGapTitle': 'Sliders alone are not enough for this genre',
        'sliders.staffGapBody': 'Under the time rules the guide itself demands, slider allocation only reaches a ratio of {max}. The genre target is {target}. The gap is covered by team composition: the ratio is measured on accumulated points, and those points depend on the D/T skills of whoever generates them. Recruit via {method} to shift the ratio toward {direction}.',
        'sliders.contradiction': 'Contradiction between two tables in the guide',
        'sliders.minor': 'The exact optimum is not reachable with sliders alone',

        'verdict.optimal': 'Optimal',
        'verdict.acceptable': 'Acceptable',
        'verdict.off': 'Out of range',

        'algorithm.title': 'How the game scores you',
        'algorithm.formulaTitle': 'The Game Score formula',
        'algorithm.modifiers': 'The six quality factors',
        'algorithm.inflationTitle': 'The score inflation trap',
        'algorithm.penaltiesTitle': 'Automatic penalties',
        'algorithm.colInfraction': 'Infraction',
        'algorithm.colMechanism': 'Mechanism',
        'algorithm.colSeverity': 'Severity',

        'severity.critical': 'Critical',
        'severity.high': 'High',
        'severity.medium': 'Medium',

        'progress.title': 'Critical progression path',
        'progress.stage': 'Which stage are you at?',
        'progress.stageAll': 'Show all',
        'progress.next': 'Next milestone',
        'progress.req.cash': 'Cash',
        'progress.req.time': 'Timing',
        'progress.req.staff': 'Staff',
        'progress.req.rp': 'Research points',
        'progress.req.specialist': 'Specialist',
        'progress.unlocks': 'Research unlocks',
        'progress.done': 'Done',
        'progress.completed': '{done} of {total} milestones checked',

        'platforms.title': 'Platforms and multipliers',
        'platforms.all': 'All',
        'platforms.eternal': 'Permanent',
        'platforms.custom': 'Own console',
        'platforms.colName': 'Platform',
        'platforms.colReal': 'Real-world equivalent',
        'platforms.colRelease': 'Available',
        'platforms.colDev': 'Dev cost',
        'platforms.colLic': 'Licence',
        'platforms.colGenres': 'Affine genres',
        'platforms.colAudience': 'Audience multiplier',
        'platforms.free': 'Free',
        'platforms.noData': 'no published figure',
        'platforms.year': 'Year {y}, month {m}',

        'team.title': 'Team, training and R&D',
        'team.recruiting': 'Recruitment methods',
        'team.recruitingNote': 'The search method biases the candidate’s stats.',
        'team.bias': 'Design : Technology bias',
        'team.roles': 'Recommended assignments',
        'team.specializations': 'Specialization requirements',
        'team.colField': 'Specialty',
        'team.colDesign': 'Design',
        'team.colTech': 'Technology',
        'team.colLevel': 'Level',
        'team.colCost': 'Cost',
        'team.trainingTitle': 'Training and cooldown',

        'extras.title': 'Pirate mode and secrets',
        'extras.pirate': 'Pirate mode',
        'extras.eggs': 'Verified easter eggs',
        'extras.corrections': 'Corrections to earlier versions of this guide',

        'sources.title': 'Sources',
        'sources.primary': 'Primary source',
        'sources.community': 'Community',
        'sources.note': 'Every figure in this guide links to the source backing it. Where a source publishes no value, the guide shows “no data” rather than an estimate.',
        'sources.ref': 'Source: {label}',

        'empty': 'No results for this combination.',
        'error.data': 'The guide data could not be loaded. Check that the js/ folder sits next to index.html.'
      },
      genre: { action: 'Action', adventure: 'Adventure', rpg: 'RPG', simulation: 'Simulation', strategy: 'Strategy', casual: 'Casual' },
      audience: { young: 'Young', everyone: 'Everyone', mature: 'Mature' },
      field: {
        engine: 'Engine', gameplay: 'Gameplay', story: 'Story / Quests',
        dialogues: 'Dialogues', levelDesign: 'Level design', ai: 'Artificial intelligence',
        worldDesign: 'World design', graphics: 'Graphics', sound: 'Sound'
      },
      topic: {
        aliens: 'Aliens', cyberpunk: 'Cyberpunk', sports: 'Sports', detective: 'Detective',
        fantasy: 'Fantasy', military: 'Military', mystery: 'Mystery', business: 'Business',
        pirate: 'Pirate', scifi: 'Sci-Fi', horror: 'Horror', vampire: 'Vampire',
        airplane: 'Airplane', altHistory: 'Alternate history', dungeon: 'Dungeon',
        hunting: 'Hunting', medieval: 'Medieval', music: 'Music', martialArts: 'Martial arts',
        history: 'History', postApocalyptic: 'Post-apocalyptic', prison: 'Prison',
        space: 'Space', spy: 'Spy', superheroes: 'Superheroes', timeTravel: 'Time travel',
        rhythm: 'Rhythm', werewolf: 'Werewolf', zombies: 'Zombies', school: 'School',
        law: 'Law', life: 'Life', romance: 'Romance', fashion: 'Fashion', wildWest: 'Wild West',
        city: 'City', evolution: 'Evolution', government: 'Government', hacking: 'Hacking',
        transport: 'Transport', ufo: 'UFO', vocabulary: 'Vocabulary'
      },
      platform: {
        pc: 'PC', govodore: 'Govodore G64', tes: 'TES', masterV: 'Master V', gameling: 'Gameling',
        venaGear: 'Vena Gear', venaOasis: 'Vena Oasis', superTes: 'Super TES', playsystem: 'Playsystem',
        tes64: 'TES 64', dreamvast: 'DreamVast', playsystem2: 'Playsystem 2', mbox: 'mBox',
        gameSphere: 'Game Sphere', pps: 'PPS', mbox360: 'mBox 360', nuu: 'Nuu',
        playsystem3: 'Playsystem 3', grPhone: 'GrPhone / mPad', playsystem4: 'Playsystem 4',
        custom: 'Own console'
      },
      modifier: {
        topicGenre: 'Topic × genre compatibility',
        platformGenre: 'Platform × genre affinity',
        tdRatio: 'T/D ratio alignment',
        sliderTime: 'Time band compliance',
        bugsCleared: 'All bugs cleared before release',
        trend: 'Riding a market trend'
      },
      milestone: {
        office2: 'Level 2 Office',
        office2plus: 'Level 2 Office upgrade',
        office3: 'Level 3 Office (final HQ)',
        rndLab: 'R&D Lab',
        hardwareLab: 'Hardware Lab',
        aaa: 'AAA productions',
        ownConsole: 'Own console'
      },
      milestoneBody: {
        office2: 'You leave the garage. Unlocks hiring, medium games and publisher deals.',
        office2plus: 'Expands the first office and enables advanced training.',
        office3: 'Final HQ. Unlocks large games, the specialized labs and your own convention.',
        rndLab: 'Unlocks MMO network research, Codename: Grid and AAA projects. Give it a standing budget when it is not researching anything specific: it generates research points without consuming team time.',
        hardwareLab: 'Unlocks manufacturing and selling your own console.',
        aaa: 'Requires a 3D v6 engine and three assigned specialists. Without both, the technical score collapses.',
        ownConsole: 'Specs adapt to your history: your two most-produced genres and most-targeted audience get the maximum multiplier.'
      },
      research: {
        targetAudience: 'Target audience', casualGames: 'Casual games', marketing: 'Marketing',
        sequels: 'Sequels', multiGenre: 'Multi-genre', expansionPack: 'Expansion packs'
      },
      penalty: {
        repeatCombo: 'Consecutive repeat',
        earlySequel: 'Premature sequel',
        staleEngine: 'Stale engine in sequel',
        scaleMismatch: 'Scale/engine mismatch',
        aaaRequirements: 'Incomplete AAA requirements'
      },
      penaltyBody: {
        repeatCombo: 'Releasing two games in a row with the same topic and genre.',
        earlySequel: 'Publishing a sequel or expansion before 40 weeks have passed.',
        staleEngine: 'Developing a sequel on the same engine as the original.',
        scaleMismatch: 'Making large games with 2D v3 or lower, or 3D v2 or lower graphics.',
        aaaRequirements: 'Producing an AAA title without a 3D v6 engine or without three assigned specialists.'
      },
      recruiting: { algorithms: 'Algorithms', showreel: 'Showreel', gameDemo: 'Game demo' },
      easterEgg: {
        pong: 'Name your first game “Pong” while still in the garage.',
        wingCommander: 'Name a game “Wing Commander” in the second office, before the refurbishment.',
        doom: 'Name a game “Doom” in the second office, before the refurbishment.',
        halfLife: 'Name a game “Half-Life” in the second office, after the refurbishment.',
        themeHospital: 'Name a game “Theme Hospital” in the second office, after the refurbishment.',
        halo: 'Name a game “Halo” once the R&D Lab is open.',
        starCitizen: 'Name a game “Star Citizen” once the R&D Lab is open.',
        okami: 'Name a game “Okami” once the R&D Lab is open.',
        greenheartName: 'Name your company “Greenheart Games”.',
        gdtGame: 'Create a game called “Game Dev Tycoon” in the Game Dev Sim genre.',
        redBarrels: 'Dave Johnson will ask for red explosive barrels: include them in an action game and he offers you cake.',
        elevenOutOfTen: 'After a perfect 10 score, you may randomly receive an 11.'
      },
      stage: { 1: 'Garage', 2: 'Office 2', 3: 'Office 3', 4: 'Final HQ' }
    }
  };

  let current = 'es';

  function t(path, vars) {
    const parts = String(path).split('.');
    // La primera parte es el grupo; el resto puede contener puntos (claves 'ui').
    const group = parts[0];
    const key = parts.slice(1).join('.');
    let val = (DICT[current][group] || {})[key];
    if (val === undefined) val = (DICT.es[group] || {})[key];
    if (val === undefined) return path;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) val = val.split('{' + k + '}').join(v);
    }
    return val;
  }

  function setLang(lang) {
    current = DICT[lang] ? lang : 'es';
    document.documentElement.lang = current;
    document.documentElement.dataset.lang = current;
    return current;
  }

  const getLang = () => current;

  const nf = (v, opts) => new Intl.NumberFormat(current === 'es' ? 'es-ES' : 'en-US', opts).format(v);

  function money(v) {
    if (v === null || v === undefined) return t('ui.platforms.noData');
    if (v === 0) return t('ui.platforms.free');
    return nf(v, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
  }

  const pct = v => nf(v, { style: 'percent', maximumFractionDigits: 0 });
  const num = (v, d) => nf(v, { minimumFractionDigits: d ?? 2, maximumFractionDigits: d ?? 2 });

  /** Aplica las traducciones a los nodos marcados con data-i18n dentro de `root`. */
  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    (root || document).querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
      });
    });
  }

  global.GDT.i18n = { t, setLang, getLang, money, pct, num, apply, available: Object.keys(DICT), DICT };
})(window);
