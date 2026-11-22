/**
 * @fileoverview Tipados de la base de datos
 */

import { Nodo } from "@/services/MarkdownService";

/**
 * @enum Category
 * Categorias de la pagina
 */
export type Category = 'literatura' | 'animemanga';

/**
 * @enum Medium
 * Medios de cada obra
 */
export type Medium = "libro" | "poema" | "novela_ligera" | "novela" | "anime" | "manga" | "pelicula"


/**
 * @enum ReportSatatus
 * Categorias de la pagina
 */
export type ReportSatatus = "pending" | "resolved" | "rejected"

/**
 * @enum ReportSatatus
 * Categorias de la pagina
 */
export type PermissionsSatatus = "denied" | "accepted" | "pending" | "expired" | "used"


/**
 * @enum UserType
 * Tipos de Usuario
 */
export type UserType = "admin" | "editor" | "user" | "guest"

/**
 * @enum PostType
 * Tipos de post (posts.type)
 */
export type PostType = "article" | "legality" | "community" | "policies"

/**
 * @enum ArticleType
 * Destino de un article: se deduce de posts.work_id / posts.author_id (no es columna)
 */
export type ArticleType = "work" | "author"

/**
 * @enum EntityStatus
 * Estado de una ficha neutra (Work, Author): pending = "ficha sin verificar"
 */
export type EntityStatus = "pending" | "verified"

/**
 * @enum Locale
 * Idiomas disponibles (config app.available_locales)
 */
export type Locale = "es" | "en"

/**
 * Todas las traducciones de un campo traducible.
 *
 * Las vistas públicas NUNCA reciben esto: el backend resuelve el idioma y manda
 * el campo como texto (title = "valor"). Solo los formularios de edición lo piden
 * explícitamente (getTranslations / append('translations')).
 */
export type Translations = Partial<Record<Locale, string>>

/**
 * Entidad cargada para un formulario de edición con $model->append('translations'):
 * los campos siguen llegando como texto y además `translations` trae { campo: { es, en } }.
 * @example type WorkEdit = WithTranslations<Work, 'title' | 'sinopsi'>
 */
export type WithTranslations<T, K extends keyof T & string> = T & {
    translations: Record<K, Translations>
}

/**
 * Todos los campos comparten estas propieaddes
 * @type field
 */
export type Field = {
    id: number;
    created_at: string;
    updated_at: string;
};

/**
 * Entidades con borrado suave (works, authors, tags, posts)
 * @type SoftDeletes
 */
export type SoftDeletes = {
    deleted_at: string | null;
};


/**
 * @type User
 * Interfaz de usuario
 */
export type User = Field & {
    id: number
    name: string
    email: string
    role: string
    avatar: string
    uuid: string
    /** Destacados propios permitidos (lo fija el admin) */
    featured_quota: number
};

/**
 * @type Media
 * Interfaz de media
 */
export type Media = Field & {
    model_type: string
    model_id: number
    collection_name: string
    name: string
    file_name: string
    mime_type: string | null
    disk: string
    conversions_disk: string | null
    size: number
    custom_properties: Record<string, unknown>
    generated_conversions: Record<string, boolean>
    responsive_images: Record<string, unknown>
    order_column: number | null
    original_url: string
    preview_url?: string
    /** Créditos del artista (custom_properties.credit); null si la imagen no tiene artista */
    credit: MediaCredit | null
}

/**
 * @type MediaCredit
 * Créditos de una imagen. social es texto libre (@usuario, nombre de la red, URL...).
 * Para enlazar usa SIEMPRE social_url: solo viene si social es una URL http(s).
 */
export type MediaCredit = {
    artist: string
    social: string | null
    social_url: string | null
}

/**
 * @type Tags
 * interfaz de tags
 * name: traducible, llega ya resuelto al idioma actual
 */
export type Tag = Field & SoftDeletes & { name: string };


/**
 * @type Work
 * interfaz de work (ficha neutra de la comunidad)
 * title / sinopsi: traducibles, llegan ya resueltos al idioma actual
 */
export type Work = Field & SoftDeletes & {
    title: string,
    slug: string,
    abbreviation: string,
    category: Category,
    publish_date: string,
    sinopsi: string,
    medium: Medium,
    cover_url: string | null,
    status: EntityStatus,
    /** Atribución: NO da permisos sobre la ficha */
    created_by: number | null,
    /** Curación de la home (admin): null = no sale en la home */
    home_at: string | null,
    home_order: number | null,
}

/**
 * @type Author
 * interfaz de Autor (ficha neutra de una persona real)
 * description: traducible, llega ya resuelta al idioma actual
 */
export type Author = Field & SoftDeletes & {
    name: string | null,
    last_name: string | null,
    pseudonym: string | null,
    birth_year: number | null,
    description: string,
    profile_url: string | null,
    slug: string,
    status: EntityStatus,
    created_by: number | null,
}


/**
 *  @type Comentarios
 * Propiedades de Comentarios
 */
export type Comment = Field & {
    description: string;
    publish_date: string;
    user_id: number;
    post_id: number;
    parent_id: number;
};

/**
 *  @type Post
 * Propiedades de Post
 * title / description: traducibles, llegan ya resueltos al idioma actual
 *
 * Un article pertenece a UN work (work_id) o a UN author (author_id), nunca a ambos.
 */
export type Post = Field & SoftDeletes & {
    title: string,
    publish_date: string | null,
    description: string | null,
    type: PostType,
    code: string | null,
    user_id: number,
    work_id: number | null,
    author_id: number | null,
    /** Calculado en el backend a partir de work_id / author_id; null si no es article */
    article_type: ArticleType | null,
    /** Destacado si no es null */
    featured_at: string | null,
    /** Quién lo destacó: el propio autor (consume cupo) o un admin */
    featured_by: number | null,
}

/**
 * @type Report
 * Propiedades de Report
 */
export type Report = Field & {
    message: string,
    status: ReportSatatus,
    resolved_by: string | null,
    user_id: string | null,
}

/**
 * @type Ban
 * Propiedades de BannedUser
 */
export type Ban = Field & {
    email: string,
    ip_address: string,
    reason: string,
    user_id: number
}

/**
 * @type Violation
 */
export type Violation = Field & {
    action: string,
    attempts_count: number,
    post_id: number | null,
    user_id: number
}

/**
 * @type REQUESTS_PERMISSIONS
 * Interfaz de REQUESTS_PERMISSIONS
 */
export type Permissions = Field & {
    message: string,
    status: PermissionsSatatus,
    granted_at: string | null,
    access_expires_at: string | null,
    requested_at: string | null,
    granted_by: number,
    user_id: number,
    post_id: number,
}

/**
 * @enum RevisionAction / RevisionStatus / RevisionSource
 * Cola de revisión + historial de fichas neutras (entity_revisions)
 */
export type RevisionAction = "create" | "update" | "delete" | "restore"
export type RevisionStatus = "pending" | "approved" | "rejected"
export type RevisionSource = "user" | "moderator" | "system"

/** Entidades revisables (alias del morphMap del backend) */
export type RevisableType = "work" | "author" | "tag"

/**
 * Diff de una revisión: solo los campos que cambian.
 * Los traducibles van por idioma ("sinopsi.en"); las relaciones como arrays de ids ("authors", "tags").
 */
export type RevisionChanges = Record<string, { old: unknown, new: unknown }>

/**
 * @type EntityRevision
 * pending = propuesta en la cola · approved = entrada del historial · rejected = descartada
 */
export type EntityRevision = Field & {
    revisable_type: RevisableType,
    revisable_id: number,
    action: RevisionAction,
    changes: RevisionChanges,
    reason: string | null,
    status: RevisionStatus,
    source: RevisionSource,
    /** Alertas automáticas de RevisionGuard */
    flags: Record<string, unknown> | null,
    user_id: number | null,
    reviewed_by: number | null,
    reviewed_at: string | null,
    review_note: string | null,
    /** Revisión que esta deshace */
    reverts_id: number | null,
}

// -- Tipados customizados

/**
 * Post con relaciones. work / author solo vienen si el backend los carga
 * (y son null cuando el post no es de ese tipo).
 */
export type PostRecord = Post & {
    user: User,
    work?: WorkRecord | null
    author?: Author | null
    comments: CommentRecord[]
}

export type EntityRevisionRecord = EntityRevision & {
    user: User | null,
    reviewer: User | null,
    revisable: Work | Author | Tag | null,
}


export type WorkRecord = Work & {
    media: Media[]
    tags: Tag[],
    authors: Author[]
}

export type Reply = Comment & {
    user: User;
};

export type CommentRecord = Comment & {
    replies: Reply[];
    user: User;
    post?: Post;
};




export type Paginated<T> = {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    prev_page_url: string | null
    next_page_url: string | null
    links: { url: string | null; label: string; active: boolean }[]
}


/**
 * Maquetación de un post (prop `build` de la página works/show/post):
 * markdown completo, índice jerárquico y número de secciones ##
 */
export type PostBuild = {
    content: string,
    index: Nodo[],
    sections: number,
}  

export type MediaItem = {
  id: number
  url: string
  alt: string
  credit: { artist: string; social_url: string | null } | null
  source: { type: 'work' | 'author' | 'post'; title: string }
}
