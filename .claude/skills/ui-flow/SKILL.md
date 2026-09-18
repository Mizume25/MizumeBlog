---
name: ui-flow
description: "Ejecuta el pipeline completo de UI: diseño -> build -> clean code -> review. Solo se invoca manualmente con /ui-flow, nunca de forma automática. Requiere una ruta a un .md de especificación o una descripción de tarea como argumento."
argument-hint: "<ruta/a/spec.md> | <descripción de la tarea>"
disable-model-invocation: true
---

## Paso 0 — Validación de entrada (obligatorio antes de invocar nada)

Argumento recibido: $ARGUMENTS

1. Si $ARGUMENTS está vacío o son solo espacios: **detente aquí**. No invoques ningún subagente. Responde indicando que `/ui-flow` necesita uno de estos dos formatos:
   - `/ui-flow ruta/al/archivo.md`
   - `/ui-flow descripción libre de la tarea a implementar`

2. Si $ARGUMENTS termina en `.md` o tiene forma de ruta de archivo:
   - Intenta leerlo con la herramienta Read.
   - Si no existe o falla la lectura: **detente aquí** y repórtalo. No inventes una especificación ni continúes con una tarea vacía.
   - Si existe: su contenido completo es la especificación de la tarea. Úsalo tal cual, no lo resumas antes de pasarlo a `ui-designer`.

3. Si $ARGUMENTS no tiene forma de ruta de archivo: trátalo como texto libre y úsalo directamente como la especificación de la tarea.

Solo si el paso 1 o 2 produjeron una especificación real, continúa. En cualquier otro caso, tu participación termina en este paso.

## Secuencia obligatoria

1. Invoca a `ui-designer` con la especificación resultante del Paso 0.
   - Espera su resultado: path del archivo temporal y nombre de la rama git.
2. Invoca a `ui-builder`, pasándole ese path.
3. Invoca a `ui-clean-code`, pasándole el path generado por `ui-builder`.
4. Invoca a `ui-review`, pasándole los tres paths acumulados y el nombre de la rama.

## Manejo del resultado final

- `PASS`: informa que la rama fue mergeada y en qué archivo quedaron los hallazgos.
- `FAIL`: informa el path del archivo con hallazgos y en qué etapa se originó el problema. Detente ahí.

No avances de etapa si la anterior no devolvió un path válido; repórtalo como fallo del pipeline.