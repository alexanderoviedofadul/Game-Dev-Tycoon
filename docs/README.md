# Documentación

Documentación técnica del proyecto. Para la visión general y cómo usar la guía, ver el [README raíz](../README.md).

## Contenido

| Documento | De qué trata |
|---|---|
| [Guía Magistral](Guia-Completa-Game-Dev-Tycoon.md) | **La fuente.** Documento algorítmico original con las 9 tablas numéricas y las 11 obras citadas. Todo lo que muestra la aplicación deriva de aquí o de las fuentes verificadas en [hallazgos](hallazgos.md) |
| [Arquitectura](arquitectura.md) | Por qué scripts clásicos y no módulos ES, orden de carga, responsabilidad de cada fichero, flujo de estado y enrutado |
| [Modelo de datos](modelo-de-datos.md) | Esquema de cada tabla de `js/data.js`, invariantes y por qué el i18n no puede alterar un número |
| [Motor de cálculo](motor-de-calculo.md) | Cómo se convierte un reparto de sliders en un ratio T/D y un veredicto, con la derivación matemática |
| [Hallazgos y correcciones](hallazgos.md) | Las contradicciones encontradas en las fuentes, las afirmaciones falsas corregidas y la verificación de cada una |
| [Diseño y accesibilidad](diseno-y-accesibilidad.md) | Sistema de tokens, validación de la paleta del heatmap, contrastes medidos y patrón ARIA |
| [Verificación](verificacion.md) | Qué comprueba cada test, cómo ejecutarlos y qué revisar a mano |

## Principio rector

> Ninguna cifra entra sin fuente. Donde una fuente no publica un valor, se muestra **«sin dato»** en lugar de una estimación.

Este principio es la razón de ser del rediseño: la versión anterior de la guía contenía cifras inventadas que contradecían tanto al juego como a su propia documentación. Ver [hallazgos](hallazgos.md).
