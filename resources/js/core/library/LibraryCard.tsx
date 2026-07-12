import { LibraryCardProps } from '@/pages/post/library';
import { Post } from '@/types'
import { Section_Content } from '@/types/constants';



function LibraryCard({ post , section} : LibraryCardProps) {

    /** Tags  */
    const tags = post.tags.split(',').map(g => g.trim()) ?? [];

    return (
        <a
            href={route('post.show', post.id)}
            className={`group relative  focus:outline-none ${ section.label === post.category || section.label === 'todos' ? 'block' : 'hidden' }`}
            
        >
            <div className="
                flex flex-col h-[280px] w-full
                bg-[#d2a264] border-[2px] border-black
                rounded-[25px] overflow-hidden
                transition-transform duration-200
                group-hover:scale-[1.02] group-hover:z-10
                shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            ">
                {/* Header - Color café ocre de la imagen */}
                <header className="
                    h-[46px] bg-[#c59454] border-b-[2px] border-black
                    flex items-center justify-between px-4 shrink-0 text-black
                ">
                    <h2 className="text-sm font-bold truncate pr-2 uppercase tracking-tight">
                        {post.title}
                    </h2>
                    <div className="flex gap-1 shrink-0">
                        {tags.slice(0, 1).map(g => (
                            <span
                                key={g}
                                className="px-3 py-1 bg-[#8c6c44] text-white rounded-full text-[0.6rem] font-bold uppercase shadow-sm"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Body */}
                <main className="flex flex-row h-full overflow-hidden">

                    {/* Sección de Imagen (Mantiene estructura original según tu pedido) */}
                    <section className="w-[35%] sm:w-[30%] shrink-0 bg-[#e5e5e5] border-r-[2px] border-black/20 overflow-hidden">
                        {post.cover_card ? (
                            <img
                                src={`/IMG/Cards/${post.cover_card}`}
                                alt={`Portada de ${post.title}`}
                                className="w-full h-full object-cover object-center "
                                style={{ objectPosition: `${post.config?.card_config}` }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                                📖
                            </div>
                        )}
                    </section>

                    {/* Texto - Color beige/arena de la imagen */}
                    <section className="
                        flex-1 p-4 bg-[#d2b48c]
                        overflow-y-auto
                        [&::-webkit-scrollbar]:w-[4px]
                        [&::-webkit-scrollbar-thumb]:bg-black/20
                        [&::-webkit-scrollbar-thumb]:rounded-full
                    ">
                        <p className=" text-[0.6rem] uppercase tracking-widest text-black/60 mb-1 font-medium">
                            {post.author} · {post.publish_date}
                        </p>
                        <h3 className="capitalize text-base font-extrabold mb-2 text-black leading-tight">
                            {post.web_title || post.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-black/90 font-medium">
                            {post.description}
                        </p>
                    </section>
                </main>
            </div>
        </a>
    )
}

export default LibraryCard