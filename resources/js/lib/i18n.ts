const es = {
    pagination: { prev: 'Anterior', next: 'Siguiente', page: 'Página' },
    widget: { work: 'Obra', posts: 'Publicación', authors: 'Autor' },
}

// Tipado contra `es`: si falta o sobra una clave en `en`, falla al compilar
const en: typeof es = {
    pagination: { prev: 'Previous', next: 'Next', page: 'Page' },
    widget: { work: 'Work', posts: 'Post', authors: 'Author' },
}

export const TEXT = { es, en }
export type Lang = keyof typeof TEXT