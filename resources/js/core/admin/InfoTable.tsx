import { router } from '@inertiajs/react';
import { confirmDelete, SECTION, Section, Section_Content, type Post } from '@/types';
import Switch from "react-switch";
import { useState } from 'react';
import { Eye, PaintRoller } from 'lucide-react';

interface InfoTableProps {
    posts: Post[];
    onSection: (id: Section) => void;
    section: Section_Content;
    onID: (id: number) => void
}

function InfoTable({ posts, onSection, section , onID}: InfoTableProps) {

    const [publish , setPublish ]  = useState(false);

    const handleDelete = (id: number, title: string) => {
        confirmDelete(
            '¿Eliminar Post?',
            `Esta acción borrará "${title}" permanentemente.`,
            () => router.delete(route('post.destroy', id))
        );
    };


  

    return (
        <div className="lg:col-span-2 bg-white border border-[#EAD9B8] rounded-xl overflow-hidden shadow-sm">

            {/* Header: título + filtro (botones en desktop, select en mobile) */}
            <div className="px-4 py-3 lg:px-5 lg:py-4 border-b border-[#EAD9B8] flex items-center justify-between gap-3 bg-gradient-to-r from-[#C8AD7F]/10 to-transparent">
                <h3 className="text-[#3B2314] text-sm lg:text-base font-semibold shrink-0 hidden lg:block">
                    Tabla de Posts
                </h3>

                {/* Filtro desktop: grupo de botones */}
                <div className="hidden lg:flex bg-[#F5EDD8] p-1.5 rounded-xl border border-[#EAD9B8] gap-2 shadow-inner ">
                    {SECTION.map((s) => {
                        const isActive = s.label === section.label;
                        return (
                            <button
                                key={s.label}
                                id={s.label}
                                onClick={() => onSection(s.label)}
                                className={`cursor-pointer px-5 py-2.5 text-[13px] font-bold rounded-lg capitalize
                                    transition-all duration-300 ease-out active:scale-95
                                    ${isActive
                                        ? 'bg-[#3B2314] text-[#E8D5A3] shadow-md scale-105'
                                        : 'text-[#8B5A2B] bg-[#EAD9B8]/40 hover:bg-[#C8AD7F]/30 hover:text-[#3B2314]'
                                    }`}
                            >
                                {s.label}
                            </button>
                        );
                    })}
                </div>

                {/* Filtro mobile: select */}
                <select
                    value={section.label}
                    onChange={(e) => onSection(e.target.value as Section)}
                    aria-label="Filtrar por categoría"
                    className="
                        lg:hidden
                        capitalize
                        appearance-none
                        bg-[#F5EDD8] border border-[#EAD9B8]
                        text-[#3B2314] text-[13px] font-semibold
                        px-3 py-2 pr-8 rounded-lg
                        shadow-inner
                        focus:outline-none focus:ring-2 focus:ring-[#C8AD7F] focus:border-[#A08050]
                        transition-all duration-200
                        cursor-pointer
                        w-full max-w-[160px]
                        bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%238B5A2B%22><path fill-rule=%22evenodd%22 d=%22M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.755a.75.75 0 111.08 1.04l-4.25 4.3a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z%22 clip-rule=%22evenodd%22/></svg>')]
                        bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem]
                    "
                >
                    {SECTION.map((s) => (
                        <option key={s.label} value={s.label} className='capitalize'>{s.label}</option>
                    ))}
                </select>


                <Switch
                    lang='es'
                    onColor='#059400'
                    offColor='#454545'
                    checked={publish}
                    onChange={(e) => setPublish(prev => !prev)}
                    checkedIcon={false}
                    uncheckedIcon={false}
                />
            </div>

            {/* Vista desktop: tabla */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#C8AD7F]/5 text-[10px] uppercase tracking-widest text-[#8B5A2B] border-b border-[#EAD9B8]">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Título</th>
                            <th className="px-5 py-3 font-semibold">Categoria</th>
                            <th className="px-5 py-3 font-semibold">Estado</th>
                            <th className="px-5 py-3 font-semibold">Colores</th>
                            <th className="px-5 py-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAD9B8]/50">
                        {posts.map((post, i) => (
                            <tr key={i} className={`hover:bg-[#C8AD7F]/5 capitalize transition-colors group 
                     
                            ${(section.label === post.category || section.label === 'todos' ) && 
                                (publish ? post.publish_date != null : (post.publish_date != null || post.publish_date == null) ) ? '' : 'hidden'}`}>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#F5EDD8] rounded flex items-center justify-center text-lg border border-[#EAD9B8]">📖</div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#3B2314]">{post.title.replaceAll('-', ' ')}</p>
                                            <p className="text-[11px] text-gray-400 italic">{post.tags}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <p className='text-[15px]'>{post.category}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${post.publish_date ? `text-green-700 bg-green-50 border-green-200` : `text-[#6B3F1F] bg-[#C8AD7F]/20 border-[#C8AD7F]/40`}`}>
                                        {post.publish_date ? "Publicado" : "Borrador"}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onID(post.id)}
                                            className="text-[11px] px-2 py-1 border border-[#EAD9B8] rounded hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer"
                                        >
                                            <PaintRoller size={20} />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex gap-2">
                                         <a href={route('post.show', post.id)} className="text-[11px] px-2 py-1 border border-[#EAD9B8] rounded hover:border-[#A08050] transition-colors cursor-pointer"><Eye  size={16}/></a>
                                        <a href={route('post.edit', post.id)} className="text-[11px] px-2 py-1 border border-[#EAD9B8] rounded hover:border-[#A08050] transition-colors cursor-pointer">Editar</a>
                                        <button
                                            onClick={() => handleDelete(post.id, post.title)}
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

            {/* Vista mobile: lista de tarjetas */}
            <div className="lg:hidden divide-y divide-[#EAD9B8]/50">
                {posts.map((post, i) => (
                    <div key={i} className={`capitalize flex items-center gap-3 px-4 py-3 hover:bg-[#C8AD7F]/5 transition-colors 
                    
                     ${(section.label === post.category || section.label === 'todos' ) && 
                                (publish ? post.publish_date != null : (post.publish_date != null || post.publish_date == null) ) ? '' : 'hidden'}
                    `}>
                        <div className="w-8 h-8 shrink-0 bg-[#F5EDD8] rounded flex items-center justify-center text-base border border-[#EAD9B8]">📖</div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#3B2314] truncate">{post.title}</p>
                            <p className="text-[10px] text-gray-400 italic truncate">{post.tags} · {post.category}</p>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border whitespace-nowrap shrink-0 ${post.publish_date
                            ? 'text-green-700 bg-green-50 border-green-200'
                            : 'text-[#6B3F1F] bg-[#C8AD7F]/20 border-[#C8AD7F]/40'
                            }`}>
                            {post.publish_date ? 'Publicado' : 'Borrador'}
                        </span>

                        <div className="flex gap-1 shrink-0">
                            <a
                                href={route('post.edit', post.id)}
                                aria-label={`Editar ${post.title}`}
                                className="text-[11px] px-2 py-1.5 border border-[#EAD9B8] rounded-md hover:border-[#A08050] hover:bg-[#F5EDD8] transition-colors touch-manipulation"
                            >
                                ✎
                            </a>
                            <button
                                onClick={() => handleDelete(post.id, post.title)}
                                aria-label={`Borrar ${post.title}`}
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

export default InfoTable