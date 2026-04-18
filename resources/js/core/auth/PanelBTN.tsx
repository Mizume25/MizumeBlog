import { router } from '@inertiajs/react';
import { LayoutDashboard, LogOut } from 'lucide-react'; // Opcional: usa el icono que prefieras

const PanelBTN = () => {
    

    return (
        <a
            href={route('post.panel')}
            className="group relative flex items-center justify-start w-full gap-3 px-4 py-3 
                       bg-[#2c1e17]/50 border border-[#4a3728] rounded-lg 
                       text-[#f3e5ab]/80 font-medium transition-all duration-300 
                       hover:bg-[#4a3728] hover:text-[#f3e5ab] hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] 
                       overflow-hidden cursor-pointer"
        >
            {/* Efecto de brillo de "página" al hacer hover */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-[#f3e5ab]/5 group-hover:animate-shine" />

            {/* Icono con movimiento creativo */}
            <div className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110">
               <LayoutDashboard className="text-[#C8AD7F]" size={18} strokeWidth={1.5} />
            </div>

            <span className="relative z-10 transition-all duration-300 group-hover:tracking-wider">
                Panel Admin
            </span>

            {/* Decoración lateral estilo lomo de libro */}
            <div className="absolute left-0 top-0 h-full w-1 bg-[#4a3728] group-hover:bg-[#f3e5ab] transition-colors duration-300" />
        </a>
    );
};

export default PanelBTN;