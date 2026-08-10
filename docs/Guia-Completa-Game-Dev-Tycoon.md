# **Guía Magistral de Estrategia y Mecánicas Algorítmicas en Game Dev Tycoon**

El éxito sostenido en *Game Dev Tycoon* está determinado por la comprensión analítica de sus modelos matemáticos y algoritmos subyacentes1. El sistema funciona como un simulador de optimización cuantitativa en el que cada decisión ejecutiva —desde la asignación de tiempo en las barras deslizadoras hasta la selección de perfiles durante el reclutamiento— aplica modificadores directos sobre una variable oculta de rendimiento1. Este informe ofrece un desglose de las mecánicas internas del juego, sus fórmulas de puntuación y la ruta crítica de progresión empresarial para dominar la industria desde el garaje inicial hasta la consolidación como potencia multinacional.

## **Arquitectura Algorítmica y Sistema de Evaluaciones**

El núcleo de *Game Dev Tycoon* se rige por un principio de evaluación relativa: la calificación recibida por la prensa especializada no refleja la calidad absoluta de un videojuego, sino su rendimiento en relación con el registro histórico más alto del propio estudio1.

### **El Algoritmo de Puntuación Interna**

Durante la producción de un título, la acumulación de puntos de Diseño (D) y Tecnología (T) por parte del personal genera una variable invisible denominada *Game Score*1. Esta cifra se calcula dividiendo la suma bruta de puntos generados entre un coeficiente asociado al tamaño del proyecto, ajustándola posteriormente mediante modificadores de calidad acumulativos1:  
![][image1]  
Los modificadores de calidad oscilan entre ![][image2] (penalización por desincronización de parámetros) y ![][image3] (valor óptimo)1. Estos factores incluyen la compatibilidad entre tema y género1, la afinidad entre plataforma y género1, la alineación del ratio Tecnología/Diseño1, el cumplimiento de los rangos de tiempo en los deslizadores1, la erradicación total de errores de software antes del lanzamiento1 y la explotación de tendencias de mercado1. Si un título incumple alguna de estas comprobaciones, el *Game Score* se reduce drásticamente, fijando un techo bajo para la nota que otorgarán los analistas1.

### **La Trampa de Inflación de Puntuación**

Al culminar un desarrollo, el motor del juego compara el *Game Score* obtenido contra el promedio de los mejores registros pasados de la empresa1. Para obtener calificaciones medias de 9.5 o 10, el nuevo título debe superar ligeramente esa marca previa1.  
Aumentar de forma repentina la producción de puntos —mediante la contratación inmediata de personal de alto nivel o la inclusión precipitada de motores gráficos avanzados— eleva el estándar exigido por el juego a un ritmo insostenible2. Esto provoca que las producciones subsiguientes no alcancen la cota fijada, derivando en valoraciones mediocres y en la bancarrota por costes operativos elevados2. La estrategia idónea exige una progresión aritmética constante en la generación de puntos, absorbiendo los saltos de personal mediante juegos de bajo presupuesto o contratos de edición2.

### **Prohibiciones y Penalizaciones Críticas**

Existen directrices algorítmicas estrictas que aplican reducciones automáticas e inmediatas sobre el *Game Score* si son vulneradas por el jugador1.

| Infracción Algorítmica | Mecanismo de Penalización | Impacto en el Juego |
| :---- | :---- | :---- |
| **Repetición Consecutiva** | Lanzar dos juegos seguidos con idéntico Tema y Género1. | Reducción severa del modificador de calidad1. |
| **Secuelas Prematuras** | Publicar una secuela o expansión antes de transcurrir 40 semanas (1 año)1. | Penalización directa en la nota de los analistas1. |
| **Obsolescencia de Motor** | Desarrollar una secuela utilizando el mismo motor que el título original1. | Degradación del componente técnico del *Game Score*1. |
| **Incompatibilidad de Escala** | Crear juegos Grandes con gráficos 2D V3/inferiores o 3D V2/inferiores1. | Fallo automático en las pruebas de calidad técnica1. |
| **Requisitos AAA Incompletos** | Producir títulos AAA sin motor 3D V6 o sin 3 especialistas asignados1. | Colapso de la puntuación técnica y pérdida de inversión1. |

## **Preproducción, Compatibilidades y Sinergias de Mercado**

Las selecciones en la etapa de preproducción establecen el multiplicador máximo alcanzable antes de ejecutar las fases de desarrollo1.

### **Matriz de Combinaciones Tema y Género**

La relación entre el tema y el género del juego determina un multiplicador de compatibilidad fundamental1. Los valores internos se diferencian en combinaciones óptimas (multiplicador de 1.0) y combinaciones incompatibles (multiplicador de 0.6)1.

| Tema | Acción | Aventura | RPG | Simulación | Estrategia | Casual |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Aliens** | 1.0 | 0.8 | 1.0 | 0.6 | 0.9 | 0.7 |
| **Ciberpunk** | 1.0 | 0.8 | 1.0 | 0.8 | 0.7 | 0.6 |
| **Deportes** | 1.0 | 0.6 | 0.6 | 1.0 | 0.7 | 1.0 |
| **Detective** | 0.6 | 1.0 | 1.0 | 0.8 | 0.6 | 0.9 |
| **Fantasía** | 1.0 | 1.0 | 1.0 | 0.8 | 1.0 | 0.6 |
| **Militar** | 1.0 | 0.6 | 0.8 | 1.0 | 1.0 | 0.6 |
| **Misterio** | 0.6 | 1.0 | 1.0 | 0.8 | 0.6 | 0.8 |
| **Negocios** | 0.6 | 0.8 | 0.8 | 1.0 | 1.0 | 0.6 |
| **Piratas** | 0.8 | 1.0 | 0.8 | 0.8 | 0.7 | 0.8 |
| **Sci-Fi** | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.8 |
| **Terror** | 1.0 | 0.8 | 0.8 | 0.6 | 0.7 | 0.8 |
| **Vampiros** | 1.0 | 0.8 | 1.0 | 0.6 | 0.6 | 0.7 |

Temas como Sci-Fi y Fantasía destacan por brindar la mayor flexibilidad operativa del sistema, al presentar compatibilidad máxima con casi todos los géneros principales1.

### **Sinergias de Plataforma y Públicos Objetivo**

Las plataformas de hardware presentan niveles de afinidad específicos con cada género y público objetivo (Jóvenes, Todos, Maduros)1. Mientras que la afinidad entre Plataforma y Género incide en la calificación de los análisis, la afinidad entre Plataforma y Público Objetivo rige el volumen de ventas comerciales1.

| Plataforma | Análogo en la Industria | Géneros Primarios | Multiplicador de Público Objetivo |
| :---- | :---- | :---- | :---- |
| **PC** | Personal Computer | Simulación, Estrategia, RPG, Acción | Todos (1.15) / Maduros (1.30)1 |
| **Govodore 64** | Commodore 64 | Acción, Aventura, RPG, Simulación | Jóvenes (1.0) / Todos (1.0) / Maduros (1.0)1 |
| **TES / Super TES** | NES / SNES | Acción, RPG, Aventura | Jóvenes (1.0) / Todos (0.8) / Maduros (0.6)1 |
| **Gameling / GS** | Game Boy / Nintendo DS | Casual, Puzzle, Simulación | Jóvenes (1.0) / Todos (0.7) / Maduros (0.6)1 |
| **PlaySystem (1-4)** | PlayStation (1-4) | RPG, Acción, Aventura | Todos (0.85 \- 1.3) / Maduros (0.75 \- 1.2)1 |
| **mBox (360/Next)** | Xbox (360/One) | Acción, Shooter, Estrategia | Todos (1.3) / Maduros (1.2)1 |

## **Fase de Desarrollo y Optimización de Deslizadores**

Durante el desarrollo activo, el trabajo se estructura en tres etapas secuenciales compuestas por tres áreas técnicas cada una1. La consecución de una puntuación elevada exige ajustar la distribución de tiempo en los deslizadores y cumplir con las proporciones entre puntos de Tecnología y Diseño que demanda cada género1.

### **Ratios Óptimos de Tecnología y Diseño**

Cada género exige una relación matemática precisa entre los puntos finales acumulados de Tecnología y Diseño1. Desviarse del rango aceptable conlleva reducciones en la nota final1.

| Género | Ratio T/D Óptimo | Coeficiente Técnico (% T) | Coeficiente Diseño (% D) | Rango Aceptable de Ratio T/D |
| :---- | :---- | :---- | :---- | :---- |
| **Acción** | 1.80 | 64.0% | 36.0% | 1.44 – 2.401 |
| **Simulación** | 1.60 | 61.5% | 38.5% | 1.28 – 2.131 |
| **Estrategia** | 1.40 | 58.3% | 41.7% | 1.12 – 1.861 |
| **RPG** | 0.60 | 37.5% | 62.5% | 0.35 – 0.851 |
| **Casual** | 0.50 | 33.3% | 66.7% | 0.25 – 0.751 |
| **Aventura** | 0.40 | 29.0% | 71.0% | 0.15 – 0.651 |

### **Configuración de Deslizadores por Género**

Para maximizar la calidad en producciones de género único, la distribución de esfuerzo debe alinearse con tres reglas de balance de tiempo1:

> 1. Asignar **más del 40% del tiempo** (marcado como \+) a las áreas prioritarias del género1.  
> 2. Mantener **nunca menos del 20% del tiempo** (marcado como \-) en campos relevantes1.  
> 3. No asignar **más del 40% del tiempo** a campos secundarios o irrelevantes1.

| Género | Fase 1: Motor | Fase 1: Jugabilidad | Fase 1: Historia/Misiones | Fase 2: Diálogos | Fase 2: Diseño Nivel | Fase 2: IA | Fase 3: Diseño Mundo | Fase 3: Gráficos | Fase 3: Sonido |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Acción** | \+ | \+ | \- | \- | \+ | \+ | \~ | \+ | \+ |
| **Aventura** | \- | \~ | \+ | \+ | \~ | \- | \+ | \+ | \~ |
| **RPG** | \- | \+ | \+ | \+ | \+ | \~ | \+ | \+ | \~ |
| **Simulación** | \+ | \+ | \~ | \- | \+ | \+ | \~ | \+ | \+ |
| **Estrategia** | \+ | \+ | \~ | \- | \+ | \+ | \~ | \+ | \+ |
| **Casual** | \- | \+ | \- | \- | \+ | \- | \- | \+ | \+ |

Simbología: \+ \= Asignación alta (\>40%); \~ \= Asignación media (20%-40%); \- \= Asignación baja (\<20%)1.

### **Distribución Inherente de Puntos por Componente**

Al margen del género seleccionado, cada área de trabajo genera una mezcla específica de puntos de Tecnología y Diseño según su propia naturaleza1.

| Componente de Desarrollo | Aporte de Tecnología (T) | Aporte de Diseño (D) |
| :---- | :---- | :---- |
| **Motor (Engine)** | 80% | 20%1 |
| **Jugabilidad (Gameplay)** | 20% | 80%1 |
| **Historia / Misiones** | 20% | 80%1 |
| **Diálogos** | 10% | 90%1 |
| **Diseño de Nivel** | 60% | 40%1 |
| **Inteligencia Artificial** | 80% | 20%1 |
| **Diseño de Mundo** | 40% | 60%1 |
| **Gráficos** | 50% | 50%1 |
| **Sonido** | 40% | 60%1 |

## **Gestión del Talento Humano y Especialización**

La capacidad productiva de la plantilla condiciona el volumen de puntos generado en cada proyecto6. La gestión eficiente exige equilibrar las habilidades del personal con las necesidades del catálogo desarrollado6.

### **Métodos de Reclutamiento y Distribución de Habilidades**

El método de búsqueda seleccionado durante las ofertas de empleo aplica una inclinación estadística sobre las métricas de los candidatos6. Esto facilita la contratación de personal orientado a las áreas requeridas6.

| Método de Contratación | Sesgo de Habilidades (D:T) | Especialidades Destinadas Recomendadas |
| :---- | :---- | :---- |
| **Algoritmos (Algorithms)** | 1:4 (Orientado a Tecnología) | Motor, Inteligencia Artificial6 |
| **Muestra de Trabajos (Showreel)** | 4:1 o 9:1 (Orientado a Diseño) | Jugabilidad, Historia/Misiones, Diálogos6 |
| **Demo de Juego (Game Demo)** | Balanceado (2:3 / 3:2) | Diseño de Nivel, Diseño de Mundo, Gráficos, Sonido6 |

### **Requisitos de Especialización**

Para asumir la autoría exclusiva de un área en producciones de gran escala (Large y AAA), el empleado debe alcanzar el Nivel 7, acumular 900 puntos sumando sus métricas de Diseño y Tecnología en la proporción idónea y financiar el programa de investigación correspondiente7.

| Especialidad | Puntos de Diseño (D) | Puntos de Tecnología (T) | Nivel Mínimo | Coste de Investigación |
| :---- | :---- | :---- | :---- | :---- |
| **Motor** | 180 | 720 | Nivel 7+ | 200 RP \+ $5M7 |
| **Jugabilidad** | 720 | 180 | Nivel 7+ | 200 RP \+ $5M7 |
| **Historia / Misiones** | 720 | 180 | Nivel 7+ | 200 RP \+ $5M7 |
| **Diálogos** | 810 | 90 | Nivel 7+ | 200 RP \+ $5M7 |
| **Diseño de Nivel** | 360 | 540 | Nivel 7+ | 200 RP \+ $5M7 |
| **Inteligencia Artificial** | 180 | 720 | Nivel 7+ | 200 RP \+ $5M7 |
| **Diseño de Mundo** | 540 | 360 | Nivel 7+ | 200 RP \+ $5M7 |
| **Gráficos** | 450 | 450 | Nivel 7+ | 200 RP \+ $5M7 |
| **Sonido** | 540 | 360 | Nivel 7+ | 200 RP \+ $5M7 |

### **Metodología de Formación y Temporizador de Enfriamiento**

El sistema de capacitación integra un temporizador de enfriamiento oculto que degrada la ganancia de estadísticas si se imparten cursos de manera consecutiva8. La maximización del rendimiento exige intercalar exactamente un programa de formación por empleado entre cada desarrollo9. La producción del juego intermedio permite disipar la penalización de rendimiento9.  
Al integrar nuevas contrataciones, la primera medida formativa debe ser la capacitación en investigación (*Make Me Think\!*), la cual acelera la recuperación de la eficiencia operativa del equipo9. Asimismo, el uso de las cargas de impulso (*Boost*) debe reservarse para los periodos de entrenamiento en lugar de activarse durante el desarrollo del juego, obligando al empleado a asimilar un incremento de métricas superior sin distorsionar la generación de puntos en la producción9.

## **Ruta Crítica de Progresión Empresarial**

El avance a través de las etapas del juego está delimitado por hitos financieros, requisitos de personal y marcas temporales que habilitan nuevas infraestructuras4.

Evolución de Sedes Corporativas:  
Garaje Inicial ($1M) \-\> Oficina Nivel 2 ($5M \+ Y11M6W2) \-\> Oficina Nivel 3 ($16M \+ Y13M9W2) \-\> Laboratorios I+D / Hardware

### **Primera Fase: El Garaje**

Durante el periodo inicial en el garaje, la prioridad estratégica reside en la acumulación de capital libre de costes fijos o salarios4. Es aconsejable desarrollar entre 3 y 4 juegos de tamaño pequeño aprovechando combinaciones óptimas en PC o Govodore 642. Una vez reunidos 50 Puntos de Investigación (RP), se debe crear un motor propio que incorpore únicamente la función de Gráficos 2D V22. Elaborar un informe de juego (*Game Report*) tras cada lanzamiento resulta indispensable para financiar las investigaciones iniciales2. El paso a la siguiente etapa se activa al alcanzar $1,000,000 en fondos netos4.

### **Segunda Fase: Primera Oficina y Formación de Plantilla**

El traslado a la primera oficina introduce salarios recurrentes y exige controlar el crecimiento del equipo para no acelerar la inflación de puntuación2. Resulta adecuado contratar hasta 4 empleados con costes salariales contenidos e impartir de inmediato la instrucción *Staff Welcome Training* ($10k) para elevar su eficiencia del 0.05 al 0.282.  
Durante esta etapa es recomendable recurrir a contratos de edición con terceros (*Publisher Deals*) para producir juegos medianos hasta superar los 100,000 seguidores2. Esto permite cubrir los costes fijos y superar el límite de nota 9 que el sistema impone a los juegos medianos autoeditados cuando no se posee dicha base de fans2. La progresión desbloquea hitos como el Público Objetivo en el Año 3 Mes 1, Juegos Casuales en el Año 3 Mes 11, Marketing en el Año 4 Mes 5 y Secuelas en el Año 8 Mes 64. La siguiente expansión requiere alcanzar el Año 11 Mes 6 Semana 2, poseer 2 empleados y acumular $5,000,0004.

### **Tercera Fase: Segunda Oficina y Laboratorio de I+D**

La disponibilidad de juegos grandes (*Large Games*) y la estructuración del personal permiten habilitar divisiones de investigación avanzadas3. La apertura del Laboratorio de I+D (*R\&D Lab*) exige contar con un empleado calificado como Especialista en Diseño (requiere 700+ en D, Nivel 7 y un coste de 100 RP \+ $5M)4.  
Cuando el Laboratorio de I+D no esté ejecutando investigaciones concretas como *Internet Opportunities* o *Codename: Grid*, se le debe asignar un presupuesto operativo continuo4. Esta medida genera un flujo pasivo y constante de Puntos de Investigación sin consumir tiempo de desarrollo del equipo10. La transición a la sede final requiere llegar al Año 13 Mes 9 Semana 2, mantener 4 empleados y acumular $16,000,0004.

### **Cuarta Fase: Sede Corporativa, Juegos AAA y Laboratorio de Hardware**

La etapa final otorga acceso a la producción masiva de títulos AAA y al desarrollo de hardware propietario1. La creación del Laboratorio de Hardware exige la formación de un Especialista en Tecnología (700+ en T, Nivel 7 y 100 RP \+ $5M)4. No se recomienda iniciar la fabricación de una consola propia sin contar con un fondo de reserva superior a $200,000,0004. Las especificaciones técnicas de la consola se adaptan de forma dinámica al historial del estudio: los dos géneros más producidos y el público objetivo más frecuentado obtienen de manera automática el modificador de compatibilidad más alto (1.0) en la nueva plataforma1.

| Hito / Infraestructura | Requisito Financiero y Temporal | Requisito de Personal / Especialista | Unlocks e Impacto |
| :---- | :---- | :---- | :---- |
| **Oficina Nivel 2** | $1,000,0004 | N/A (Solo el jugador) | Reclutamiento de personal, Juegos Medianos, Contratos de edición2. |
| **Mejora Oficina Nivel 2** | Año 11, Mes 6, Semana 2 / $5,000,0004 | 2 Empleados contratados4 | Capacidad de ampliación y formación avanzada4. |
| **Oficina Nivel 3 (Sede Final)** | Año 13, Mes 9, Semana 2 / $16,000,0004 | 4 Empleados contratados4 | Juegos Grandes, Laboratorios Especializados, Convención Propia4. |
| **Laboratorio de I+D** | $5,000,000 \+ 100 RP7 | Especialista en Diseño (D \>= 700\)4 | Investigación de Redes MMO, *Grid*, Proyectos AAA4. |
| **Laboratorio de Hardware** | $5,000,000 \+ 100 RP7 | Especialista en Tecnología (T \>= 700\)4 | Fabricación y comercialización de Consola Propia1. |
| **Desarrollo de Juegos AAA** | Obtener nota 10 en Juego Grande4 | 3+ Especialistas de Deslizador1 | Producciones masivas con máximo volumen de mercado1. |

## **Síntesis de Ejecución Estratégica**

La conducción exitosa de una partida en *Game Dev Tycoon* se fundamenta en la administración rigurosa de las mecánicas invisibles del simulador1. La progresión de la empresa debe mantener un crecimiento gradual, evitando saltos bruscos en la producción de puntos que distorsionen el algoritmo de evaluación histórica2.  
La selección de proyectos requiere la validación constante de la compatibilidad tripartita entre Tema, Género y Plataforma1, acompañada por una distribución de tiempo en los deslizadores que respete los rangos requeridos por cada género1. Asimismo, la gestión del talento debe estructurarse mediante esquemas de contratación dirigidos y programas de formación intercalados con el desarrollo de proyectos activos para neutralizar las penalizaciones por enfriamiento6. La aplicación sistemática de estas directrices asegura la viabilidad financiera, el dominio de los rankings de la crítica y la expansión corporativa definitiva1.

#### **Obras citadas**

> 1. Game Development/1.3.9 | Game Dev Tycoon Wiki \- Fandom, [https://gamedevtycoon.fandom.com/wiki/Game\_Development/1.3.9](https://gamedevtycoon.fandom.com/wiki/Game_Development/1.3.9)  
> 2. Simple(-ish) guide for 1.7.8 : r/GameDevTycoon \- Reddit, [https://www.reddit.com/r/GameDevTycoon/comments/1o1nmk2/simpleish\_guide\_for\_178/](https://www.reddit.com/r/GameDevTycoon/comments/1o1nmk2/simpleish_guide_for_178/)  
> 3. Success Guild updated for 1.7.8 | Game Dev Tycoon Wiki | Fandom, [https://gamedevtycoon.fandom.com/wiki/Success\_Guild\_updated\_for\_1.7.8](https://gamedevtycoon.fandom.com/wiki/Success_Guild_updated_for_1.7.8)  
> 4. ULTIMATE GUIDE FOR GAME DEV TYCOON \- Steam Community, [https://steamcommunity.com/sharedfiles/filedetails/?l=french\&id=216784744](https://steamcommunity.com/sharedfiles/filedetails/?l=french&id=216784744)  
> 5. Game Dev Tycoon Guide – Best Combos & Tips (2025) \- RoyalCDKeys, [https://royalcdkeys.com/blogs/news/game-dev-tycoon-guide-best-combos-tips-2025](https://royalcdkeys.com/blogs/news/game-dev-tycoon-guide-best-combos-tips-2025)  
> 6. Guide :: Specialists & Development \- Steam Community, [https://steamcommunity.com/sharedfiles/filedetails/?id=1842635307](https://steamcommunity.com/sharedfiles/filedetails/?id=1842635307)  
> 7. Game Dev Tycoon \- Training Guide \- PC \- By Viewland \- GameFAQs, [https://gamefaqs.gamespot.com/pc/713603-game-dev-tycoon/faqs/67064](https://gamefaqs.gamespot.com/pc/713603-game-dev-tycoon/faqs/67064)  
> 8. Training \- Game Dev Tycoon Wiki \- Fandom, [https://gamedevtycoon.fandom.com/wiki/Training](https://gamedevtycoon.fandom.com/wiki/Training)  
> 9. How to train your employees \- Game Dev Tycoon, [https://forum.greenheartgames.com/t/how-to-train-your-employees/5442](https://forum.greenheartgames.com/t/how-to-train-your-employees/5442)  
> 10. Training Staff? : r/GameDevTycoon \- Reddit, [https://www.reddit.com/r/GameDevTycoon/comments/1c6k42i/training\_staff/](https://www.reddit.com/r/GameDevTycoon/comments/1c6k42i/training_staff/)  
> 11. Research points and cost takes too long \- Game Dev Tycoon, [https://forum.greenheartgames.com/t/research-points-and-cost-takes-too-long/2450](https://forum.greenheartgames.com/t/research-points-and-cost-takes-too-long/2450)

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAABUklEQVR4Xu2UvSuFYRjGbxaJxUdRRgslySKSxSCL8rkgm9lgYRJ/gGKWssjEZPAPGNhlVmQxKGXxcV/nvs/T/V4eTsmi3l9dvd2/53rO+3bO8x6Rkv9Ek+ZC86G50tQVl2syonkW279La4kusUKjz20+16fGz1xqHsN8o9kIc+JFc0LuWvNKLseO2ENVaff5PLgEFhbIbbqvBToH5HporjAmVh4lv+K+lXxkQqwz6/NUWPvCmlh5kPy8+yHyEXzd6CxptjQtmjvNQ+gktsXK/eSn3S+Sj9yKdZ7Iw+2Tk1VfGCA/536cfASvATr4jAgcUqD6Gw2TX3aPo/8dh2KdbvLZGzW4/M2pmxTr9JLP3ghA7pHDe8BlHJAOcujgMLB7J1ch9/SYZ8KMv6Tckx5p3sLcLNbpDK7AsdgGXFHEsWfONOsslVOxPfd+7Ssul5SU/AWf/pFVSUdVwK4AAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAAA/0lEQVR4Xu2UMWoCYRCFn0UuIIKp7TyGN7DxDiaiqNh5gRReQyzSBISU3kFQsBELRRQtbLUwzjCr7IzzaxbSBPaDx7Lf/5hZ2GWBlP9Ih/Jm5RNKlBnlh9I3Z4oB5QQpct718UPalHPsvgqZ8ZSki7hfdNyHcXckWVSG//RH+F6RZNEI/sAFfK9IsugAf+AUvldwoWZlAO56A8fwvYILdSsDrOEPnMD3Ci40rAwQekdz+F7BhaaVAbrwB/76q2tZGVGh5I3jftZxQ+MUOUipZw+IDPyXv4F8zldeIZ2XmLvxSdlRVpRldN1CfktxviD/Qsse0v+GLCno45SUlL/gAnq9R8qMXCmBAAAAAElFTkSuQmCC>