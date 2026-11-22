## Proyecto Mizume blog

Todos los detalles de este proyecto se encuentran en docs/MizumeBlog.md.

Antes de modificar cualquier, archivo pregunta.


## flujo_autores_y_obras

Diseño acordado (2026-11-16) para works y authors. **Estado: pendiente de implementar.**

### Principio: ficha neutra vs aportación propia

| | Ficha (Work / Author) | Aportación (Post) |
|---|---|---|
| Qué es | Datos neutros: título, sinopsis, categoría, medio, autores, tags | Opinión/análisis del usuario, sin límite de extensión |
| Dueño | **Nadie** (comunidad) | El usuario que lo escribe |
| Edición | Cualquiera *propone*; el cambio se revisa | Solo su autor |

- Un usuario puede escribir posts sobre varios works (1 work por post y 1 post por usuario+work, ya forzado en `articles_works`), pero **eso nunca le da poder sobre la ficha**.
- Opiniones o valoraciones van en el post, nunca en la ficha.

### Flujo de un work

1. **Crear si no existe**: desde el formulario del post. Antes de crear, buscar **duplicados** (slug, `abbreviation`, título similar) y preguntar "¿te refieres a…?".
2. **Estado** `pending` → `verified`. Una ficha `pending` ya se puede usar para escribir posts (no bloquear al usuario); en público se marca como "ficha sin verificar". `created_by` es solo atribución, **no da permisos**.
3. **Editar = proponer**: ningún usuario modifica la ficha directamente; genera una propuesta de cambio que va a la cola de revisión.
4. **Historial**: cada cambio aprobado queda registrado (quién, qué, cuándo, por qué) y es reversible.

### Cola de revisión (moderación)

Nueva pestaña de moderación en el taller (junto a `reports` / `requests`). Cada propuesta muestra: diff campo a campo, usuario + motivo + su historial (aceptadas/rechazadas), y acciones aprobar / rechazar / comentar.

Modelo propuesto (polimórfico, sirve para Work y Author):

```
entity_revisions
├── revisable_type / revisable_id   (Work | Author)
├── user_id                         quién propone
├── changes   JSON                  { "sinopsi": { "old": "...", "new": "..." } }
├── reason                          motivo obligatorio
├── status                          pending | approved | rejected
├── flags     JSON                  alertas automáticas (RevisionGuard)
└── reviewed_by / reviewed_at
```

### Evitar que se "jibarice" la información (`RevisionGuard`)

Servicio que rellena `flags` al crear la propuesta:

| Regla | Ejemplo |
|---|---|
| Reducción de texto | la sinopsis pierde > 30 % de su longitud |
| Campo vaciado | se borra un campo que tenía valor |
| Cambio estructural | título, categoría, medio o quitar un autor → **siempre** revisión humana |
| Desvío de neutralidad | primera persona o valoraciones ("me encantó") en la sinopsis |
| Ráfaga | muchas propuestas del mismo usuario en poco tiempo |

Abuso reiterado → registrar en `violation_logs` (ya existe).

### Authors (más protección)

- Habla de una persona real: toda propuesta pasa por revisión, **nunca** auto-aprobación.
- El autor real verificado reclama su ficha mediante `claims` (ya existe) y puede gestionarla.
- `RequestPermission` se mantiene para permisos sobre posts; no mezclarlo con la ficha de autor.

### Niveles de confianza (fase posterior)

Con N propuestas aceptadas, los **cambios menores** (tags, erratas, sin flags) se auto-aprueban. Los estructurales o con flags siguen yendo a revisión.

### Orden de implementación

1. Detección de duplicados al crear work + estado `pending` / `verified`.
2. Tabla `entity_revisions` + formulario "proponer cambio".
3. Pestaña de moderación con diff y aprobar/rechazar.
4. `RevisionGuard` (reglas automáticas).
5. Historial y revertir.
6. Niveles de confianza.

### Títulos y nombres alternativos (largo plazo, opcional)

Diseño acordado (2026-11-19). **Estado: pendiente, fase a largo plazo.**

- `title` (es/en) sigue siendo `translatable`: son **idiomas de la interfaz** y de él sale el slug. **No** meter `ja`, romaji, etc. en ese JSON (romperían el fallback, el slug y `WithTranslations`).
- El título original, el romaji y los alias son **propiedades de la obra**, no traducciones → van en una tabla aparte:

```
work_titles
├── work_id      → works (cascade)
├── title        string           "Re:ゼロから始める異世界生活"
├── kind         enum             native | romanized | alias
├── lang         string(10) null  BCP 47: ja | ko | zh | ja-Latn …
└── unique(work_id, kind, lang, title)
```

- Totalmente opcional: una obra sin filas funciona igual.
- `scopePossibleDuplicates` y `search` deben buscar también en `work_titles` (ej. "Kono Subarashii Sekai ni Shukufuku wo" → "Konosuba").
- `alias` puede acabar absorbiendo `abbreviation` (varias abreviaturas por obra).
- Cambios registrados como relación (`recordRelationChange`, igual que tags). En `RevisionGuard`, quitar o cambiar el `native` = **cambio estructural**.
- Authors tienen el mismo caso (渡航 / Wataru Watari): valorar una tabla polimórfica `alternative_names` (`nameable_type/id`) para Work y Author.
- En público: título en el idioma del lector como principal; nativo y romaji debajo, en pequeño.
