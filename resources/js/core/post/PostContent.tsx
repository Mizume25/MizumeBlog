import { Post, SharedData } from '@/types';
import { Button } from '@headlessui/react';
import { router, usePage } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import Switch from 'react-switch';
import MarkdownRenderer from './MarkdownRenderer';
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
                <h3 className="title text-3xl font-bold text-white capitalize md:text-4xl">{web_title.replaceAll('-', ' ')}</h3>
            </div>
            <p className="text-sm text-[#A18B75] italic underline">Publicado el {newDate}</p>
        </header>
    );
}

function PostTag({ tags }: { tags: string[] }) {
    return (
        //Mapeamos tags
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-sm:p-3 bg-[#2A1B12] px-3 py-5 capitalize ">
            {tags.map((p, i) => (
                <span
                    key={i}
                    className="flex items-center justify-center rounded-[20px] bg-[#d9d9d9] px-3 py-1.5 text-sm font-bold whitespace-nowrap text-black shadow-sm sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 lg:text-lg"
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
    raw: string;
    selectedId: string;
    handlerCick: () => void;
}

function PostContent({ post, contenido, selectedId, handlerCick, raw }: PostContentProps) {


    const [content, setContent] = useState<string>(raw);

    const [edit, setEdit] = useState<boolean>(false);

    const badge: string[] = post.tags.split(',').map((p) => p.trim());
    const { auth } = usePage<SharedData>().props;

    const handleSaveContent = async () => {
        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('title', post.title);
        formData.append('category', post.category);
        formData.append('author', post.author);
        const tagsArray = post.tags.split(',').map((tag) => tag.trim());
        tagsArray.forEach((tag, i) => formData.append(`tags[${i}]`, tag));

        const blob = new Blob([content], { type: 'text/markdown' });
        formData.append('content', blob, 'content.md');

        router.post(route('post.update', post.id), formData, {
            onSuccess: () => {
                alert('Contenido actualizado');
            },
            onError: (errors) => {
                console.error('Errores de validación:', errors);
                alert('No se pudo actualizar: revisa la consola');
            },
        });
    };

    return (
        /* Contenido Main*/
        <article className="overflow-hidden rounded-lg border border-white/10 bg-[#2A1B12]/95 p-4 shadow-2xl lg:col-span-6">
            {auth?.user?.role === 'admin' ? (
                <div className="px-8 flex h-20 w-full flex-row items-center justify-between gap-4 lg:flex-row">
                    <div className="mb-4 flex flex-row items-center gap-1 text-white">
                        <Switch checked={edit} onChange={setEdit} onColor="#a79101" offColor="#454545" checkedIcon={false} uncheckedIcon={false} />
                    </div>

                    <Button
                        className="bg-btn-primary text-btn-primary-foreground btn-hover-scale text-md ms-4 mb-4 h-12 w-50 rounded-2xl p-4"
                        onClick={handlerCick}
                    >
                        Gestor de Imagenes
                    </Button>

                    
                </div>
            ) : (
                <></>
            )}
            {/** Titulo Header */}
            <PostTitle publish_date={post.publish_date} web_title={post.web_title} author={post.author} />

            {/* Contenedor de Tags*/}
            <PostTag tags={badge} />
            
            <div className="h-12 w-full lg:hidden"></div>
            {/** Renderizado de contenido */}

            {edit ? (
                <MDEditor value={content} onChange={(val) => setContent(val ?? '')} data-color-mode="dark" height="auto" preview="edit" />
            ) : (
                <MarkdownRenderer content={contenido} className="mb-12" selectedId={selectedId} />
            )}

            {edit ? (
                <button
                    onClick={handleSaveContent}
                    className="mt-4 rounded-xl bg-green-400 px-4 py-2 font-bold text-white transition-transform duration-150 hover:scale-105"
                >
                    Guardar cambios
                </button>
            ) : (
                <></>
            )}
        </article>
    );
}

export default PostContent;
