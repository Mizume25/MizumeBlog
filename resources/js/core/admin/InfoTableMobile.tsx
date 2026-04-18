import { Post } from '@/types'
import { router } from '@inertiajs/react';
function InfoTableMobile({ posts, getCategoria, categoriaActual }: { posts: Post[], getCategoria: (id: string) => void, categoriaActual: string }) {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        getCategoria(e.currentTarget.value);
    };



    return (
        <div className="lg:col-span-2 bg-white border border-[#EAD9B8] rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#EAD9B8] flex items-center justify-between gap-3 bg-gradient-to-r from-[#C8AD7F]/10 to-transparent">
                <h3 className="text-[#3B2314] text-sm font-semibold shrink-0">Posts recientes</h3>

                {/* Select — reemplaza los botones del nav */}
                <select
                    value={categoriaActual}
                    onChange={handleChange}
                    className="
                        appearance-none
                        bg-[#F5EDD8] border border-[#EAD9B8]
                        text-[#3B2314] text-[13px] font-semibold
                        px-3 py-2 pr-8 rounded-lg
                        shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-[#C8AD7F] focus:border-[#A08050]
                        transition-all duration-200
                        cursor-pointer
                        w-full max-w-[160px]
                        /* Flecha custom */
                        bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%238B5A2B%22><path fill-rule=%22evenodd%22 d=%22M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.755a.75.75 0 111.08 1.04l-4.25 4.3a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z%22 clip-rule=%22evenodd%22/></svg>')]
                        bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem]
                    "
                    aria-label="Filtrar por categoría"
                >
                    {['Todos', 'Literatura', 'Reflexiones', 'AnimeManga'].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Tabla — scroll horizontal en móvil */}
            {/* Reemplaza el div overflow-x-auto + table entero por esto */}
            <div className="divide-y divide-[#EAD9B8]/50">
                {posts.map((post, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-[#C8AD7F]/5 transition-colors">

                        {/* Icono */}
                        <div className="w-8 h-8 shrink-0 bg-[#F5EDD8] rounded flex items-center justify-center text-base border border-[#EAD9B8]">📖</div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#3B2314] truncate">{post.titulo}</p>
                            <p className="text-[10px] text-gray-400 italic truncate">{post.genero} · {post.categoria}</p>
                        </div>

                        {/* Badge estado */}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border whitespace-nowrap shrink-0 ${post.publicado
                            ? 'text-green-700 bg-green-50 border-green-200'
                            : 'text-[#6B3F1F] bg-[#C8AD7F]/20 border-[#C8AD7F]/40'
                            }`}>
                            {post.publicado ? 'Publicado' : 'Borrador'}
                        </span>

                        {/* Menú acciones */}
                        <div className="flex gap-1 shrink-0">
                            <a href={route('post.edit', post.id)} aria-label={`Editar ${post.titulo}`}
                                className="text-[11px] px-2 py-1.5 border border-[#EAD9B8] rounded-md hover:border-[#A08050] hover:bg-[#F5EDD8] transition-colors touch-manipulation">
                                ✎
                            </a>
                            <button
                                onClick={() => router.delete(route('post.destroy', post.id))}
                                aria-label={`Borrar ${post.titulo}`}
                                className="text-[11px] px-2 py-1.5 border border-[#EAD9B8] rounded-md hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-colors touch-manipulation"
                            >
                                ✕
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default InfoTableMobile