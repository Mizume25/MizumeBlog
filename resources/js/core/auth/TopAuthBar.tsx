import { SharedData, WEB_ROUTE } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LayoutDashboard, Menu, Pencil } from 'lucide-react';
import Switch from 'react-switch';

import LogoutButton from './LogoutButton';

interface TopAuthBarProps {
    onToggle: () => void;
    edit?: boolean;
    onEdit?: () => void;
}

export function TopAuthBar({ onToggle, edit, onEdit }: TopAuthBarProps) {
    const { auth } = usePage<SharedData>().props;
    
    return (
        <div className="bg-primary sticky top-0 z-30 w-full px-4 py-4 shadow-md">
            <div className="mx-auto max-w-375 items-center justify-between max-lg:flex max-lg:flex-row lg:grid lg:grid-cols-3">
                {/* Nav: oculta en mobile */}
                <nav className="hidden gap-6 justify-self-start text-sm font-medium lg:flex">
                    {WEB_ROUTE.map((p, i) => (
                        <a href={p.url} key={i} className="text-primary-foreground group relative text-sm font-bold tracking-wide uppercase">
                            {p.label}
                            <span className="absolute -bottom-1 left-0  w-0 bg-[#8c6c44] transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </nav>
                <div>
                    <h1 className="title text-[1.6rem] font-bold md:justify-self-center md:text-[2rem] lg:text-[2.2rem]"><a href={route('main')}>Mizumeblog</a></h1>
                </div>

                {/* Auth buttons: ocultos en mobile */}
                <div className="hidden items-center gap-6 justify-self-end text-sm font-medium lg:flex">
                    {!auth.user ? (
                        <>
                            <Link href={route('login')} className="hover:underline">
                                Iniciar Sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="bg-primary text-primary-foreground btn-hover-scale rounded px-3 py-1 transition-colors hover:bg-[#4a3728]"
                            >
                                Registrarse
                            </Link>
                        </>
                    ) : (
                        <>
                            {auth.user.role === 'admin' && edit != undefined && onEdit ? (
                                <Switch
                                    checked={edit ?? false}
                                    onChange={onEdit}
                                    onColor="#a79101"
                                    offColor="#454545"
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                />
                            ) : (
                                <></>
                            )}
                            {(auth.user.role === 'admin' || auth.user.role === 'editor') && (
                                <>
                                  
                                </>
                            )}
                            

                            <LogoutButton />
                        </>
                    )}
                </div>

                <div>
                    {/* Trigger del sidebar: solo mobile */}
                    <button
                        onClick={() => onToggle()}
                        className="bg-primary flex w-10 cursor-pointer items-center justify-center rounded border border-white/20 p-1 shadow-lg transition-all active:scale-95 lg:hidden"
                        aria-label="Abrir menú"
                    >
                        <Menu size={24} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TopAuthBar;
