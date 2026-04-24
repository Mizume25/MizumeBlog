import React from "react";
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import LogoutButton from "../auth/LogoutButton";
import PanelBTN from "../auth/PanelBTN";
import { router } from "@inertiajs/react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { netWork } from "./HomeSideBarRight";
import HomeProfile from "./HomeProfile";

interface HomeSideBarLeftProps {
    isOpen?: boolean;
    onClose?: () => void;
}

function HomeSideBarLeft({ isOpen = false, onClose }: HomeSideBarLeftProps) {
    const { auth } = usePage<SharedData>().props;

    const secciones = [
        { nombre: 'Sobre Autores', ruta: '#' },
        { nombre: 'Archivador', ruta: route('post.archivador') },
    ];

    const sidebarContent = (
        <section className="mb-[30px]">
            {/* Foto */}
            <a href={route('profile.edit')}>
            <div className="mb-4">
                {auth?.user?.google_id ? (

                    <img
                        src={auth.user.avatar}
                        alt="Perfil"
                        className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover"
                    />

                ) : auth?.user ? (

                    <HomeProfile name={auth.user.name} />

                ) : (

                    <img
                        src="/IMG/Foto-Perfil.jpg"
                        alt="Perfil"
                        className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover"
                    />
                )}

            </div>
            </a>
            {/* Saludo */}
            <div className="text-center w-full text-white mb-4">
                <span>Hola, {auth?.user?.name || "Bienvenido/a!"}</span>
            </div>

            {/* Secciones */}
            <h3 className="text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] text-xl">
                Secciones
            </h3>
            <ul className="pl-0">
                {secciones.map((item) => (
                    <li
                        key={item.nombre}
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]"
                    >
                        <a href={item.ruta} className="text-white no-underline">
                            🐢 {item.nombre}
                        </a>
                    </li>
                ))}
            </ul>
                <br />
            {/* ── DESKTOP: botones originales con texto ── */}
            {auth?.user?.role === 'admin' && (
                <div className="hidden lg:block">
                    <PanelBTN />
                </div>
            )}
            <div className="hidden lg:block mt-2">
                {auth?.user && <LogoutButton />}
            </div>

            {/* ── Redes sociales: solo en drawer móvil ── */}
            <div className="lg:hidden mt-6">
                <h3 className="text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] text-xl">
                    Sígueme
                </h3>
                <div className="flex flex-wrap gap-[10px]">
                    {netWork.map((red) => (
                        <a
                            key={red.nombre}
                            href={red.ruta}
                            className="inline-block py-[8px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] transition-colors duration-300 hover:bg-[rgb(129,106,84)] no-underline text-sm"
                        >
                            🐢 {red.nombre}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );

    return (
        <>
            {/* ── DESKTOP ── */}
            <aside className="bg-[rgb(45,29,13)] p-[35px] rounded-[5px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hidden lg:block sticky top-6">
                {sidebarContent}
            </aside>

            {/* ── MÓVIL: drawer ── */}
            <div className="lg:hidden">
                <div
                    onClick={onClose}
                    className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                />
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 w-72
                        bg-[rgb(45,29,13)] p-[35px]
                        shadow-[4px_0_15px_rgba(0,0,0,0.3)]
                        transition-transform duration-300 ease-in-out
                        overflow-y-auto
                        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {/* Fila superior: cerrar + iconos de acción */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={onClose}
                            className="text-white text-sm font-light opacity-70 hover:opacity-100 cursor-pointer"
                        >
                            ✕ Cerrar
                        </button>
                        {auth?.user && (
                            <div className="flex items-center gap-2">
                                {auth?.user.role === 'admin' && (
                                    <a
                                        href={route('post.panel')}
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
                    {sidebarContent}
                </aside>
            </div>
        </>
    );
}

export default React.memo(HomeSideBarLeft);