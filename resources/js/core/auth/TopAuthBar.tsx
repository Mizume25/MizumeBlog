import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import LogoutButton from './LogoutButton';
import PanelBTN from './PanelBTN';
import EditBTN from './EditBTN';
import { WEB_ROUTE } from '@/types/constants';
import { Menu } from 'lucide-react';



interface TopAuthBarProps {
    post_id?: number;
    onToggle: () => void;  
}


export function TopAuthBar({ post_id, onToggle }: TopAuthBarProps) {
    const { auth } = usePage<SharedData>().props;




    return (
        <div className="w-full bg-[#f3e5ab] text-[#2c1e17] py-4 px-4 shadow-md sticky top-0 z-50">
            <div className="max-w-[1500px] mx-auto flex md:grid md:grid-cols-3 items-center justify-between">

                {/* Nav: oculta en mobile */}
                <nav className="hidden md:flex gap-6 text-sm font-medium justify-self-start">
                    {WEB_ROUTE.map((p, i) => (
                        <Link key={i} href={p.url} className="hover:underline capitalize">{p.label}</Link>
                    ))}
                </nav>

                <h1 className="md:justify-self-center text-[1.6rem] md:text-[2rem] lg:text-[2.2rem] font-bold text-white tracking-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] truncate">
                    Mizumeblog
                </h1>

                {/* Auth buttons: ocultos en mobile */}
                <div className="hidden md:flex gap-6 items-center text-sm font-medium justify-self-end">
                    {!auth.user ? (
                        <>
                            <Link href={route('login')} className="hover:underline">Iniciar Sesión</Link>
                            <Link
                                href={route('register')}
                                className="bg-[#2c1e17] text-[#f3e5ab] px-3 py-1 rounded hover:bg-[#4a3728] transition-colors"
                            >
                                Registrarse
                            </Link>
                        </>
                    ) : (
                        <>
                            {(auth.user.role === 'admin' || auth.user.role === 'editor') && <PanelBTN />}
                            {(auth.user.role === 'admin' || auth.user.role === 'editor') && post_id && (
                                <EditBTN id={post_id} />
                            )}
                            <LogoutButton />
                        </>
                    )}
                </div>

                {/* Trigger del sidebar: solo mobile */}
                <button
                    onClick={() => onToggle()}
                    className="md:hidden p-1 bg-[#3D1F08] rounded shadow-lg border border-white/20 active:scale-95 transition-all cursor-pointer"
                    aria-label="Abrir menú"
                >
                    <Menu size={24} className='text-white' />
                </button>
            </div>

            {/* Aquí conectas tu componente de Sidebar, ej: */}
            {/* <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} auth={auth} post_id={post_id} /> */}
        </div>
    );
}

export default TopAuthBar;