# Diseño: flujo de autores y obras + borrado (soft delete)

> Propuesta del 2026-11-16 · **Estado: pendiente de revisión e implementación**

Índice

1. [Flujo de autores y obras](#1-flujo-de-autores-y-obras)
2. [Borrado con soft delete](#2-borrado-con-soft-delete)
3. [Orden de implementación conjunto](#3-orden-de-implementación-conjunto)
4. [Preguntas abiertas para revisar](#4-preguntas-abiertas-para-revisar)

---

## 1. Flujo de autores y obras

### 1.1 Principio: ficha neutra vs aportación propia

| | Ficha (Work / Author) | Aportación (Post) |
|---|---|---|
| Qué es | Datos neutros: título, sinopsis, categoría, medio, autores, tags | Opinión/análisis del usuario, sin límite de extensión |
| Dueño | **Nadie** (comunidad) | El usuario que lo escribe |
| Edición | Cualquiera *propone*; el cambio se revisa | Solo su autor |
| Ya existe | `works`, `authors` | `posts` + `articles_works` |

- Un usuario puede escribir posts sobre varios works (1 work por post y 1 post por usuario+work, ya forzado en `articles_works`), pero **eso nunca le da poder sobre la ficha**.
- Opiniones o valoraciones van en el post, nunca en la ficha.

### 1.2 Flujo de un work

1. **Crear si no existe**: desde el formulario del post. Antes de crear, buscar **duplicados** (slug, `abbreviation`, título similar) y preguntar *"¿te refieres a…?"*. Evita cinco fichas de la misma obra.
2. **Estado** `pending` → `verified`.
   - Una ficha `pending` ya se puede usar para escribir posts (no bloquear al usuario).
   - En público se marca como *"ficha sin verificar"*.
   - `created_by` es solo atribución, **no da permisos**.
3. **Editar = proponer**: ningún usuario modifica la ficha directamente; genera una **propuesta de cambio** que va a la cola de revisión.
4. **Historial**: cada cambio aprobado queda registrado (quién, qué, cuándo, por qué) y es reversible.

### 1.3 Cola de revisión (moderación)

Nueva pestaña de moderación en el taller (junto a `reports` / `requests`). Cada propuesta muestra:

- **Diff** campo a campo (antes → después).
- Usuario, motivo y su historial (propuestas aceptadas / rechazadas).
- Acciones: aprobar · rechazar · comentar.

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

### 1.4 Evitar que se "jibarice" la información (`RevisionGuard`)

Servicio que rellena `flags` al crear la propuesta, para que el moderador no tenga que revisar todo con la misma lupa:

| Regla | Ejemplo |
|---|---|
| Reducción de texto | la sinopsis pierde > 30 % de su longitud |
| Campo vaciado | se borra un campo que tenía valor |
| Cambio estructural | título, categoría, medio o quitar un autor → **siempre** revisión humana |
| Desvío de neutralidad | primera persona o valoraciones ("me encantó") en la sinopsis |
| Ráfaga | muchas propuestas del mismo usuario en poco tiempo |

Abuso reiterado → registrar en `violation_logs` (ya existe).

### 1.5 Authors (más protección)

- Habla de una persona real: toda propuesta pasa por revisión, **nunca** auto-aprobación.
- El autor real verificado reclama su ficha mediante `claims` (ya existe) y puede gestionarla.
- `RequestPermission` se mantiene para permisos sobre posts; no mezclarlo con la ficha de autor.

### 1.6 Niveles de confianza (fase posterior)

Con N propuestas aceptadas, los **cambios menores** (tags, erratas, sin flags) se auto-aprueban. Los estructurales o con flags siguen yendo a revisión. Así la cola no explota cuando crezca el blog.

---

## 2. Borrado con soft delete

### 2.1 Dónde sí y dónde no

| Modelo | ¿Soft delete? | Motivo |
|---|---|---|
| **Post** | ✅ Sí | Contenido largo del usuario; un borrado por error es muy caro. Permite "papelera" en el taller. |
| **Work / Author** | ✅ Sí | Fichas de comunidad; encaja con el flujo de revisiones (borrar = otra propuesta, reversible). |
| **Comment** | ✅ Opcional | Útil en moderación: ocultar sin perder la evidencia de un reporte. |
| **Pivotes** (`articles_works`, `works_tags`…) | ❌ No | Son relaciones, no contenido; se restauran con su post. |
| **Reports / Claims / ViolationLogs** | ❌ No | Son auditoría: no se borran, se cierran con `status`. |

### 2.2 Trampas del esquema actual

**1. `unique` con filas borradas**

`articles_works` tiene `unique(user_id, work_id)`. Si un usuario soft-borra su post sobre un work, la fila del pivote sigue ahí y **no podrá escribir otro post sobre ese work**. Igual con los `slug` únicos de works y authors.

- **Recomendado**: convertirlo en feature. Si intenta escribir sobre un work donde tiene un post borrado → *"Tienes un post borrado sobre esta obra, ¿restaurarlo?"*. No se tocan las constraints, que hoy protegen de duplicados.
- Alternativa: MariaDB no tiene índices parciales; se puede usar una columna generada que sea `NULL` cuando `deleted_at` no es nulo e incluirla en el `unique`. Funciona, pero complica las migraciones existentes.

**2. Las queries cambian solas**

Con `SoftDeletes`, `whereHas('works')` ignora works borrados: sus posts desaparecen de `works/show`, de `stats` y de `counts`. Normalmente es lo deseado, pero hay que tenerlo presente.

**3. Borrar un work con posts**

Un usuario normal no borra fichas neutras. Solo un moderador, y **bloqueado si tiene posts** (o con aviso explícito de cuántos posts quedarían ocultos).

**4. Storage y media**

- `content.md` / `index.json` **no se tocan** en soft delete; solo en `forceDelete()` (evento `forceDeleted` o `pruning()`).
- Spatie Media Library ya distingue: con `SoftDeletes` solo borra ficheros en `forceDelete`.

### 2.3 Limpieza automática (papelera de 30 días)

```php
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes, Prunable;

    /** Borrado definitivo a los 30 días en la papelera */
    public function prunable(): Builder
    {
        return static::onlyTrashed()->where('deleted_at', '<=', now()->subDays(30));
    }

    /** Antes del borrado definitivo: limpiar storage */
    protected function pruning(): void
    {
        Storage::disk('local')->deleteDirectory($this->user->path($this->code));
    }
}
```

En `routes/console.php`:

```php
Schedule::command('model:prune')->daily();
```

> Usar `Prunable`, **no** `MassPrunable`: este último no dispara `pruning()` y dejaría carpetas de storage huérfanas.

### 2.4 Interfaz

- Pestaña posts del taller: filtro **"Papelera"** con *restaurar* / *borrar definitivamente*.
- `confirmDelete` avisa: *"se puede restaurar durante 30 días"*.
- `InfoPanel`: tarjeta opcional "En papelera".

---

## 3. Orden de implementación conjunto

1. Soft delete en `Post` + papelera en el taller + `Prunable` (independiente, se puede hacer ya).
2. Detección de duplicados al crear work + estado `pending` / `verified`.
3. Tabla `entity_revisions` + formulario "proponer cambio".
4. Pestaña de moderación con diff y aprobar/rechazar.
5. `RevisionGuard` (reglas automáticas).
6. Soft delete en `Work` / `Author` (como tipo de propuesta revisable).
7. Historial y revertir.
8. Niveles de confianza.

---

## 4. Preguntas abiertas para revisar

- [ ] ¿Quién modera? ¿Solo `admin` o también un rol `moderator` nuevo?
- [ ] ¿Umbral de reducción de texto: 30 % es razonable?
- [ ] ¿Cuántas propuestas aceptadas para subir de nivel de confianza (N)?
- [ ] ¿Días de papelera: 30 está bien?
- [ ] ¿Comentarios con soft delete o basta con ocultarlos por `status`?
- [ ] ¿Una ficha `pending` debe aparecer en `works/index` público o solo accesible desde sus posts?
- [ ] ¿El autor real con `claim` aprobado edita sin revisión o con revisión ligera?
