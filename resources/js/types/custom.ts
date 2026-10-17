/**
 * @fileoverview Objetos propios creados para usos particulares y especificos
 */

import { Author, Post, Tag, Work } from "./definitions"

/**
 * TYPE PET - Interfaces para la mascota web
 */

/**
 * @type Estados de la tortuga
 */
export type TurtleStatus = 'dead' | 'angry' | 'confused' | 'embarrassed' | 'maintenance' | 'smile' | 'thinking' | 'welcome' | 'worried'


/**
 * @interface Tipo de Icono
 */
export type Icon = {
    path: string,
    status: string,
    alt: string,
    name: string
}

/**
 * @export type Tipo Especifico para tortuga
 */
export type IconTurtle = Omit<Icon, 'status'> & {
    status: TurtleStatus
}

/**
 * @interface Pet Interfaz de mascota
 */
export type Pet = {
    name: string,
    bullet: string,
    onPath: (status: string) => string,
    onImage: (status: string) => string,
    onName: (status: string) => string,
    onObject: (status: string) => { name: string, alt: string },
}

export type TURTLE = Omit<Pet, 'onPath' | 'onImage' | 'onName' | 'onObject'> & {
    onPath: (status: TurtleStatus) => string,
    onImage: (status: TurtleStatus, style: string) => string,
    onName: (status: TurtleStatus) => string,
    onObject: (status: TurtleStatus) => { name: string, alt: string },
}


/** Fusion de base de datos */

export type WorkRecord = Work & {
    tags: Tag []
    author: Author[] | Author
}

export type Article = Post & {
  type: 'article';
  works: Work[];
  authors: Author[];
};

