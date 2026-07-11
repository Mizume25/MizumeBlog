/***
 * @fileoverview Lista de Interfaces
 * 
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

/**
 * @interface
 * Datos Compartidos
 */
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

/**
 * Todos los campos comparten estas propieaddes
 * @type field
 */
export type Field = {
    id: number,
    created_at: string,
    updated_at: string,
}



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
    google_id?: number
}

export interface Book {
    title:string,
    author:string,
    image?:string,
    color1:string,
    color2:string,
    accent:string,
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
    title: string 
    web_title?: string
    tags: string,
    category: Category,
    author: string,
    publish_date?: string,
    description: string,
    featured: boolean,
    cover?:string,
    cover_card?: string,
}


/**
 *  @type Comentarios
 * Propiedades de Comentarios
 */

export type Comment = Field & {
    description: string,	
    publish_date: string,	
    user_id: number,	
    post_id: number,	
    parent_id: number,	
}

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
    replies: Reply []
    user: User
}


export type UserRecord = User & {
    coemntarios: Comment []
} 


/***
 * 
 * Gestor de contenidos web
 */

/**
 * 
 * Indices de Post
 */
export type IndexContent = {
    id:string,
    titulo: string,
}


/**
 * Contenido de Post
 */
export type Content = {
    post: Post,
    index: IndexContent [],
    body:string,
    comments: CommentRecord [],
    features: Post[],
}

/**
 * Datos a analizar
 */
export type Data =  {
  users: User[],
  posts: Post[],
  coments: Comment[]
}
