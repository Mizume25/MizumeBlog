import { BackgroundOptions, BackgroundPositionKeyword, type Post } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { HomeContent } from '../core/home';

/** @imports Layouts Reciclables */
import SideBarRight from '@/core/auth/SideBarRight';
import BlogLayout from '@/layouts/app/blog-layout';

export default function Dashboard({ posts }: { posts: Post[] }) {
    /***
     * Conteido Destacado
     * Dividmos el contendo 3
     */
    const { mainPosts, sidebarPosts } = useMemo(() => {
        return {
            mainPosts: posts.slice(0, 3),
            sidebarPosts: posts.slice(3),
        };
    }, [posts]);

    const [edit, setEdit] = useState(false);

    const handlerEdit = () => {
        const newEdit = !edit;

        setEdit(newEdit);

        if (newEdit) {
            setSelectPost(mainPosts[0].id);
        } else {
            setSelectPost(null);
        }
    };

    const [position, setPosition] = useState<BackgroundPositionKeyword | null>(null);

    const [selectPost, setSelectPost] = useState<number | null>(null);

    return (
        <BlogLayout edit={edit} onEdit={handlerEdit}>
            {/* Head de el Home*/}
            <Head title="Home"></Head>

            <main className="container mx-auto grid max-w-[1500px] grid-cols-1 items-start gap-8 p-4 md:p-8 lg:grid-cols-[2fr_1fr]">
                <HomeContent mainPosts={mainPosts} className="order-2 lg:order-1" selectPost={selectPost} position={position} edit={edit} />

                <SideBarRight posts={sidebarPosts} showFollow sticky="lg:top-6" className="order-1 lg:order-2" />
            </main>

            {edit && (
                <div className="animate-fade-in fixed right-8 bottom-8 z-[9999]">
                    <div className="w-80 max-w-md scale-100 transform rounded-xl bg-white p-6 shadow-2xl transition-all dark:bg-gray-800">
                        <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Panel de Edición</h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Configura las opciones del layout aquí.</p>

                        <select 
                        className="text- mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 capitalize outline-none focus:bg-amber-200"
                        onChange={(e) => setSelectPost(Number(e.target.value))}
                        >
                            {mainPosts.map((p, i) => (
                                <option key={p.id} value={p.id} className="bg-white text-black">
                                    {p.title}
                                </option>
                            ))}
                        </select>

                        <select 
                        className="text- mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 capitalize outline-none focus:bg-amber-200"
                        onChange={(e) => setPosition(e.target.value as BackgroundPositionKeyword)}
                        >
                            {BackgroundOptions.map((p, i) => (
                                <option key={i} value={p} className="bg-white text-black">
                                    {p}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setEdit(false)}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                            Cerrar Panel
                        </button>
                    </div>
                </div>
            )}
        </BlogLayout>
    );
}
