import { Index } from "@/pages/post/show";
import LogoutButton from "../auth/LogoutButton";
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import EditBTN from "../auth/EditBTN";
import { LayoutDashboard, LogOut } from "lucide-react";
import { router } from "@inertiajs/react";
import PanelBTN from "../auth/PanelBTN";
function PostSideBarLeft({ list, onFindID, menuAbierto, id, isClose }: { list: Index[], onFindID: (id: string) => void, menuAbierto: boolean, id: number, isClose: () => void }) {
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
            className={`fixed inset-y-0 left-0 z-[60] w-72 sm:w-80 bg-[#2A1B12] p-5 sm:p-8 shadow-2xl transition-transform duration-300 ease-in-out
        ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:col-span-3 lg:bg-[#2A1B12]/95 lg:block lg:transform-none
        lg:sticky lg:top-10 lg:h-fit lg:p-8 lg:pr-6 lg:ml-10 border border-white/10`}
        >
            <div className="flex items-center justify-between mb-6 lg:hidden">
                <button
                    onClick={handleButton}
                    className="text-white text-sm font-light opacity-70 hover:opacity-100 cursor-pointer"
                >
                    ✕ Cerrar
                </button>

                {auth?.user && (
                    <div className="flex items-center gap-2 justify-center">
                        {auth?.user.role === 'admin' && (
                            <a
                                href={route('post.edit', id)}
                                title="Panel Admin"
                                className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[rgb(118,77,35)] hover:bg-[#624a2e] transition-colors duration-300"
                            >
                                <LayoutDashboard className="w-4 h-4 text-white" />
                            </a>
                        )}
                        <button
                            onClick={() => router.post(route('logout'))}
                            title="Cerrar sesión"
                            className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[rgb(118,77,35)] hover:bg-[#8B2020] transition-colors duration-300 cursor-pointer"
                        >
                            <LogOut className="w-4 h-4 text-white" />
                        </button>
                    </div>
                )}

            </div>


            <h3 className="text-white text-lg sm:text-2xl font-bold border-b-2 border-[#C8AD7F]/40 pb-2 sm:pb-3 mb-3 sm:mb-6 tracking-tight">
                Índice de Contenido
            </h3>

            <ul className="space-y-7 sm:space-y-6 text-[#A18B75]">
                {list.map((p) =>
                    <li key={p.id} className="group flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:translate-x-3 cursor-pointer">
                        <span className="text-base sm:text-xl group-hover:scale-125 transition-transform">🐢</span>
                        <a href={`#${p.id}`} onClick={handleID} className="text-sm sm:text-lg font-medium group-hover:text-white transition-colors">{p.titulo}</a>
                    </li>
                )}

                <li className="group flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:translate-x-3 cursor-pointer border-t border-white/10 pt-3 sm:pt-4">
                    <span className="text-base sm:text-xl group-hover:scale-125 transition-transform">🐢</span>
                    <a href={route('dashboard')} className="text-sm sm:text-lg font-medium group-hover:text-white transition-colors">VOLVER A HOME</a>
                </li>
             
            </ul>
                <br />
              {/* ── DESKTOP: botones originales con texto ── */}
            {auth?.user?.role === 'admin' && (
                <div className="hidden lg:block">
                    <EditBTN id={id}/>
                </div>
            )}
            <br />
            <div className="hidden lg:block mt-2">
                {auth?.user && <LogoutButton />}
            </div>
        </aside>
    );
}

export default PostSideBarLeft;