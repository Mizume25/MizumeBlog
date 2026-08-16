import { Post } from '@/types';
import { Button } from '@headlessui/react';
import MarkdownRenderer from './MarkdownRenderer';

import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

/**
 * Formatear Fecha
 * @param data
 * @returns
 */
const formatDate = (data: string | undefined) => {
    if (!data) return;
    // 1. Creamos el objeto fecha (asegurándote de que el string sea YYYY-MM-DD)
    const fecha = new Date(data);

    // 2. Usamos el formateador de Intl
    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(fecha);
};

/**
 * Titulo de Post
 * @param param0
 * @returns
 */

type PostTitleProps = Pick<Post, 'publish_date' | 'web_title' | 'author'>;

function PostTitle({ publish_date, web_title, author }: PostTitleProps) {
    let newDate: string | undefined = formatDate(publish_date);
    return (
        <header className="px-8 text-center">
            <div className="relative mb-6 rounded-xl bg-[#C8AD7F] px-6 py-8 shadow-lg">
                <h3 className="title text-3xl font-bold text-white capitalize md:text-4xl">{web_title || `Lectura de ${author}`}</h3>
            </div>
            <p className="text-sm text-[#A18B75] italic underline">Publicado el {newDate}</p>
        </header>
    );
}

function PostTag({ tags }: { tags: string[] }) {
    return (
        //Mapeamos tags
        <div className="flex justify-center gap-2 bg-[#2A1B12] px-3 py-5 capitalize sm:gap-3 sm:px-6 sm:py-6">
            {tags.map((p, i) => (
                <span
                    key={i}
                    className="rounded-[20px] bg-[#d9d9d9] px-3 py-1.5 text-sm font-bold whitespace-nowrap text-black shadow-sm sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 lg:text-lg"
                >
                    {p}
                </span>
            ))}
        </div>
    );
}

interface PostContentProps {
    post: Post;
    contenido: string;
    selectedId: string;
    handlerCick: () => void;
}

function PostContent({ post, contenido, selectedId, handlerCick }: PostContentProps) {
    const badge: string[] = post.tags.split(',').map((p) => p.trim());
    const { auth } = usePage<SharedData>().props;
    return (
        /* Contenido Main*/
        <article className="overflow-hidden rounded-lg border border-white/10 bg-[#2A1B12]/95 p-4 shadow-2xl lg:col-span-6">
            {/** Titulo Header */}
            <PostTitle publish_date={post.publish_date} web_title={post.web_title} author={post.author} />

            {/* Contenedor de Tags*/}
            <PostTag tags={badge} />
            {auth.user.role === 'admin' ? (
                <Button className="text-md ms-4 h-15 w-60 cursor-pointer rounded-2xl bg-amber-200 p-4" onClick={handlerCick}>
                    Gestor de Imagenes
                </Button>
            ) : (
                <></>
            )}

            {/** Renderizado de contenido */}
            <MarkdownRenderer content={contenido} className="mb-12" selectedId={selectedId} />
        </article>
    );
}

export default PostContent;
