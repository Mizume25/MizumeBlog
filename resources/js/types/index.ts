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
 * @interface
 * Interfaz de usuario   
 */
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role:string;
    google_id?:number
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

/**
 * Interfaces de Post
 */
export interface Post {
    id:number,
    titulo: string,
    web_title?:string,
    genero: string,
    categoria: string,
    autor: string,
    fecha_publicacion:string,
    descripcion?:string,
    destacado: 1 | 0
    portada?:string,
    card?:string,
    publicado: boolean
}

/**
 * @interface Comentario
 * Interfaz de  Comentario a Comentario
 */
export interface Comentario {
    id:number,
    descripcion:string,
    fecha:string,
    post_id:number,
    user:User
    replies?: Respuesta[];
}

/**
 * @interface Respuesta
 * Interfaz de  Respuesta a Comentario
 */
export interface Respuesta extends Omit<Comentario, 'replies'> {
    parent_id: number;
    user:User
}

export interface Book {
    title:string,
    author:string,
    image?:string,
    color1:string,
    color2:string,
    accent:string,
}



/***  INTERFACES TEMPORALES   */
export type PostTemp = {
    id:number,
    titulo: string,
    web_title?:string,
    genero: string,
    categoria: string,
    autor: string,
    fecha_publicacion:string,
    descripcion?:string,
    destacado: 1 | 0
    portada?:string,
    card?:string,
    publicado: boolean
}

export type PosRecord =  PostTemp & {
    comentarios: ComentarioRecord[]
    
}

export interface ComentarioTemp {
    id:number,
    descripcion:string,
    fecha:string,
    post_id:number,
    user_id:number,
    parent_id?: number,
    created_at: string;
    updated_at: string;
}

export type ComentarioRecord = ComentarioTemp & {
    replies: ComentarioTemp[]
}

export type UserTemp =  {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role:string;
    google_id?:number
    created_at: string;
    updated_at: string;
    comentarios: ComentarioRecord [];
}
