import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { router } from "@inertiajs/react";
import { Image, LayoutDashboard, LogIn, LogOut, Pencil, UserPlus } from "lucide-react";
import HomeProfile from '../home/HomeProfile';
import { netWork } from '../home/HomeSideBarRight';
import { WEB_ROUTE } from '@/types/constants';


interface SideBarLeftProps {
    isOpen?: boolean;
    onClose?: () => void;
    id?: number | undefined
}

function SideBarLeft({ isOpen = false, onClose, id }: SideBarLeftProps) {

    const { auth } = usePage<SharedData>().props;

    const sidebarContent = (
        <>
            <section className="mb-[30px]">
                <a href={route('profile.edit')}>
                    <div className="mb-4">

                        {auth?.user?.avatar ? (

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
                <div className="text-center w-full text-white mb-4">
                    <span>Hola, {auth?.user?.name || "Bienvenido/a!"}</span>
                </div>
            </section>

            <section className="mb-[30px]">
                {/* Secciones */}
                <h3 className="text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] text-xl">
                    Secciones
                </h3>
                <ul className="pl-0">
                    {WEB_ROUTE.map((item) => (
                        <li
                            key={item.label}
                            className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]"
                        >
                            <a href={item.url} className="text-white no-underline capitalize">
                                🐢 {item.label}
                            </a>
                        </li>
                    ))}
                </ul>



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

        </>
    );

    return (
        <>
            {/* ── MÓVIL: drawer ── */}
            <div className="lg:hidden">
                <div
                    onClick={onClose}
                    className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                />
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 w-full
                        bg-[rgb(45,29,13)] p-[35px]
                        shadow-[4px_0_15px_rgba(0,0,0,0.3)]
                        transition-transform duration-300 ease-in-out
                        overflow-y-auto
                        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {/* Fila superior: cerrar + iconos de acción */}
                    {/* Fila superior: cerrar + iconos de acción */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={onClose}
                            className="text-white text-sm font-light opacity-70 hover:opacity-100 cursor-pointer"
                        >
                            ✕ Cerrar
                        </button>

                        <div className="flex items-center gap-2">
                            {auth?.user && (
                                <>
                                    <a href={route('post.panel')}
                                        title="Panel Admin"
                                        className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[rgb(118,77,35)] hover:bg-[#624a2e] transition-colors duration-300"
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-white" />
                                    </a>

                                    <a href={route('posts.image-config')}
                                        title="Format Image"
                                        className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[rgb(118,77,35)] hover:bg-[#624a2e] transition-colors duration-300"
                                    >
                                        <Image className="w-4 h-4 text-white" />
                                    </a>
                                </>
                            )}

                            {auth.user.role === 'admin' && id != null && (

                                <a href={route('post.edit', id)}
                                    title="Editar"
                                    className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[rgb(118,77,35)] hover:bg-[#624a2e] transition-colors duration-300"
                                >
                                    <Pencil className="w-4 h-4 text-white" />
                                </a>
                            )}

                            {!auth?.user ? (
                                <>
                                    <a
                                        href={route('login')}
                                        title="Iniciar Session"
                                        className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-blue-400 hover:bg-[#8B2020] transition-colors duration-300 cursor-pointer"
                                    >
                                        <LogIn className="w-4 h-4 text-white" />
                                    </a>

                                    <a
                                        href={route('register')}
                                        title="Registrarse"
                                        className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-red-400 hover:bg-[#8B2020] transition-colors duration-300 cursor-pointer"
                                    >
                                        <UserPlus className="w-4 h-4 text-white" />
                                    </a>
                                </>
                            ) : (
                                <button
                                    onClick={() => router.post(route('logout'))}
                                    title="Cerrar sesión"
                                    className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[rgb(118,77,35)] hover:bg-[#8B2020] transition-colors duration-300 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4 text-white" />
                                </button>
                            )}
                        </div>
                    </div>

                    {sidebarContent}
                </aside >
            </div >
        </>
    );
}

export default SideBarLeft;