# MizumeBlog — DB Notes

> Estructura final de la base de datos tras la consolidación de migraciones (2026-11-18).
> MariaDB 10.11 · charset `utf8mb4` · collation `utf8mb4_unicode_ci` · 22 migraciones · 27 tablas.

## Migraciones

| # | Migración | Tablas | Para qué |
|---|---|---|---|
| 1 | `0001_01_01_000000_create_users_table` | `users`, `password_reset_tokens`, `sessions` | Usuarios (`uuid` público, `role`, `featured_quota`) y sesión |
| 2 | `0001_01_01_000001_create_cache_table` | `cache`, `cache_locks` | Caché de Laravel |
| 3 | `0001_01_01_000002_create_jobs_table` | `jobs`, `job_batches`, `failed_jobs` | Colas de Laravel |
| 4 | `2026_07_13_052013_create_personal_access_tokens_table` | `personal_access_tokens` | Tokens de Sanctum |
| 5 | `2026_09_26_063807_create_tags_table` | `tags` | Tags de obras (ficha neutra, traducible) |
| 6 | `2026_09_26_064200_create_works_table` | `works` | Ficha neutra de una obra |
| 7 | `2026_09_26_064958_create_authors_table` | `authors` | Ficha neutra de un autor real |
| 8 | `2026_09_26_070000_create_posts_table` | `posts` | Aportación de un usuario (artículo o contenido del sitio) |
| 9 | `2026_09_26_070100_create_comments_table` | `comments` | Comentarios y respuestas de un post |
| 10 | `2026_09_26_070226_create_media_table` | `media` | Imágenes (spatie/laravel-medialibrary) |
| 11 | `2026_09_26_100614_create_works_authors_table` | `works_authors` | Pivote work ↔ author (N:M) |
| 12 | `2026_09_26_123254_create_works_tags_table` | `works_tags` | Pivote work ↔ tag (N:M) |
| 13 | `2026_09_26_124452_create_banned_users_table` | `banned_users` | Baneos por email / IP |
| 14 | `2026_09_26_124711_create_reports_table` | `reports` | Reportes de moderación |
| 15 | `2026_09_26_125036_create_reports_post_table` | `reports_post` | Pivote report ↔ post |
| 16 | `2026_09_26_125220_create_reports_media_table` | `reports_media` | Pivote report ↔ media |
| 17 | `2026_09_26_125304_create_requests_permissions_table` | `requests_permissions` | Solicitudes de permiso sobre posts |
| 18 | `2026_09_26_130114_create_violation_logs_table` | `violation_logs` | Registro de abusos reiterados |
| 19 | `2026_10_07_145133_create_claims_table` | `claims` | Reclamación de ficha por el autor real |
| 20 | `2026_10_07_145225_create_claims_post_table` | `claims_post` | Pivote claim ↔ post |
| 21 | `2026_10_07_145241_create_claims_media_table` | `claims_media` | Pivote claim ↔ media |
| 22 | `2026_11_18_000000_create_entity_revisions_table` | `entity_revisions` | Cola de revisión + historial de fichas neutras |

## Principio: ficha neutra vs aportación

| | Ficha (`works`, `authors`, `tags`) | Aportación (`posts`) |
|---|---|---|
| Dueño | Nadie (comunidad). `created_by` es solo atribución | El usuario que lo escribe (`user_id`) |
| Cambios | Todo create / update / delete / restore queda en `entity_revisions` | Solo su autor lo edita |
| Borrado | Soft delete (`deleted_at`), reversible | Soft delete |

## Tablas principales

### `works` — ficha de una obra

| Campo | Tipo | Notas |
|---|---|---|
| `title`, `sinopsi` | json | Traducibles `{"es": ..., "en": ...}` |
| `slug` | varchar, **unique** | Siempre desde `title.es`; clave de las rutas |
| `abbreviation` | varchar, index | Detección de duplicados |
| `category` / `medium` | enum | `literatura`, `animemanga` / `libro`, `poema`, `novela_ligera`, `novela`, `anime`, `manga`, `pelicula` |
| `status` | enum | `pending` → `verified` (pending ya se puede usar) |
| `created_by` | FK users, null on delete | Atribución, no da permisos |
| `home_at`, `home_order` | timestamp / smallint | Curación de la home por el admin (`null` = no sale) |

### `authors` — ficha de un autor real

| Campo | Tipo | Notas |
|---|---|---|
| `name`, `last_name`, `pseudonym` | varchar null | **CHECK**: al menos uno no es null |
| `slug` | varchar, **unique** | Desde el seudónimo o nombre + apellido |
| `birth_year` | smallint con signo | Admite años a.C. |
| `description` | json | Traducible |
| `status`, `created_by` | — | Igual que en `works` |

### `tags`

| Campo | Tipo | Notas |
|---|---|---|
| `name` | json | Traducible. Se busca sin distinguir mayúsculas ni tildes |

### `posts` — aportación de un usuario

| Campo | Tipo | Notas |
|---|---|---|
| `title`, `description` | json | Traducibles. El contenido va en `.md` por idioma, en disco |
| `code` | varchar, unique | Carpeta del contenido |
| `type` | enum | `article`, `legality`, `community`, `policies` |
| `publish_date` | date null, index | `null` = borrador; futura = programado |
| `user_id` | FK users | Dueño del post |
| `work_id` | FK works, null | Artículo sobre un work |
| `author_id` | FK authors, null, **unique** | Artículo sobre un author (uno por author) |
| `featured_at`, `featured_by` | timestamp / FK users | Destacado si `featured_at` no es null. Si `featured_by = user_id`, consume el cupo del autor |

Reglas que garantiza la base de datos:

- **unique(`user_id`, `work_id`)**: un usuario escribe un solo post por work.
- **unique(`author_id`)**: un author tiene un único artículo.
- **CHECK `posts_article_target_check`**: un `article` tiene exactamente uno de `work_id` / `author_id`; el resto de tipos, ninguno.
- `article_type` **no es columna**: el modelo lo deduce (`work_id` → `work`, `author_id` → `author`).
- Un post sobre varios works sería otra entidad (implementación futura).

### `entity_revisions` — cola de revisión + historial

| Campo | Tipo | Notas |
|---|---|---|
| `revisable_type` / `revisable_id` | morph | Alias del morphMap: `work`, `author`, `tag` |
| `action` | enum | `create`, `update`, `delete`, `restore` |
| `changes` | json | Solo el diff: `{"sinopsi.en": {"old": …, "new": …}, "tags": {"old": [1,2], "new": [3]}}` |
| `reason` | text null | Obligatorio para usuarios (validación) |
| `status` | enum | `pending` = en la cola · `approved` = historial · `rejected` = descartada (se purga a los 6 meses) |
| `source` | enum | `user`, `moderator`, `system` |
| `flags` | json null | Alertas de `RevisionGuard` |
| `reviewed_by`, `reviewed_at`, `review_note` | — | Moderación |
| `reverts_id` | FK propia | Revertir = revisión nueva con el diff invertido |

Índices: (`status`, `created_at`) para la cola; (`user_id`, `created_at`) para el historial del usuario y las ráfagas.

### `users` — campos propios

| Campo | Notas |
|---|---|
| `uuid` | unique; identificador público en las rutas |
| `role` | `admin`, `editor`, `user` |
| `featured_quota` | Destacados propios permitidos (por defecto 1, lo fija el admin) |

### `media` — créditos del artista

Sin columnas nuevas: cada imagen guarda sus créditos en `custom_properties` (modelo `App\Models\Media`, configurado en `media-library.media_model`).

```json
{ "credit": { "artist": "Ana Ilustra", "social": "@ana_draws en Pixiv" } }
```

| Clave | Notas |
|---|---|
| `credit.artist` | Obligatorio para que haya crédito (máx. 120). Sin artista no se guarda `credit` |
| `credit.social` | Texto libre y opcional (máx. 255): @usuario, nombre de la red o URL |

- En JSON sale como `credit: { artist, social, social_url }`, o `null` si no hay artista.
- `social_url` solo se rellena si `social` es una URL `http(s)`. El frontend enlaza **siempre** con `social_url`, nunca con el texto libre (evita `javascript:`).
- Al reutilizar una imagen (`$media->copy(...)`), los créditos viajan con ella.
- API: `Media::creditProperties($artist, $social)` al subir, `setCredit()` / `forgetCredit()` / `hasCredit()` al editar, `Media::creditRules()` para validar.

## Columnas traducibles y búsqueda

- En MariaDB, una columna `json` es `longtext` con `CHECK (json_valid(...))` y collation **`utf8mb4_bin`**, así que un `LIKE` directo distingue mayúsculas.
- Los scopes (`whereTranslationLike`, `whereTranslationIs`, `orderByTranslation`) comparan con `JSON_UNQUOTE(JSON_EXTRACT(col, '$."es"')) COLLATE utf8mb4_unicode_ci`, que ignora mayúsculas y tildes.
- El frontend recibe cada campo traducible ya resuelto al idioma actual (`title = "valor"`), con fallback a `es`.

## SQL de la estructura completa

> Generado con `mariadb-dump --no-data` a partir de las migraciones y validado (crea las 27 tablas).
> Excluye la tabla `migrations` de Laravel. Las tablas salen en orden alfabético, por eso se desactivan las FK durante la creación.
> Los `CHECK` solo existen en MariaDB/MySQL: en SQLite (tests) las migraciones no los crean.

```sql
CREATE DATABASE IF NOT EXISTS `mizumeblog_local` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mizumeblog_local`;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `authors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `pseudonym` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `birth_year` smallint(6) DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`description`)),
  `status` enum('pending','verified') NOT NULL DEFAULT 'pending',
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `authors_slug_unique` (`slug`),
  KEY `authors_created_by_foreign` (`created_by`),
  CONSTRAINT `authors_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `authors_identity_check` CHECK (`name` is not null or `last_name` is not null or `pseudonym` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `banned_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `banned_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `banned_users_banned_by_foreign` (`banned_by`),
  KEY `banned_users_email_index` (`email`),
  KEY `banned_users_ip_address_index` (`ip_address`),
  CONSTRAINT `banned_users_banned_by_foreign` FOREIGN KEY (`banned_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `claims` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `social_proof_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`social_proof_url`)),
  `status` enum('pending_verification','under_review','approved','rejected') NOT NULL DEFAULT 'pending_verification',
  `message` text NOT NULL,
  `verification_token` varchar(64) DEFAULT NULL,
  `verification_token_expires_at` timestamp NULL DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `reviewed_by` bigint(20) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `claims_verification_token_unique` (`verification_token`),
  KEY `claims_reviewed_by_foreign` (`reviewed_by`),
  KEY `claims_user_id_foreign` (`user_id`),
  CONSTRAINT `claims_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `claims_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `claims_media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `claims_id` bigint(20) unsigned NOT NULL,
  `media_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `claims_media_claims_id_media_id_unique` (`claims_id`,`media_id`),
  KEY `claims_media_media_id_foreign` (`media_id`),
  CONSTRAINT `claims_media_claims_id_foreign` FOREIGN KEY (`claims_id`) REFERENCES `claims` (`id`) ON DELETE CASCADE,
  CONSTRAINT `claims_media_media_id_foreign` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `claims_post` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `claims_id` bigint(20) unsigned NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `claims_post_claims_id_post_id_unique` (`claims_id`,`post_id`),
  KEY `claims_post_post_id_foreign` (`post_id`),
  CONSTRAINT `claims_post_claims_id_foreign` FOREIGN KEY (`claims_id`) REFERENCES `claims` (`id`) ON DELETE CASCADE,
  CONSTRAINT `claims_post_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `comments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `publish_date` date NOT NULL DEFAULT curdate(),
  `user_id` bigint(20) unsigned NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_user_id_foreign` (`user_id`),
  KEY `comments_post_id_foreign` (`post_id`),
  KEY `comments_parent_id_foreign` (`parent_id`),
  CONSTRAINT `comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `entity_revisions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `revisable_type` varchar(255) NOT NULL,
  `revisable_id` bigint(20) unsigned NOT NULL,
  `action` enum('create','update','delete','restore') NOT NULL,
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`changes`)),
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `source` enum('user','moderator','system') NOT NULL DEFAULT 'user',
  `flags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`flags`)),
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `reviewed_by` bigint(20) unsigned DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_note` text DEFAULT NULL,
  `reverts_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entity_revisions_revisable_type_revisable_id_index` (`revisable_type`,`revisable_id`),
  KEY `entity_revisions_reviewed_by_foreign` (`reviewed_by`),
  KEY `entity_revisions_reverts_id_foreign` (`reverts_id`),
  KEY `entity_revisions_status_created_at_index` (`status`,`created_at`),
  KEY `entity_revisions_user_id_created_at_index` (`user_id`,`created_at`),
  CONSTRAINT `entity_revisions_reverts_id_foreign` FOREIGN KEY (`reverts_id`) REFERENCES `entity_revisions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `entity_revisions_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `entity_revisions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  `uuid` char(36) DEFAULT NULL,
  `collection_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `disk` varchar(255) NOT NULL,
  `conversions_disk` varchar(255) DEFAULT NULL,
  `size` bigint(20) unsigned NOT NULL,
  `manipulations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`manipulations`)),
  `custom_properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`custom_properties`)),
  `generated_conversions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`generated_conversions`)),
  `responsive_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`responsive_images`)),
  `order_column` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_uuid_unique` (`uuid`),
  KEY `media_model_type_model_id_index` (`model_type`,`model_id`),
  KEY `media_order_column_index` (`order_column`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`title`)),
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`description`)),
  `code` varchar(255) DEFAULT NULL,
  `type` enum('article','legality','community','policies') NOT NULL DEFAULT 'community',
  `publish_date` date DEFAULT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `work_id` bigint(20) unsigned DEFAULT NULL,
  `author_id` bigint(20) unsigned DEFAULT NULL,
  `featured_at` timestamp NULL DEFAULT NULL,
  `featured_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `posts_user_id_work_id_unique` (`user_id`,`work_id`),
  UNIQUE KEY `posts_author_id_unique` (`author_id`),
  UNIQUE KEY `posts_code_unique` (`code`),
  KEY `posts_work_id_foreign` (`work_id`),
  KEY `posts_featured_by_foreign` (`featured_by`),
  KEY `posts_publish_date_index` (`publish_date`),
  KEY `posts_featured_at_index` (`featured_at`),
  CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`),
  CONSTRAINT `posts_featured_by_foreign` FOREIGN KEY (`featured_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `posts_work_id_foreign` FOREIGN KEY (`work_id`) REFERENCES `works` (`id`),
  CONSTRAINT `posts_article_target_check` CHECK (`type` = 'article' and `work_id` is null <> (`author_id` is null) or `type` <> 'article' and `work_id` is null and `author_id` is null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `status` enum('pending','resolved','rejected') NOT NULL DEFAULT 'pending',
  `resolved_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_resolved_by_foreign` (`resolved_by`),
  CONSTRAINT `reports_resolved_by_foreign` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reports_media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) unsigned NOT NULL,
  `media_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reports_media_report_id_media_id_unique` (`report_id`,`media_id`),
  KEY `reports_media_media_id_foreign` (`media_id`),
  CONSTRAINT `reports_media_media_id_foreign` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`),
  CONSTRAINT `reports_media_report_id_foreign` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reports_post` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) unsigned NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reports_post_report_id_post_id_unique` (`report_id`,`post_id`),
  KEY `reports_post_post_id_foreign` (`post_id`),
  CONSTRAINT `reports_post_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  CONSTRAINT `reports_post_report_id_foreign` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `requests_permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `status` enum('denied','accepted','pending','expired','used') NOT NULL DEFAULT 'pending',
  `granted_at` timestamp NULL DEFAULT NULL,
  `access_expires_at` timestamp NULL DEFAULT NULL,
  `requested_at` timestamp NULL DEFAULT NULL,
  `granted_by` bigint(20) unsigned DEFAULT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `post_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `requests_permissions_granted_by_foreign` (`granted_by`),
  KEY `requests_permissions_user_id_foreign` (`user_id`),
  KEY `requests_permissions_post_id_foreign` (`post_id`),
  CONSTRAINT `requests_permissions_granted_by_foreign` FOREIGN KEY (`granted_by`) REFERENCES `users` (`id`),
  CONSTRAINT `requests_permissions_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  CONSTRAINT `requests_permissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tags` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`name`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user','editor') NOT NULL DEFAULT 'user',
  `google_id` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `featured_quota` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_uuid_unique` (`uuid`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `violation_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `attempts_count` int(11) NOT NULL,
  `post_id` bigint(20) unsigned DEFAULT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `violation_logs_post_id_foreign` (`post_id`),
  KEY `violation_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `violation_logs_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `violation_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `works` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`title`)),
  `slug` varchar(255) NOT NULL,
  `abbreviation` varchar(255) NOT NULL,
  `category` enum('literatura','animemanga') NOT NULL,
  `medium` enum('libro','poema','novela_ligera','novela','anime','manga','pelicula') NOT NULL,
  `publish_date` date NOT NULL,
  `sinopsi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`sinopsi`)),
  `status` enum('pending','verified') NOT NULL DEFAULT 'pending',
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `home_at` timestamp NULL DEFAULT NULL,
  `home_order` smallint(5) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `works_slug_unique` (`slug`),
  KEY `works_created_by_foreign` (`created_by`),
  KEY `works_home_at_home_order_index` (`home_at`,`home_order`),
  KEY `works_abbreviation_index` (`abbreviation`),
  CONSTRAINT `works_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `works_authors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `author_id` bigint(20) unsigned NOT NULL,
  `work_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `works_authors_author_id_work_id_unique` (`author_id`,`work_id`),
  KEY `works_authors_work_id_foreign` (`work_id`),
  CONSTRAINT `works_authors_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`),
  CONSTRAINT `works_authors_work_id_foreign` FOREIGN KEY (`work_id`) REFERENCES `works` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `works_tags` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tag_id` bigint(20) unsigned NOT NULL,
  `work_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `works_tags_tag_id_work_id_unique` (`tag_id`,`work_id`),
  KEY `works_tags_work_id_foreign` (`work_id`),
  CONSTRAINT `works_tags_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
  CONSTRAINT `works_tags_work_id_foreign` FOREIGN KEY (`work_id`) REFERENCES `works` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
```
