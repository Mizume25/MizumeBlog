import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
    

    return (
        <button
            onClick={() => router.post(route('logout'))}
            className="group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border border-[#4a3728] bg-[#2c1e17] px-3 py-1.5 text-sm font-medium text-[#f3e5ab]/80 transition-all duration-300 hover:bg-[#4a3728] hover:text-[#f3e5ab] hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"
        >
            <div className="group-hover:animate-shine absolute -inset-full top-0 z-5 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-[#f3e5ab]/5" />

            <LogOut size={15} className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5" />

            <span className="relative z-10 hidden transition-all duration-300 group-hover:tracking-wider sm:inline">Cerrar Sesión</span>

            <div className="absolute top-0 left-0 h-full w-[3px] bg-[#4a3728] transition-colors duration-300 group-hover:bg-[#f3e5ab]" />
        </button>
    );
};

export default LogoutButton;
