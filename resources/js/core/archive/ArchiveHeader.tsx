import { Seccion } from "@/pages/post/archivador";
import { useState } from "react";


const rutas : string[] = ["/IMG/Banners/Fondo1.jpg","/IMG/Banners/Fondo2.jpg","/IMG/Banners/Fondo3.jpg"];

const changeBanner = (seccionActiva :Seccion): number => {
    if (seccionActiva === 'Literatura') return 0;
    if (seccionActiva === 'AnimeManga') return 2;
    return 1;

}   

function ArchiveHeader({ seccionActiva } : { seccionActiva: Seccion}) {
    let pos : number = changeBanner(seccionActiva);

    const banner = rutas[pos];

    return (
        <header
            className="w-full h-80 bg-no-repeat bg-cover bg-[center_22%] shadow-inner border-b border-white/10 relative"
            style={{ backgroundImage: `url(${banner})` }}
        >
            {/* Botón Home — solo visible en móvil (<lg) */}
            <a
                href="/"
                className="lg:hidden absolute top-4 left-4 flex items-center gap-2 bg-[#2A1B12]/80 hover:bg-[#C8AD7F]/20 border border-white/10 text-[#C8AD7F] px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">Home</span>
            </a>
        </header>
    )
}

export default ArchiveHeader