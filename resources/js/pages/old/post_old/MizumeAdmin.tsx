import ColorPicker from '@/components/color-picker';
import { useToast } from '@/hooks/use-toast';
import BlogLayout from '@/layouts/app/blog-layout';
import PanelEdit from '@/layouts/app/panel-edit';
import { Data, Post, Section, SECTION, Section_Content } from '@/types';
import { configApi } from '@/types/api';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { InfoNav, InfoPanel, InfoProgresBar, InfoTable } from '../../core/admin';
import ApiToast from '@/components/api-toast';

/**
 * Sidebars comeplemtarios
 * @param posts
 * @returns
 */
function InfoSideBarRight({ posts }: { posts: Post[] }) {
    return (
        <div className="rounded-xl border border-[#EAD9B8] bg-white shadow-sm">
            <div className="border-b border-[#EAD9B8] px-5 py-4">
                <h3 className="text-[#3B2314]">Actividad reciente</h3>
            </div>
            <div className="p-1 capitalize">
                {posts.map((act, i) => (
                    <div key={i} className="flex gap-3 border-b border-[#EAD9B8]/40 p-3 last:border-0">
                        <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600`}></div>
                        <div>
                            <p className="text-xs leading-snug text-[#4A3020]">{act.title}</p>
                            <p className="text-[10px] text-gray-400 italic">{act.publish_date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const MizumeAdmin = ({ data }: { data: Data }) => {
    /*** Secciones */
    const [section, setSection] = useState<Section_Content>(SECTION[0]);
    const [accent, SetAccent] = useState('#ffffff');
    const [confirmAccent, setConfirmAccent] = useState(false);
    const [edit, setEdit] = useState(false);

    /** Changes Section */
    /** Changes Section */
    const handleSection = (label: Section) => {
        section.active = false;

        const sec = SECTION.find((p) => p.label == label);

        if (sec) setSection(sec);

        section.active = true;
    };

    const onEdit = () => setEdit((prev) => !prev);
    const { showToast, toast } = useToast();
    const [selectPost, setSelectPost] = useState<Post>(data.posts[0]);

    /** Api para confirmar cambios */
    const ApiAccentUpdate = async () => {
        if (accent == null) return;

        await configApi
            .updateAccent(Number(selectPost.id), accent)
            .then((data) => showToast('success', data.message))
            .catch((err) => showToast('error', err.message));
    };

    useEffect(() => {
        if (accent == null) return;

        const current = data.posts.find((p) => p.id === selectPost.id);
        setConfirmAccent(current?.config?.accent !== accent);
    }, [accent]);

    const handleID = (id: number) => {
        const current = data.posts.find((p) => p.id === id);
        if(current === undefined) return;
        setSelectPost(current);
    };

    return (
        <BlogLayout edit={edit} onEdit={onEdit}>
            <Head title="Panel Admin" />
            <ApiToast toast={toast} />
            <div className="flex min-h-screen bg-[#F5EDD8] text-[#1C1008]">
                {/* ── MAIN CONTENT ── */}
                <main className="ml-0 flex min-w-0 flex-1 flex-col">
                    <InfoNav />

                    <div className="space-y-6 p-4 lg:space-y-8 lg:p-8">
                        <InfoPanel data={data} />

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* POST TABLE */}
                            <InfoTable posts={data.posts} section={section} onSection={handleSection} onID={handleID} />

                            {/* RIGHT COLUMN */}
                            <div className="space-y-6">
                                {/* ACTIVITY */}
                                <InfoSideBarRight posts={data.posts.slice(0, 3)} />

                                {/* PROGRESS STATS */}
                                <InfoProgresBar posts={data.posts} />
                            </div>
                        </div>
                    </div>

                    {edit && (
                        <PanelEdit>
                            <h3 className="mb-2 text-lg font-bold text-white">Post</h3>
                            <input
                                type="text"
                                value={selectPost.title}
                                disabled
                                className="rounded-xl border border-[#2a2f3a] bg-[#171a21] px-4 py-2.5 text-[15px] text-[#e8eaed] capitalize transition-colors duration-150 outline-none placeholder:text-[#5a5f6b] focus:border-[#5b8cff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8cff]"
                            />

                            <h3 className="mb-2 text-lg font-bold text-white">Color de Footer</h3>
                            <ColorPicker label="Color de Footer" defaultValue={accent} onChange={(hex) => SetAccent(hex)} />

                            <button
                                onClick={ApiAccentUpdate}
                                className="bg-btn-success text-btn-success-foreground mb-2 w-full rounded-xl px-4 py-2 transition-colors not-disabled:cursor-pointer disabled:bg-white/60"
                                disabled={!confirmAccent}
                            >
                                Confirmar Color
                            </button>

                            <button
                                onClick={() => setEdit(false)}
                                className="bg-btn-info text-btn-info-foreground btn-hover-scale w-full rounded-xl px-4 py-2 transition-colors"
                            >
                                Cerrar Panel
                            </button>
                        </PanelEdit>
                    )}
                </main>
            </div>
        </BlogLayout>
    );
};

export default MizumeAdmin;
