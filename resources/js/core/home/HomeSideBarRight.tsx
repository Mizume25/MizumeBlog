import { type Post } from "@/types"
import React from "react";
import { Seccion } from "./HomeSidebarMobile";

//Creamos un objeto
export const netWork  : Seccion [] = [
    {nombre: "LinkedIn", ruta:"https://www.linkedin.com/in/gabriel-nivicela-86733035a/"},
    {nombre: "Instagram", ruta:"https://www.instagram.com/_mi_zume_/"},
    {nombre: "GitHub", ruta:"https://github.com/Mizume25"}
    
]


//Home Side Bar Right
function HomeSideBarRight({ sidebarPosts }: { sidebarPosts: Post[] | undefined }) {
    
    //FUNCION QUE RENDERIZA POST
    const renderPost = (sidebarPosts: Post[] | undefined) => {

        return sidebarPosts?.map((post, index) => {
            return (
                <li
                    key={post.id || index} 
                    className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]"
                >
                    <a href={route('post.show', post?.id)} className="text-white no-underline block">
                        {post.titulo}
                    </a>
                </li>
            );
        });

    }


    return (
        <aside className="bg-[rgb(45,29,13)] p-[35px] rounded-[5px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] 
    /* --- MÓVIL (Estado inicial: Lejos a la derecha) --- */
    fixed inset-y-0 right-0 z-40 w-72 
    transform translate-x-full lg:transform-none duration-200 ease-out
    
    /* --- DESKTOP (Estado fijo en el grid) --- */
    lg:static lg:translate-x-0 lg:w-full lg:block lg:sticky lg:top-6 lg:z-auto">

            <section className="mb-[30px]">
                <h3
                    className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                    Post Destacados
                </h3>
                <ul className="pl-0 text-center" id="list-right">
                    {renderPost(sidebarPosts)}
            
                </ul>
            </section>

            <section>
                <h3
                    className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                    Sígueme
                </h3>
                <section className="flex flex-wrap gap-[10px]">

                    {netWork.map((p , i)=> (
                        <a key={i} 
                        href={p.ruta}
                        className="inline-block py-[8px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] transition-colors duration-300 hover:bg-[rgb(129,106,84)] no-underline">
                        🐢 {p.nombre}
                    </a>
                    ))}
                    
                </section>
            </section>
        </aside>
    )
}

export default React.memo(HomeSideBarRight);