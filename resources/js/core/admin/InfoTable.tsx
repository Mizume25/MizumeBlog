import { Post } from '@/types'
import { useState } from 'react'
import { router } from '@inertiajs/react';
import { confirmDelete } from '@/types/utils';
function InfoTable({ posts, getCategoria, categoriaActual }: { posts: Post[], getCategoria: (id: string) => void, categoriaActual: string }) {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        getCategoria(e.currentTarget.id);
    };

    const handleDelete = (id:number) => {
        router.delete(route('post.destroy', id));
    }


    return (
        <div className="lg:col-span-2 bg-white border border-[#EAD9B8] rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#EAD9B8] flex items-center justify-between bg-gradient-to-r from-[#C8AD7F]/10 to-transparent">
                <h3 className="text-[#3B2314]">Tabla de Posts</h3>
                <div className=" flex bg-[#F5EDD8] p-1.5 rounded-xl border border-[#EAD9B8] gap-2 shadow-inner">
                    {['Todos', 'Literatura', 'Reflexiones', 'AnimeManga'].map((cat) => {
                        // Variable para controlar el estado activo (puedes vincularla a tu useState)
                        const isActive = cat === categoriaActual;

                        return (
                            <button
                                key={cat}
                                id={cat}
                                onClick={handleClick}
                                className={`cursor-pointer
          px-5 py-2.5 
          text-[13px] font-bold rounded-lg
          transition-all duration-300 ease-out
          ${isActive
                                        ? 'bg-[#3B2314] text-[#E8D5A3] shadow-md scale-105' // Marrón chocolate (Activo)
                                        : 'text-[#8B5A2B] bg-[#EAD9B8]/40 hover:bg-[#C8AD7F]/30 hover:text-[#3B2314]' // Marrón crema (Reposos)
                                    }
          active:scale-95
        `}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#C8AD7F]/5 text-[10px] uppercase tracking-widest text-[#8B5A2B] border-b border-[#EAD9B8]">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Título</th>
                            <th className="px-5 py-3 font-semibold">Categoria</th>
                            <th className="px-5 py-3 font-semibold">Estado</th>
                            <th className="px-5 py-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAD9B8]/50">
                        {posts.map((post, i) => (
                            <tr key={i} className="hover:bg-[#C8AD7F]/5 transition-colors group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#F5EDD8] rounded flex items-center justify-center text-lg border border-[#EAD9B8]">📖</div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#3B2314]">{post.titulo}</p>
                                            <p className="text-[11px] text-gray-400 italic">{post.genero}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <p className='text-[15px]'>{post.categoria}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${post.publicado ? `text-green-700 bg-green-50 border-green-200` : `text-[#6B3F1F] bg-[#C8AD7F]/20 border-[#C8AD7F]/40`}`}>
                                        {post.publicado ? "Publicado" : "Borrador"}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex gap-2">
                                        <a href={route('post.edit', post.id)} className="text-[11px] px-2 py-1 border border-[#EAD9B8] rounded hover:border-[#A08050] transition-colors cursor-pointer">Editar</a>
                                        <button
                                            onClick={() => confirmDelete(
                                                '¿Eliminar Post?',
                                                'Esta acción borrará todos los datos permanentemente.',
                                                 () => handleDelete(post.id) 
                                            )}
                                            className="text-[11px] px-2 py-1 border border-[#EAD9B8] rounded hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer"
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InfoTable