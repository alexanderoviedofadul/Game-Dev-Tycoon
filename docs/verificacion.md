# Verificación

## Ejecutar todo

```bash
# 1. Datos, motor de cálculo e i18n — Node puro, sin dependencias
node tests/audit.js

# 2. Marcado
npx html-validate index.html

# 3. Accesibilidad: ocho secciones × dos temas
python3 -m http.server 8000 &
for theme in light dark; do
  for s in algorithm progress matrix sliders platforms names team extras sources; do
    npx pa11y@8 --config .github/pa11y.json \
      "http://localhost:8000/index.html#/$s?tema=$theme"
  done
done
```

`.github/workflows/ci.yml` ejecuta las tres en cada push y pull request.

> **Auditar solo la portada no sirve.** Los paneles se renderizan al seleccionarlos, así que una auditoría de `index.html` a secas deja ocho secciones sin cubrir.
>
> **Auditar un solo tema tampoco.** Cada tema tiene su propio juego de tokens. Un fallo de contraste que solo afectaba al modo claro pasó desapercibido porque el navegador local estaba en modo oscuro; lo detectó CI, donde el runner arranca en claro.

### Por qué el tema se fija con `?tema=`, no con la preferencia del navegador

El primer intento usó `--blink-settings=preferredColorScheme`. Es poco fiable — comprobado midiendo el fondo renderizado:

| Bandera | Tema real |
|---|---|
| sin bandera | oscuro (en local) · **claro** (en el runner) |
| `=0` | oscuro |
| `=1` | claro |
| `=2` | **claro**, no oscuro |

Con esa bandera, la auditoría llegó a ejecutar **el tema claro dos veces sin cubrir nunca el oscuro**, y parecía verde.

El parámetro `?tema=light|dark` lo resuelve: usa el mecanismo de la propia aplicación (`data-theme`), es determinista en cualquier entorno y además hace que el tema viaje en los enlaces compartidos.

Para comprobar que una bandera de navegador hace lo que crees, mide el resultado:

```js
matchMedia('(prefers-color-scheme: dark)').matches
getComputedStyle(document.body).backgroundColor
```

### La trampa de los dos fondos

El bug concreto: `--clr-subtle` medía 4.55:1 contra `--clr-surface`, pero los chips de referencia se apoyan en `--clr-bg`, que es más oscuro — ahí daba **4.08:1**. Al añadir o cambiar un token de texto hay que medirlo contra **ambos** fondos, no solo contra la superficie de tarjeta.

## Qué comprueba `tests/audit.js`

Ejecuta `js/data.js`, `js/engine.js` y `js/i18n.js` dentro de un `vm` de Node con un `window` simulado. No necesita navegador porque esos tres módulos no tocan el DOM.

### Datos

- 6 géneros, 9 campos, 12 temas con matriz completa.
- `tech + design === 1` en los nueve campos.
- Cada tema cubre los 6 géneros y todos los multiplicadores caen en `{0.6 … 1.0}`.
- Cada especialización suma exactamente 900 puntos.
- Cada género declara regla `+`/`~`/`-` para los nueve campos.
- **Toda referencia `src` resuelve** a una fuente de `GDT.sources`.
- Ningún coste es un string.

### Satisfacibilidad

- Las **18 fases** (6 géneros × 3) admiten al menos un reparto válido. Es el test que respalda la decisión de usar comparadores inclusivos en las bandas de tiempo: con lectura estricta, ocho fallarían. Ver [motor de cálculo](motor-de-calculo.md#las-bandas-de-tiempo-y-por-qué-son-inclusivas).

### Invariantes del motor

- `T + D === 1` sobre 20 000 repartos aleatorios.
- Cada preset calculado respeta las bandas de su género.

### Coherencia de las fuentes

- Las contradicciones internas de la guía son **exactamente** `['action', 'simulation']`. Si una corrección futura de los datos las resuelve, o si aparece una nueva, el test falla y obliga a revisar. No es un fallo que ocultar: es un hecho que vigilar.

### i18n

- **Paridad de claves**: la diferencia simétrica entre `es` y `en` es vacía (252 claves).
- **Cobertura**: todo `id` de datos tiene etiqueta en ambos idiomas — géneros, campos, temas, plataformas, hitos, penalizaciones, contratación, investigación, easter eggs y los 30 temas de la comunidad.
- **Resolución de claves de `js/ui.js`**: se extraen del código fuente las 61 claves literales y los 16 prefijos construidos por concatenación, y se comprueba que todos resuelven.

> Este último test nació de un bug real: `t('verdict.off')` mostraba literalmente `verdict.off` en pantalla porque esas claves viven bajo el grupo `ui`, no en la raíz. Ahora esa clase de error falla en CI.

## Comprobaciones manuales

Hay cosas que ninguna herramienta cubre.

### Portabilidad — obligatoria en cada cambio

**Abrir `index.html` con doble clic desde el Finder.** No `localhost`. Es el requisito que fuerza toda la arquitectura, y se rompe en silencio si alguien introduce un `fetch` o un `import`.

Debe verse: sin banner de error, 9 sliders, las 11 anclas de fuente presentes.

### Teclado

Recorrer la aplicación entera **solo con teclado**:

- `Tab` desde el inicio debe ofrecer primero el enlace de salto.
- En la navegación, `←` `→` `Inicio` `Fin` mueven entre pestañas y activan.
- Los nueve sliders son manipulables con las flechas.
- Ningún punto atrapa el foco.

### Estado

- Recargar mantiene pestaña, idioma, tema, filtros y progreso.
- El botón Atrás recorre el historial de secciones.
- Un enlace como `#/sliders?lang=en&genero=rpg` abre esa sección, en inglés y con ese género.

### Visual

El validador de paletas comprueba color, no maquetación. Hay que **mirar el resultado**: colisiones de etiquetas, geometría y desbordamiento.

Comprobado a 400 px de viewport: `document.scrollWidth === clientWidth` en las ocho secciones — el `body` nunca hace scroll horizontal; lo hacen la navegación y las tablas dentro de su propia caja.

## Herramientas de apoyo

Validación de la paleta del heatmap, del skill `dataviz`:

```bash
node <ruta-skill>/scripts/validate_palette.js \
  "#184f95,#256abf,#3987e5,#6da7ec,#9ec5f4" \
  --ordinal --mode dark --surface "#0f172a"

node <ruta-skill>/scripts/validate_palette.js \
  "#86b6ef,#5598e7,#256abf,#184f95,#0d366b" \
  --ordinal --mode light --surface "#f8fafc"
```

Ambas deben pasar. **Si una falla, no se ajusta el hex a mano**: se cambia de rampa y se vuelve a validar.
