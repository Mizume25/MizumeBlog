import styles from '@/../css/HomeMain.module.css';
import { formatDefault, type Post } from '@/types';
import { useEffect, useState } from 'react';

/**
 * Obtener fecha formateada
 * @param data string Fecha de publicacion
 * @returns fecha publicacion
 */
const getMounth = (data: string | undefined): string => {
    let d = new Date(data ?? '01-01-1999');

    let name: string = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(d);
    return name;
};

interface HomePanelPostProps {
    post: Post;
    left: boolean;
    selectPost: number | null;
    position: string | null;
    edit: boolean;
}

function HomePanelPost({ post, left, selectPost, edit, position }: HomePanelPostProps) {
    /** Ruta Portada */
    const ruta: string = `/IMG/Portada/${post.cover}`;

    /** Categorias Badge */
    const badges: string[] = post?.tags.split(',').map((p) => p.trim());

    /**Formato Imagenes */
    const [format, setFormat] = useState<string | null>(formatDefault.home_config ?? null);

    let date: string = getMounth(post?.publish_date);

    /**
     * Formato de Imagen
     */
    useEffect(() => {
        setFormat(post.config?.home_config ?? null);
    }, [post.id]);

    useEffect(() => {
        if (position == null) return;
        console.log(
            `[post ${post.id} | typeof ${typeof post.id}] selectPost:`,
            selectPost,
            `| typeof ${typeof selectPost}`,
            '| match:',
            post.id === selectPost,
        );
        if (post.id != selectPost) return;
        setFormat(position);
    }, [position]);

    return (
        <>
            {left ? (
                <a
                    href={route('post.show', post.id)}
                    className={`group block cursor-pointer capitalize no-underline ${selectPost === post.id ? 'border-3 border-amber-400' : ''}`}
                    data-id={post.id}
                >
                    <article
                        style={
                            {
                                '--bg-image': `url('${ruta}')`,
                                '--bg-format-y': `${format}`,
                            } as React.CSSProperties
                        }
                        className={styles.featuredPost}
                    >
                        <div className="mt-[-5px] mr-[10px] flex items-start justify-end">
                            <div className="hidden flex-wrap justify-end gap-[15px] lg:flex">
                                {/* Iteramos tags*/}
                                {badges.map((p, index) => (
                                    <span
                                        className="rounded-[20px] bg-[rgba(255,255,255,0.9)] px-[15px] py-[8px] text-[0.9rem] font-bold text-[#333] shadow-sm"
                                        key={index}
                                    >
                                        {p}
                                    </span>
                                ))}

                                <span className="rounded-[20px] bg-[rgba(255,255,255,0.9)] px-[15px] py-[8px] text-[0.9rem] font-bold text-[#333] shadow-sm">
                                    {`Lectura de ${date}`}
                                </span>
                            </div>
                        </div>

                        <div className="relative mt-auto mb-0 w-full self-start">
                            <h2 className="ml-[20px] text-[1.1rem] font-bold text-white [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] sm:text-[1.5rem] md:text-[2.1rem] lg:text-[2.2rem]">
                                {post.title.replaceAll('-', ' ')}
                            </h2>

                            <span className="font-blood absolute right-0 bottom-[55px] mr-[20px] hidden text-right text-white italic [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)] lg:block">
                                {post.web_title.replaceAll('-', ' ')}
                            </span>
                        </div>
                    </article>
                </a>
            ) : (
                <a
                    href={route('post.show', post.id)}
                    className={`group block cursor-pointer capitalize no-underline ${selectPost === post.id ? 'border-3 border-amber-400' : ''}`}
                    data-id={post.id}
                >
                    <article
                        style={
                            {
                                '--bg-image': `url('${ruta}')`,
                                '--bg-format-y': `${format}`,
                            } as React.CSSProperties
                        }
                        className={styles.featuredPost}
                    >
                        <div className="mt-[-5px] ml-[10px] flex items-start justify-start">
                            <div className="hidden flex-wrap justify-start gap-[15px] lg:flex">
                                {/* Iteramos tags*/}
                                {badges?.map((p, index) => (
                                    <span
                                        className="over:bg-[#4a4a4a] rounded-[20px] bg-[rgba(255,255,255,0.9)] px-[15px] py-[8px] text-[0.9rem] font-bold text-[#333] shadow-sm"
                                        key={index}
                                    >
                                        {p}
                                    </span>
                                ))}

                                <span className="rounded-[20px] bg-[rgba(255,255,255,0.9)] px-[15px] py-[8px] text-[0.9rem] font-bold text-[#333] shadow-sm">
                                    {`Lectura de ${date}`}
                                </span>
                            </div>
                        </div>

                        <div className="relative mt-auto mb-0 w-full self-end text-right">
                            <h2 className="ml-[20px] text-[1.1rem] font-bold text-white [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] sm:text-[1.5rem] md:text-[2.1rem] lg:text-[2.2rem]">
                                {post.title}
                            </h2>

                            <span className="absolute bottom-[30px] left-0 ml-[20px] hidden text-left font-light text-white italic [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)] lg:block">
                                {post.web_title}
                            </span>
                        </div>
                    </article>
                </a>
            )}
        </>
    );
}

export default HomePanelPost;
