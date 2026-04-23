import { type Post } from "@/types"
import React from "react";

interface Seccion {
    nombre: string;
    ruta: string;
}

export const netWork: Seccion[] = [
    { nombre: "LinkedIn",  ruta: "https://www.linkedin.com/in/gabriel-nivicela-86733035a/" },
    { nombre: "Instagram", ruta: "https://www.instagram.com/_mi_zume_/" },
    { nombre: "GitHub",    ruta: "https://github.com/Mizume25" },
];

function HomeSideBarRight({ sidebarPosts }: { sidebarPosts: Post[] | undefined }) {
    return (
        <aside className="hidden lg:block bg-[rgb(45,29,13)] p-[35px] rounded-[5px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] sticky top-6">

            <section className="mb-[30px]">
                <h3 className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                    Post Destacados
                </h3>
                <ul className="pl-0">
                    {sidebarPosts?.map((post, index) => (
                        <li
                            key={post.id ?? index}
                            className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]"
                        >
                            <a href={route('post.show', post.id)} className="text-white no-underline block">
                                {post.titulo}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h3 className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                    Sígueme
                </h3>
                <div className="flex flex-wrap gap-[10px]">
                    {netWork.map((red) => (
                        <a
                            key={red.nombre}
                            href={red.ruta}
                            className="inline-block py-[8px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] transition-colors duration-300 hover:bg-[rgb(129,106,84)] no-underline"
                        >
                            🐢 {red.nombre}
                        </a>
                    ))}
                </div>
            </section>

        </aside>
    );
}

export default React.memo(HomeSideBarRight);