/**
 * @fileoverview Archivos de exportacion de interfaces web
 */
import { LucideIcon } from 'lucide-react';
import { User } from './definitions';
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
    warning?: string | null;
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











export type Reply = Comment & {
    user: User;
};


/** Opcionalidades de backgrounds  */
export type BackgroundPositionKeyword = 'top' | 'center' | 'bottom';

export type BackgroundPositionKeywordCard =
    | 'top left'
    | 'top center'
    | 'top right'
    | 'center left'
    | 'center'
    | 'center center'
    | 'center right'
    | 'bottom left'
    | 'bottom center'
    | 'bottom right';

export const BackgroundOptions = ['top', 'center', 'bottom'];

export const BackgroundOptionsCard = [
    'top left',
    'top center',
    'top right',
    'center left',
    'center',
    'center center',
    'center right',
    'bottom left',
    'bottom center',
    'bottom right',
];
