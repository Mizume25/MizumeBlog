import { BackgroundPositionKeywordCard, Post, Section_Content } from '@/types';
import { useEffect, useState } from 'react';

export interface LibraryCardProps {
    post: Post;
    section?: Section_Content;
    edit: boolean;
    onID: (id: number) => void;
    position: BackgroundPositionKeywordCard | null;
    selectPost: Post;
}

function LibraryCard({ post, section, edit, onID, position, selectPost }: LibraryCardProps) {
    /** Tags  */
    const tags = post.tags.split(',').map((g) => g.trim()) ?? [];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (edit) {
            e.preventDefault();
            onID(post.id);
        }
    };

    const [format, SetFormat] = useState<BackgroundPositionKeywordCard | null>(null);

    useEffect(() => {
        if (selectPost.id !== post.id) return;
        SetFormat(position ?? (selectPost.config?.card as BackgroundPositionKeywordCard));
    }, [selectPost, position]);

    return (
        <a
            href={route('post.show', post.id)}
            onClick={handleClick}
            className={`group relative focus:outline-none ${section?.label === post.category || section?.label === 'todos' ? 'block' : 'hidden'}`}
        >
            <div className="flex h-[280px] w-full flex-col overflow-hidden rounded-[25px] border-[2px] border-black bg-[#d2a264] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 group-hover:z-10 group-hover:scale-[1.02]">
                {/* Header - Color café ocre de la imagen */}
                <header className="flex h-[46px] shrink-0 items-center justify-between border-b-[2px] border-black bg-[#c59454] px-4 text-black">
                    <h2 className="truncate pr-2 text-sm font-bold tracking-tight uppercase">{post.title.replaceAll('-', ' ')}</h2>
                    <div className="flex shrink-0 gap-1">
                        {tags.slice(0, 1).map((g) => (
                            <span key={g} className="rounded-full bg-[#8c6c44] px-3 py-1 text-[0.6rem] font-bold text-white uppercase shadow-sm">
                                {g}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Body */}
                <main className="flex h-full flex-row overflow-hidden">
                    {/* Sección de Imagen (Mantiene estructura original según tu pedido) */}
                    <section className="w-[35%] shrink-0 overflow-hidden border-r-[2px] border-black/20 bg-[#e5e5e5] sm:w-[30%]">
                        {post.cover_card ? (
                            <img
                                src={`/IMG/Cards/${post.cover_card}`}
                                alt={`Portada de ${post.title}`}
                                className="h-full w-full object-cover object-center"
                                style={{ objectPosition: format ?? post.config?.card ?? 'center' }}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl opacity-30">📖</div>
                        )}
                    </section>

                    {/* Texto - Color beige/arena de la imagen */}
                    <section className="flex-1 overflow-y-auto bg-[#d2b48c] p-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20">
                        <p className="mb-1 text-[0.6rem] font-medium tracking-widest text-black/60 uppercase">
                            {post.author} · {post.publish_date}
                        </p>
                        <h3 className="mb-2 text-base leading-tight font-extrabold text-black capitalize">{post.web_title.replaceAll('-', ' ')}</h3>
                        <p className="text-xs leading-relaxed font-medium text-black/90">{post.description}</p>
                    </section>
                </main>
            </div>
        </a>
    );
}

export default LibraryCard;
