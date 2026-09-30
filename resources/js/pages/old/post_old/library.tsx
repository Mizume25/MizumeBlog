import ApiToast from '@/components/api-toast';
import LibraryContent from '@/core/library/LibraryContent';
import LibraryHeader from '@/core/library/LibraryHeader';
import LibrarySideBarLeft from '@/core/library/LibrarySideBarLeft';
import { useToast } from '@/hooks/use-toast';
import BlogLayout from '@/layouts/app/blog-layout';
import PanelEdit from '@/layouts/app/panel-edit';
import { BackgroundOptionsCard, BackgroundPositionKeywordCard, Post, Section, SECTION, Section_Content } from '@/types';
import { configApi } from '@/types/api';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';


export interface NavContentProps {
    section: Section_Content;
    onSection: (label: Section) => void;
}

function Library({ posts }: { posts: Post[] }) {
    /** Secciones de estado */
    const [section, setSection] = useState<Section_Content>(SECTION[0]);

    /** Changes Section */
    const handleSection = (label: Section) => {
        section.active = false;

        const sec = SECTION.find((p) => p.label == label);

        if (sec) setSection(sec);

        section.active = true;
    };

    const [edit, setEdit] = useState(false);

    const { showToast, toast } = useToast();

    const [position, setPosition] = useState<BackgroundPositionKeywordCard | null>(null);

    const [selectPost, setSelectPost] = useState<Post>(posts[0]);

    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        if (String(position) == selectPost.config?.card) return;
        setConfirm(true);
    }, [position]);

    const onEdit = () => setEdit((prev) => !prev);

    useEffect(() => {
        setPosition(selectPost.config?.card as BackgroundPositionKeywordCard);
        console.log(selectPost.config?.card)

    }, [selectPost]);

    const handlerID = (id: number) => {
        let post = posts.find((p) => p.id === id);
        if (post == undefined) return;
        setSelectPost(post);
    };

    /** Api para confirmar cambios */
    const ApiCardConfig = async () => {
        if (position == null) return;

        await configApi
            .updateCard(Number(selectPost.id), String(position))
            .then((data) => showToast('success', data.message))
            .catch((err) => showToast('error', err.message));
    };

    return (
        <BlogLayout edit={edit} onEdit={onEdit}>
            <Head title="Archive" />
            <ApiToast toast={toast} />
            <LibraryHeader onSection={handleSection} section={section} />

            <main className="flex min-h-[calc(100vh-260px)] flex-col gap-0 lg:flex-row">
                <LibrarySideBarLeft onSection={handleSection} section={section} />

                <LibraryContent posts={posts} section={section} edit={edit} onID={handlerID} position={position} selectPost={selectPost} />
            </main>

            {edit && (
                <PanelEdit>
                    <h3 className="mb-2 text-lg font-bold text-white">Post</h3>
                    <input
                        type="text"
                        value={selectPost.title}
                        disabled
                        className="rounded-xl border border-[#2a2f3a] bg-[#171a21] px-4 py-2.5 text-[15px] text-[#e8eaed] capitalize transition-colors duration-150 outline-none placeholder:text-[#5a5f6b] focus:border-[#5b8cff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8cff]"
                    />
                    <h3 className="mb-2 text-lg font-bold text-white">Posicion</h3>
                    <select
                        className={`mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 text-black capitalize outline-none focus:bg-amber-200 disabled:bg-amber-200/20`}
                        onChange={(e) => setPosition(e.target.value as BackgroundPositionKeywordCard)}
                    >
                        {BackgroundOptionsCard.map((p, i) => (
                            <option key={i} value={p} selected={position === p ? true:false} className="bg-white text-black">
                                {p}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={ApiCardConfig}
                        className="bg-btn-success text-btn-success-foreground mb-2 w-full rounded-xl px-4 py-2 transition-colors not-disabled:cursor-pointer disabled:bg-white/60"
                        disabled={!confirm}
                    >
                        Confirmar Posicion
                    </button>

                    <button
                        onClick={() => setEdit(false)}
                        className="bg-btn-info text-btn-info-foreground btn-hover-scale w-full rounded-xl px-4 py-2 transition-colors"
                    >
                        Cerrar Panel
                    </button>
                </PanelEdit>
            )}
        </BlogLayout>
    );
}

export default Library;
