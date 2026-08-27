import { BackgroundOptions, BackgroundPositionKeyword, type Post } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { HomeContent } from '../core/home';
/** @imports Layouts Reciclables */
import ApiToast from '@/components/api-toast';
import SideBarRight from '@/core/auth/SideBarRight';
import { useToast } from '@/hooks/use-toast';
import BlogLayout from '@/layouts/app/blog-layout';
import { configApi } from '@/types/api';
import PanelEdit from '@/layouts/app/panel-edit';
import ColorPicker from '@/components/color-picker';

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

    const [confirmPosition, setConfirmPosition] = useState(false);


    const handlerEdit = () => {
        const newEdit = !edit;

        setEdit(newEdit);

        if (newEdit) {
            setSelectPost(mainPosts[0].id);
            console.log(mainPosts[0]);
        } else {
            setSelectPost(null);
        }
    };

    const [position, setPosition] = useState<BackgroundPositionKeyword | null>(null);

    const [selectPost, setSelectPost] = useState<number | null>(null);

    const { showToast, toast } = useToast();

    /** Api para confirmar cambios */
    const ApiHomeUpdate = async () => {
        if (position == null) return;

        await configApi
            .updateHome(Number(selectPost), position)
            .then((data) => showToast('success', data.message))
            .catch((err) => showToast('error', err.message));
    };

   
   

    return (
        <BlogLayout edit={edit} onEdit={handlerEdit}>
            {/* Head de el Home*/}
            <Head title="Home"></Head>
            <ApiToast toast={toast} />
            <main className="container mx-auto grid max-w-[1500px] grid-cols-1 items-start gap-8 p-4 md:p-8 lg:grid-cols-[2fr_1fr]">
                <HomeContent mainPosts={mainPosts} className="order-2 lg:order-1" selectPost={selectPost} position={position} edit={edit} />

                <SideBarRight posts={sidebarPosts} showFollow sticky="lg:top-6" className="order-1 lg:order-2" />
            </main>

            {edit && (
              <PanelEdit>
                        <p className="mb-4 text-sm text-white dark:text-gray-100">Configura las opciones del layout aquí.</p>

                        <select
                            className="text-black mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 capitalize outline-none focus:bg-amber-200"
                            onChange={(e) => setSelectPost(Number(e.target.value))}
                        >
                            {mainPosts.map((p, i) => (
                                <option key={p.id} value={p.id} className="bg-white text-black">
                                    {p.title}
                                </option>
                            ))}
                        </select>

                        <h3 className="mb-2 text-lg font-bold  text-white">Posicion</h3>
                        <select
                            className={`text-black mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 capitalize outline-none focus:bg-amber-200 disabled:bg-amber-200/20`}
                            onChange={(e) => setPosition(e.target.value as BackgroundPositionKeyword)}
                        >
                            {BackgroundOptions.map((p, i) => (
                                <option key={i} value={p} className="bg-white text-black">
                                    {p}
                                </option>
                            ))}
                        </select>
                         <button
                            onClick={ApiHomeUpdate}
                            className="bg-btn-success text-btn-success-foreground mb-2 w-full rounded-xl px-4 py-2 transition-colors not-disabled:cursor-pointer disabled:bg-white/60"
                            disabled={!confirmPosition}
                        >
                            Confirmar Posicion
                        </button>
                       
                </PanelEdit> 
                
            )}
        </BlogLayout>
    );
}
