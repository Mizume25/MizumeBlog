# Mejoras propuestas — MizumeBlog

Propuestas de stack/librerías tras revisar `composer.json`, `package.json`, `docker-compose.yml` y `docs/MizumeBlog.md` (29/08/2026). No implementar nada de aquí salvo autorización explícita — este documento es solo referencia para cuando el usuario decida abordar alguna.

## 1. Aprovechar Redis (ya en docker-compose, sin coste nuevo infra)

El contenedor `redis` existe pero no se usa: `CACHE_STORE=database`, `QUEUE_CONNECTION=database`, `SESSION_DRIVER=database` en `.env`.

- **Cache** → `CACHE_STORE=redis`. Beneficia sobre todo a `Post::distincValues()`, `tags()`, `categories()`, `formats()`, que se recalculan contra MySQL en cada request.
- **Queue** → `QUEUE_CONNECTION=redis` + `laravel/horizon`. La generación de PDF (`HomeController::pdf()` con `barryvdh/laravel-dompdf`) y el procesado de imágenes de `Artwork`/`ArtworkImage` deberían ir a cola, no bloquear el request.
- **Session** → `SESSION_DRIVER=redis`. Más rápido que la tabla `sessions` y evita mantenimiento de esa tabla.

## 2. Pipeline de imágenes

El dominio gira en torno a `Artwork` / `ArtworkImage` / `PostImage` / portadas configurables (`cover`, `cover_card`), pero no hay librería de procesado de imágenes.

- **`intervention/image`** (o `spatie/laravel-image-optimizer`): generar variantes (thumbnail / card / cover) al subir en `FileContentService::saveImages()`, en vez de servir siempre el original.
- Conversión automática a **WebP/AVIF** — impacto directo en tiempo de carga de un sitio image-heavy.
- `aws-sdk-php` ya está en `composer.json` pero `FILESYSTEM_DISK=local`. Si crece el volumen de imágenes: mover a S3 o Cloudflare R2 (compatible con el mismo SDK, más barato) + CDN delante.

## 3. Búsqueda

`Post::tags()`, `categories()`, `distincValues()` están hechos a mano en el modelo para alimentar filtros del archivador/library.

- **Laravel Scout + driver `database`**: mismo Scout, sin infra nueva, si el volumen es bajo.
- **Meilisearch / Typesense** (self-hosted, ligero): full-text real sobre título/descripción/contenido Markdown si el catálogo crece.

## 4. Testing / calidad (prioridad alta — relacionado con el incidente del 29/08)

Solo 11 archivos de test para un dominio con 3 Policies, casts custom (`ConfigCast`) y un bug de Inertia que costó tiempo por no dar ninguna excepción ni log.

- **Pest** (el plugin ya está permitido en `composer.json` vía `pestphp/pest-plugin` pero no se usa activamente) en vez de PHPUnit puro — más legible para Policies/DTO.
- **Test/lint específico anti-regresión**: un check en CI que falle si algún archivo PHP de una clase termina en `?>` con contenido extra tras el cierre — causa raíz exacta del incidente de `ArticleConfig.php` del 29/08.
- **GitHub Actions**: `pint` + tests + `npm run lint` + `tsc --noEmit` en cada push. No hay `.github/workflows` en el repo todavía.

## 5. Frontend

Base actual (Radix, shadcn-style, react-hook-form + zod, sonner) está bien, no tocaría eso. Huecos puntuales:

- **`@tanstack/react-query`**: normalmente redundante con Inertia, pero si `ApiController` (endpoints `/api/*` con Sanctum: `upcomming`, `apiComments`, `avaliable`, `replace`, `associate`, `symlink`) sigue creciendo para llamadas fuera del ciclo Inertia, aporta caché/retry en esa capa.
- **Sentry** (o dashboard sobre `laravel/pail`): captura en producción justo el tipo de fallo silencioso que tuvo el proyecto — el bug de Inertia no lanzó excepción ni dejó log.

## 6. Backups

`AdminController::backup()` es una implementación propia. Sustituir por **`spatie/laravel-backup`**: rotación, subida a S3/R2 y notificación por email sin mantener código custom.

---

*Generado a petición del usuario el 29/08/2026. Avisar cuando se quiera implementar alguno de estos puntos para planificarlo en detalle.*
