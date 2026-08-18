import { SharedData, WEB_ROUTE } from '@/types';
import { router, usePage } from '@inertiajs/react';
import HomeProfile from '../home/HomeProfile';
import { netWork } from '../home/HomeSideBarRight';

import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { Folder, Image, LogIn, LogOut, PanelBottom, Settings, User, UserPlus } from 'lucide-react';

interface SideBarLeftProps {
    isOpen?: boolean;
    onClose?: () => void;
    id?: number | undefined;
}

function SideBarLeft({ isOpen = false, onClose, id }: SideBarLeftProps) {
    const { auth } = usePage<SharedData>().props;

    /** Renderizado de Operaciones */
    const renderOptions = (admin: boolean) => {
        return (
            <Menu as="div" className="relative inline-block">
                <MenuButton className="bg-btn-primary text-btn-primary-foreground rounded px-3 py-1.5 font-semibold">
                    <Settings />
                </MenuButton>

                <MenuItems className="absolute left-0 z-50 mt-2 w-30 rounded shadow-lg">
                    {admin ? (
                        <>
                            <MenuItems>
                                <button
                                    onClick={() => router.get(route('post.panel'))}
                                    title="Cerrar sesión"
                                    className="rounded-t-2xl bg-primary-foreground text-primary flex w-40 items-center justify-start px-4 py-2"
                                >
                                    <PanelBottom className='me-1' />  Panel
                                </button>
                            </MenuItems>
                            <MenuItems>
                                <button
                                    onClick={() => router.get(route('posts.image-config'))}
                                    title="Cerrar sesión"
                                    className="bg-primary-foreground text-primary  btn-hover-scale flex w-40 items-center justify-start px-4 py-2"
                                >
                                    <Image className='me-1' /> Format
                                </button>
                            </MenuItems>

                            <MenuItems>
                                <button
                                    onClick={() => router.get(route('artwork.index'))}
                                    title="Cerrar sesión"
                                    className="bg-primary-foreground text-primary  btn-hover-scale flex w-40 items-center justify-start px-4 py-2"
                                >
                                    <Folder className='me-1'/>  Artworks
                                </button>
                            </MenuItems>
                        </>
                    ) : (
                        <></>
                    )}

                    <MenuItems>
                        <button 
                         onClick={() => router.get(route('profile.edit'))}
                        className="bg-btn-info text-btn-info-foreground btn-hover-scale flex w-40 items-center justify-start px-4 py-2">
                            <User className='me-1' /> Profile
                        </button>
                    </MenuItems>
                    <MenuItems>
                        <button
                            onClick={() => router.post(route('logout'))}
                            title="Cerrar sesión"
                            className="bg-btn-danger text-btn-danger-foreground btn-hover-scale flex w-40 items-center justify-start rounded-b-2xl px-4 py-2"
                        >
                            <LogOut className='me-1' /> Log Out
                        </button>
                    </MenuItems>
                </MenuItems>
            </Menu>
        );
    };

    const sidebarContent = (
        <>
            <section className="mb-[30px]">
                <a href={route('profile.edit')}>
                    <div className="mb-4">
                        {auth?.user?.avatar ? (
                            <img
                                src={auth.user.avatar}
                                alt="Perfil"
                                className="mx-auto block h-[144px] w-[134px] rounded-full border-[3px] border-[#C4A484] object-cover"
                            />
                        ) : auth?.user ? (
                            <HomeProfile name={auth.user.name} />
                        ) : (
                            <img
                                src="/IMG/Foto-Perfil.jpg"
                                alt="Perfil"
                                className="mx-auto block h-[144px] w-[134px] rounded-full border-[3px] border-[#C4A484] object-cover"
                            />
                        )}
                    </div>
                </a>
                <div className="mb-4 w-full text-center text-white">
                    <span>Hola, {auth?.user?.name || 'Bienvenido/a!'}</span>
                </div>
            </section>

            <section className="mb-[30px]">
                {/* Secciones */}
                <h3 className="mb-4 border-b-2 border-[#eee] pb-[10px] text-xl font-bold text-white [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                    Secciones
                </h3>
                <ul className="pl-0">
                    {WEB_ROUTE.map((item) => (
                        <li
                            key={item.label}
                            className="group mt-[10px] w-full cursor-pointer rounded-[8px] p-[10px] text-left transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-[#624a2e]"
                        >
                            <a href={item.url} className="text-white capitalize no-underline">
                                🐢 {item.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* ── Redes sociales: solo en drawer móvil ── */}
                <div className="mt-6 lg:hidden">
                    <h3 className="mb-4 border-b-2 border-[#eee] pb-[10px] text-xl font-bold text-white [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                        Sígueme
                    </h3>
                    <div className="flex flex-wrap gap-[10px]">
                        {netWork.map((red) => (
                            <a
                                key={red.nombre}
                                href={red.ruta}
                                className="inline-block rounded-[5px] bg-[rgb(118,77,35)] px-[15px] py-[8px] text-sm text-white no-underline transition-colors duration-300 hover:bg-[rgb(129,106,84)]"
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
                    className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
                        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                />
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-[rgb(45,29,13)] p-[35px] shadow-[4px_0_15px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}
                >
                    <div className="mb-6 flex items-center justify-between gap-4">
                        {!auth?.user ? (
                            <div className="flex flex-row gap-3">
                                <a
                                    href={route('login')}
                                    title="Iniciar Session"
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] bg-blue-400 transition-colors duration-300 hover:bg-[#8B2020]"
                                >
                                    <LogIn className="h-4 w-4 text-white" />
                                </a>

                                <a
                                    href={route('register')}
                                    title="Registrarse"
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] bg-red-400 transition-colors duration-300 hover:bg-[#8B2020]"
                                >
                                    <UserPlus className="h-4 w-4 text-white" />
                                </a>
                            </div>
                        ) : (
                            renderOptions(auth.user.role === 'admin' ? true : false)
                        )}

                        <div className="flex items-center gap-2">
                            <button onClick={onClose} className="cursor-pointer text-sm font-light text-white opacity-70 hover:opacity-100">
                                ✕ Cerrar
                            </button>

                            {/*
                            {auth?.user?.role === 'admin' && (
                                <>
                                    <a
                                        href={route('post.panel')}
                                        title="Panel Admin"
                                        className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[rgb(118,77,35)] transition-colors duration-300 hover:bg-[#624a2e]"
                                    >
                                        <LayoutDashboard className="h-4 w-4 text-white" />
                                    </a>

                                    <a
                                        href={route('posts.image-config')}
                                        title="Format Image"
                                        className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[rgb(118,77,35)] transition-colors duration-300 hover:bg-[#624a2e]"
                                    >
                                        <Image className="h-4 w-4 text-white" />
                                    </a>
                                </>
                            )}

                            {auth?.user?.role === 'admin' && id != null && (
                                <a
                                    href={route('post.edit', id)}
                                    title="Editar"
                                    className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[rgb(118,77,35)] transition-colors duration-300 hover:bg-[#624a2e]"
                                >
                                    <Pencil className="h-4 w-4 text-white" />
                                </a>
                            )}

                            {!auth?.user ? (
                                <>
                                    <a
                                        href={route('login')}
                                        title="Iniciar Session"
                                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] bg-blue-400 transition-colors duration-300 hover:bg-[#8B2020]"
                                    >
                                        <LogIn className="h-4 w-4 text-white" />
                                    </a>

                                    <a
                                        href={route('register')}
                                        title="Registrarse"
                                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] bg-red-400 transition-colors duration-300 hover:bg-[#8B2020]"
                                    >
                                        <UserPlus className="h-4 w-4 text-white" />
                                    </a>
                                </>
                            ) : (
                                <button
                                    onClick={() => router.post(route('logout'))}
                                    title="Cerrar sesión"
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[8px] bg-[rgb(118,77,35)] transition-colors duration-300 hover:bg-[#8B2020]"
                                >
                                    <LogOut className="h-4 w-4 text-white" />
                                </button>
                            )} */}
                        </div>
                    </div>

                    {sidebarContent}
                </aside>
            </div>
        </>
    );
}

export default SideBarLeft;
