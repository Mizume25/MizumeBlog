/**
 * @fileoverview Tipados de la base de datos
 */

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
 * Todos los campos comparten estas propieaddes
 * @type field
 */
export type Field = {
    id: number;
    created_at: string;
    updated_at: string;
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
} 

/**
 * @type Tags
 * interfaz de tags
 */
export type Tag = Field & { name: string };


/**
 * @type Work
 * interfaz de work
 */
export type Work = Field &{
    title: string,
    abbreviation: string,
    category: Category,
    publish_date: string,
    sinopsi: string,
    medium: Medium,
}

/**
 * @type Author 
 * interfaz de Autor
 */
export type Author = Field & {
    name: string | null,
    last_name: string | null,
    pseudonym: string | null,
    birth_year: string | null,
    description: string, 
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
 */
export type Post = Field & {
    title: string,
    publish_date: string,
    description : string | null,
    featured: boolean,
    type: string,
    code: string | null,
    id_user: string
}


/**
 * @type PostImages
 * interfaz de PostImages
 */
export type PostImages = Field & {
    key: string,
    post_id: number,
    media_id: number
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
export type Permissions = Field &{
    message: string,
    status: PermissionsSatatus,
    granted_at: string | null,
    access_expires_at: string | null,
    requested_at: string | null ,
    granted_by: number,
    user_id: number,
    post_id: number,  
}







  