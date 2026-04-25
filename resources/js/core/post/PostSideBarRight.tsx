

import { getName } from "@/types/utils"
import PostProfile from "./PostProfile"
import { useEffect, useState } from "react";
import { Rutas } from "@/types/utils";
import HomeProfile from "../home/HomeProfile";
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
//Indice de contenido
function PostSideBarRight({ id }: { id: number }) {
    const MAX = 3;
    const [posts, setPosts] = useState<Rutas[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { auth } = usePage<SharedData>().props;
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
            <div className="bg-[#2A1B12] p-8 rounded-xl border border-white/10 shadow-xl text-center">
             <a href={route('profile.edit')}>
                {auth?.user?.google_id ? (

                    <img
                        src={auth.user.avatar}
                        alt="Perfil"
                        className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover"
                    />

                ) : auth?.user ? (

                    <HomeProfile name={auth.user.name} />

                ) : (

                    <img
                        src="/IMG/Foto-Perfil.jpg"
                        alt="Perfil"
                        className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover"
                    />
                )}
                </a>

                {auth?.user ? (
                    <p className="text-white mt-2">Hola {auth.user.name}</p>
                ) : (
                    <p className="text-white mt-2">Espero que te guste el post</p>
                )}

                <PostProfile />
            </div>

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