import { usePage } from '@inertiajs/react';
import { type IndexContent, SharedData } from '@/types';
import { LayoutDashboard, LogOut } from "lucide-react";
import { router } from "@inertiajs/react";



function PostSideBarLeft({ list, onFindID, menuAbierto, id, isClose }: { list: IndexContent[], onFindID: (id: string) => void, menuAbierto: boolean, id: number, isClose: () => void }) {
    const { auth } = usePage<SharedData>().props;
    const handleID = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (href) {
            const id = href.replace('#', '');
            onFindID(id);
        }
    };

    const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        isClose()
    }

    return (
        <aside
            id="sidebarIndex"
            className={`fixed inset-y-0 left-0 z-[60] w-72 sm:w-80 bg-[#2A1B12] p-6 sm:p-8 shadow-2xl transition-transform duration-300 ease-in-out
    ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}
    lg:relative lg:translate-x-0 lg:col-span-3 lg:block lg:transform-none
    lg:sticky lg:top-24 lg:h-fit lg:p-8 border border-white/10 shadow-xl`}
        >
           


            <h3 className="text-white text-lg sm:text-2xl font-bold border-b-2 border-[#C8AD7F]/40 pb-2 sm:pb-3 mb-3 sm:mb-6 tracking-tight">
                Índice de Contenido
            </h3>

            <ul className="space-y-7 sm:space-y-8 text-[#A18B75]">
                {list.map((p) =>
                    <li key={p.id} className="group flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:translate-x-3 cursor-pointer">
                        <span className="text-base sm:text-xl group-hover:scale-125 transition-transform">🐢</span>
                        <a href={`#${p.id}`} onClick={handleID} className="text-sm sm:text-lg font-medium group-hover:text-white transition-colors">{p.titulo}</a>
                    </li>
                )}
            </ul>
        </aside>
    );
}

export default PostSideBarLeft;