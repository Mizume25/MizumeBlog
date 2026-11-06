/**
 * @fileoverview Archivo de types de blog show
 */
import type React from 'react';

/** Nodo del índice (árbol de encabezados del markdown) */


export interface BlogShowContextProps {
    hasAside: boolean;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
}

export interface BlogShowProps {
    children: React.ReactNode;
    /** Cabecera a ancho completo encima de la fila main + sidebar */
    header?: React.ReactNode;
    /** Fila bajo el header: solo ocupa el ancho de la columna main */
    subheader?: React.ReactNode;
    /** Hueco encima del aside, en la misma fila que subheader (mismo ancho que el aside, solo lg+) */
    asideHeader?: React.ReactNode;
    /** Contenido del sidebar secundario (derecha) */
    aside?: React.ReactNode;
    /** Título del bloque del sidebar secundario */
    asideTitle?: string;
    /** Ancho del sidebar secundario en escritorio (ej. '20rem') */
    asideWidth?: string;
}
