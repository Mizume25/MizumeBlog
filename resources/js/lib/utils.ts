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


