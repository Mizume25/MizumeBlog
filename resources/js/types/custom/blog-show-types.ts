/**
 * @fileoverview Archivo de types de blog show
 */
import type React from 'react';

/** Nodo del índice (árbol de encabezados del markdown) */
export type Nodo = { id: string; title: string; children?: Nodo[] };

export interface BlogShowContextProps {
    hasAside: boolean;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
}

export interface BlogShowProps {
    children: React.ReactNode;
    /** Contenido del sidebar secundario (derecha) */
    aside?: React.ReactNode;
    /** Título del bloque del sidebar secundario */
    asideTitle?: string;
    /** Ancho del sidebar secundario en escritorio (ej. '20rem') */
    asideWidth?: string;
}
