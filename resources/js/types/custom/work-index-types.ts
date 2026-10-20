

export type NAV_VALUES_TYPE = 'todos' | 'literatura' | 'animemanga' | 'all' | 'literature'

export type LITERATURA = Omit<SELECT_VALUES_TYPE, "novela_ligera" | "anime" | "manga" | "pelicula" | "light_novel" | "manga" | "movie">

export type ANIMEMANGA = Omit<SELECT_VALUES_TYPE, "libro" | "poema" | "novela" | "book" | "poem" | "novel">

export type SELECT_VALUES_TYPE =
    "libro" | "poema" | "novela_ligera" | "novela" | "anime" | "manga" | "pelicula" | "todos" |
    "book" | "poem" | "light_novel" | "novel" | "manga" | "movie" | "all"


