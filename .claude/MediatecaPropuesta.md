# Propuesta: Imágenes de posts y mediateca

> Estado: **propuesta** (sin implementar, salvo lo marcado como hecho). Fecha: 2026-11-17.

## Ya implementado

- Las imágenes del markdown usan la sintaxis `![alt](media:clave)`.
- `MarkdownService::resolveMedia()` (lo llama `build()`) sustituye `media:clave` por la URL de la colección `gallery` del post. Compara `Str::slug($media->name)` con la clave; si falta: `**[imagen no encontrada: clave]**`.
  - Se resuelve en servidor porque `react-markdown` vacía las URLs con protocolos desconocidos (`media:`).
- Comando `posts:sync-media`: lee las claves `media:` de los `.md` de cada post y asocia el archivo de `public/IMG/Cards` o `public/IMG/Banners` a su `gallery`. Idempotente.
  - Tras un `migrate:fresh --seed` hay que volver a ejecutarlo (o llamarlo desde `DatabaseSeeder`).
- Pendiente de limpieza: `storage/app/public/21..50` tiene archivos huérfanos de una BD anterior mezclados con los nuevos.

## Decisión: modelo mixto (subida in-situ + mediateca como buscador)

| Opción | Problema |
|---|---|
| Solo in-situ | No hay reutilización: cada uno resube lo que ya existe |
| Solo mediateca central (los posts enlazan) | Hay que gestionar quién sube/modera/borra; si se borra el original (soft deletes) se rompen todos los posts que lo usan |
| **Mixto** ✅ | — |

1. **Subida in-situ**: el usuario sube lo que quiera a la `gallery` de su post, con el nombre que quiera.
2. **Mediateca = consulta** sobre la tabla `media` existente (no hay tabla nueva).
3. **Reutilizar = copiar**: `$media->copy($post, 'gallery')`. Cada post es dueño de sus imágenes; nada se rompe si el original desaparece. `resolveMedia()` sigue funcionando sin cambios. Duplicar archivos es aceptable.

Encaja con el principio de ficha neutra vs aportación (ver `CLAUDE.md`): imágenes de ficha (work/author) = comunidad; imágenes de post = de su autor.

## Sin búsqueda semántica: se organiza por obra

Cada post pertenece a un único work (`articles_works`), así que la obra hace de filtro. Al escribir un post sobre un work, la mediateca ofrece sin que el usuario escriba nada:

```
media de posts PUBLICADOS de ese work
∪ cover del work
∪ profile de sus authors
```

- Para otra obra: **navegar por fichas** (buscador de works/authors que ya existe: `WorkFilter` / `AuthorFilter`), no buscar imágenes.
- Solo mostrar imágenes de posts publicados y de fichas; nunca de borradores ni de posts borrados.

## Contexto sin pedir nada al usuario

No se obliga a poner nombres semánticos. La clave `media:` la genera el sistema (`img-1`, hash…).

| Fuente de significado | Esfuerzo del usuario |
|---|---|
| Obra del post (agrupación) | Ninguno |
| Encabezado de la sección del markdown donde aparece | Ninguno |
| Nº de reutilizaciones (orden en la mediateca) | Ninguno |
| `alt` de la imagen | Opcional |

Al guardar el post, extraer en servidor (como `extract()` hace con el índice) el `alt` y el título de la sección de cada imagen, y guardarlos en `custom_properties`. Permite un `LIKE` modesto.

Opcional en el futuro: descripciones automáticas con un modelo de visión, como capa encima del mismo diseño.

## Qué va en cada sitio

**`custom_properties`** (datos sin columna propia):

| Clave | Qué es |
|---|---|
| `alt` | Texto alternativo extraído del markdown |
| `section` | Título de la sección donde aparece |
| `source_media_id` | Media original del que se copió (atribución, contar reutilizaciones, retirar en cascada) |

**No** duplicar en `custom_properties` lo que Spatie ya tiene en columnas: orden (`order_column`), nombre, colección.

## Reordenar imágenes

- Usar `order_column` de Spatie: `Media::setNewOrder([12, 9, 15, 10])`. `getMedia('gallery')` ya devuelve en ese orden.
- Interfaz: miniaturas arrastrables (p. ej. `@dnd-kit/sortable`) → `PATCH` con el array de ids → controlador valida que **todos** los ids pertenecen a la `gallery` de ese post → `setNewOrder`.
- Ese orden afecta a las vistas de galería (mediateca, carrusel, selector del editor). **No** al orden dentro del artículo: ahí manda la posición de `![alt](media:clave)` en el markdown.

## Pendientes a decidir

- Derechos de imagen al compartir: aviso en las normas + reportable (ya existe `reports_media`).
- Colección `library` opcional para imágenes "oficiales" que solo suben moderadores (banners, portadas verificadas): misma mediateca con un filtro más.

## Orden de implementación sugerido

1. Subida de imágenes en el formulario del post (`gallery`) con clave generada.
2. Extracción de `alt` + `section` a `custom_properties` al guardar.
3. Mediateca por obra (consulta + selector en el editor) y copia con `source_media_id`.
4. Reordenar con `order_column`.
5. Orden por número de reutilizaciones.
