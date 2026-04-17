import { Index } from "@/pages/post/show";
import LogoutButton from "../auth/LogoutButton";
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
function PostSideBarLeft({ list, onFindID, menuAbierto }: { list: Index[], onFindID: (id: string) => void, menuAbierto: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const handleID = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (href) {
            const id = href.replace('#', '');
            onFindID(id);
        }
    };

    return (
        <aside
            id="sidebarIndex"
            className={`fixed inset-y-0 left-0 z-[60] w-80 bg-[#2A1B12] p-8 shadow-2xl transition-transform duration-300 ease-in-out
                ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 lg:col-span-3 lg:bg-[#2A1B12]/95 lg:block lg:transform-none
                lg:sticky lg:top-10 lg:h-fit lg:p-8 lg:pr-6 lg:ml-10 border border-white/10`}
        >
            <button
                id="closeSidebar"
                className="lg:hidden absolute top-4 right-4 text-[#C8AD7F] hover:text-white transition-colors"
            >
                <i className="fas fa-times text-2xl"></i>
            </button>

            <h3 className="text-white text-2xl font-bold border-b-2 border-[#C8AD7F]/40 pb-3 mb-6 tracking-tight">
                Índice de Contenido
            </h3>

            <ul className="space-y-6 text-[#A18B75]">
                {list.map((p) =>
                    <li key={p.id} className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-3 cursor-pointer">
                        <span className="text-xl group-hover:scale-125 transition-transform">🐢</span>
                        <a href={`#${p.id}`} onClick={handleID} className="text-lg font-medium group-hover:text-white transition-colors">{p.titulo}</a>
                    </li>
                )}

                <li className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-3 cursor-pointer border-t border-white/10 pt-4">
                    <span className="text-xl group-hover:scale-125 transition-transform">🐢</span>
                    <a href={route('dashboard')} className="text-lg font-medium group-hover:text-white transition-colors">VOLVER A HOME</a>
                </li>

                {auth.user &&  <LogoutButton />}
            </ul>
        </aside>
    );
}

export default PostSideBarLeft;