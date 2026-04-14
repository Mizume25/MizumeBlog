import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Post } from '@/types';
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

//FUNCION : Filtrar varios POST especificos
export const getPosts = (id:number[], posts: Post[]) : Post[]=> {
    //Declaramos un array con espacios
    const list: Post[] = new Array(id.length).fill({} as Post);

    //Haremos una iteracion
    for(let i = 0; i < list.length ; i++){
        list[i] = posts.find((p) => p.id == id[i])!; 
    }

    //Retornamos valor
    return list;
} 

//FUNCION : Filtrar 1 POST especifico
export const getPost = (id:number, posts: Post[]) : Post => {
    //Declaramos un array con espacios
    return posts.find((p) => p.id == id)!; 
} 

//FUNCION: Obtener numero random
export const getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
};


// FUNCION: Obtener post random 
export const getRandomPost = (max: number, posts: Post[]): Post[] | undefined => { 

    const webPosts = new Set<Post>();
    try {

        if(max < 0 || max > posts.length) throw new Error("El numero maximo no es valido");
        if(posts == null) throw new Error("El array de Post es nulo");

        const limit = Math.min(max, posts.length); 
            while (webPosts.size < limit) {
                const id = getRandomInt(0, posts.length - 1);
                webPosts.add(posts[id]); 
            }

        const featured: Post[] = Array.from(webPosts);

        return featured;

    } catch (e) {
        console.log(e);
    }
};
