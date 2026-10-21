


export type NAV_VALUES_TYPE = 'todos' | 'literatura' | 'animemanga'

export type MEDIUM_VALUES_TYPE =
    "todos" | "libro" | "poema" | "novela_ligera" | "novela" | "anime" | "manga" | "pelicula"

export type LITERATURA = Exclude<MEDIUM_VALUES_TYPE, "novela_ligera" | "anime" | "manga" | "pelicula">

export type ANIMEMANGA = Exclude<MEDIUM_VALUES_TYPE, "libro" | "poema" | "novela">
