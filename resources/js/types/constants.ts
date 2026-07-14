/**
 * Categorias a escoger
 */
export const OPTION_CATEGORY = ["literatura", "animemanga", "reflexiones"];



export interface Route {
    label: string,
    url: string
}

/**
 * Navegación de web
 */
export const WEB_ROUTE : Route [] = [
    {
        label: 'home',
        url: route('home')
    },
    {
        label:'archive',
        url: route('post.archivador')
    },
    {
        label:'profile',
        url: route('profile.edit')
    },
    {
        label:'Contacto',
        url: '#'
    }
]



/**
 * NetWorks
 */
export const NETWORKS: Route[] = [
    { label: "LinkedIn",  url: "https://www.linkedin.com/in/gabriel-nivicela-86733035a/" },
    { label: "Instagram", url: "https://www.instagram.com/_mi_zume_/" },
    { label: "GitHub",    url: "https://github.com/Mizume25" },
];

/** Secciones web */
export type Section = "todos" | "literatura" | "animemanga" | "reflexiones";

export type Section_Content =  {
    label:Section,
    active:boolean
}


export const SECTION : Section_Content [] = [
    {
        label:"todos",
        active: true
        
    },
    {
        label:"literatura",
        active: false
    },
    {
        label:"animemanga",
        active: false
    },
    {
        label:"reflexiones",
        active: false
    }
] 