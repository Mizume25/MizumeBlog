

import { getName } from "@/types/utils"
import PostProfile from "./PostProfile"
import { useEffect, useState } from "react";
import { Rutas } from "@/types/utils";



//Indice de contenido
function PostSideBarRight({ id }: { id: number }) {
    const MAX = 3;
    const [posts, setPosts] = useState<Rutas[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // 2. Definimos una función interna asíncrona
        const fetchPosts = async () => {
            setLoading(true);
            const data = await getName(MAX, id);
            setPosts(data);
            setLoading(false);
        };

        fetchPosts();
    }, [MAX, id]); // 3. Se vuelve a ejecutar si cambian los parámetros

    console.log(posts)
    return (
        <aside className="lg:col-span-3 space-y-6 lg:sticky top-6 h-fit">

            <PostProfile />

            {/* POSTS DESTACADOS */}
            <div className="bg-[#EDEDED] p-6 rounded-xl shadow-lg">

                <h4 className="text-[#2A1B12] text-lg font-semibold mb-5">
                    Artículos / Post Destacados
                </h4>

                <ul className="space-y-0">
                    {posts.map((p, index) => (
                        <li key={p.id} className="group">
                            <a href={route('post.show', p.id)} className="block py-3 outline-none">
                                {/* Texto más pequeño (text-base) y menos margen */}
                                <span className="text-[#34495E] text-base font-bold tracking-tight group-hover:text-[#1A2D42] transition-colors block text-center">
                                    {p.titulo}
                                </span>

                                {/* Separador más sutil y cercano al texto */}
                                <div className="relative mt-3">
                                    <div className="h-[0.5px] bg-gray-200 w-1/2 mx-auto" />
                                    {/* Línea de acento en hover */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] bg-[#C8AD7F] w-0 group-hover:w-1/4 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

        </aside>
    )
}

export default PostSideBarRight