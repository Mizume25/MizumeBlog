/**
 * Rutas estaticas
 */
export const ROUTE = {
    main: route('main'),
    community: route("community"),
    work:{
        index: route('works.index')
    },
    post:{
        index: route('posts.index')
    },
    authors:{
        index: route('authors.index')
    }
}