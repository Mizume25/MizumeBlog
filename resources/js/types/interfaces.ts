/**
 * @fileoverview Archivos de exportacion de interfaces web
 */
import { LucideIcon } from 'lucide-react';

/**
 * @interface Auth
 * Sesion Autentificada
 */
export interface Auth {
    user: User;
}

/**
 * @interface BreadcrumbItem
 * Interfaz de links
 */
export interface BreadcrumbItem {
    title: string;
    href: string;
}

/**
 * @interface NavGroup
 * Nav de Items
 */
export interface NavGroup {
    title: string;
    items: NavItem[];
}

/**
 * @interface NavItem
 * Indice de de links
 */
export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface FlashMessage {
    success?: string | null;
    error?: string | null;
    warning?: string | null
}

/**
 * @interface
 * Datos Compartidos
 */
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
    flash: FlashMessage;
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

export type CreateField = {
    id?: number;
    created_at?: string;
    updated_at?: string;
};

/**
 * @interface
 * Interfaz de usuario
 */
export type User = Field & {
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role: string;
    google_id?: number;
};

export interface Book {
    title: string;
    author: string;
    image?: string;
    color1: string;
    color2: string;
    accent: string;
}

/***
 * Lista de types de mi Página Web
 */

/**
 * Enum de Category
 * @type Category
 */
export type Category = 'literatura' | 'animemanga' | 'reflexiones';

/**
 * @type Post
 * Propiedades de un Post
 */
export type Post = Field & {
    title: string;
    web_title: string;
    tags: string;
    category: Category;
    author: string;
    publish_date?: string;
    description: string;
    featured: boolean;
    cover?: string;
    cover_card?: string;
    config?: Config;
    images?:PostImageWithImage []
    
};

/**
 * @type Artwork
 * Propiedades de un Artwork
 */

export type Artwork = Field & {
    title: string;
    code: string;
};

export type ArtworkInput = {
    id: number | null;
    title: string;
};

export type ArtworkPictures = {
    id: number
    name: string;
    alt: string | null;
};

/**
 * @type Artwork Image
 * Propeidades de Artwork Image
 */
export type Artwork_Image = Partial<Field> & {
    num?: number;
    name: string;
    alt: string;
};

export type PostImage = Field & {
    post_id: number;
    artwork_image_id: number;
    key: string;
};

export type PostImageWithImage = PostImage & {
    image: Artwork_Image;
};

/**
 * @type Post Image
 * Propiedades de Post Image
 */
export type Post_Image = Field & {
    post_id: number;
    artwork_image_id: number;
    key: string;
};

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

export type Reply = Comment & {
    user: User;
};

/**
 * Types que utilizaremos
 */

/**
 * Comentario con Respuestas
 * @type ComentarioRecord
 */
export type CommentRecord = Comment & {
    replies: Reply[];
    user: User;
    post?: Post;
};

export type UserRecord = User & {
    coemntarios: Comment[];
};

/***
 *
 * Gestor de contenidos web
 */

/**
 * Formato de imagenes
 * @type Formato de Imagenes
 */
export type Config = {
    home_config?: string;
    article_config?: string;
    card_config?: string;
    accent?: string;
};
/**
 * Formato Default de imagenes
 */
export const formatDefault: Config = {
    home_config: 'center',
    article_config: 'bg-[center_18%]',
    card_config: '10%',
    accent: '#fcfcfd',
};

/**
 * Indices de Post
 * @type Index
 */
export type IndexContent = {
    id: string;
    titulo: string;
};

/**
 * Contenido Post
 * @type
 */
export type ContentPost = {
    index: IndexContent[];
    body: string;
};

/**
 * Contenido de Post
 * @type Contenido de web
 */
export type Content = {
    post: Post;
    index: IndexContent[];
    body: string;
    comments: CommentRecord[];
    features: Post[];
};

/**
 * Datos a analizar
 */
export type Data = {
    users: User[];
    posts: Post[];
    coments: Comment[];
};
