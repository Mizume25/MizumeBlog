import React from 'react'

interface InfoNavProps {
    onMenuOpen: () => void;
}

function InfoNav({ onMenuOpen }: InfoNavProps) {
    return (
        <header className="sticky top-0 z-40 bg-[#F5EDD8] border-b border-[#EAD9B8] px-4 lg:px-8 py-4 flex items-center justify-between gap-3">

            {/* Botón hamburguesa — solo móvil */}
            <button
                onClick={onMenuOpen}
                aria-label="Abrir menú de navegación"
                className="
                    lg:hidden
                    flex items-center justify-center
                    w-9 h-9 rounded-lg shrink-0
                    border border-[#EAD9B8] bg-white
                    text-[#3B2314]
                    hover:border-[#A08050] hover:bg-[#F5EDD8]
                    active:scale-95
                    transition-all duration-150
                    touch-manipulation
                "
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <h2 className="text-xl text-[#3B2314]">Resumen general</h2>

            {/* Botones — solo desktop */}
            <div className="hidden lg:flex items-center gap-4">
                <a href={route('post.create')} className="cursor-pointer px-4 py-2 text-sm bg-[#3B2314] text-[#E8D5A3] rounded-md hover:bg-[#6B3F1F] transition-colors shadow-sm">
                    + Nuevo post
                </a>
                <a
                    href={(route('post.backup'))}
                    className="cursor-pointer px-4 py-2 text-sm bg-[#5C3D1E] text-[#E8D5A3] rounded-md hover:bg-[#7A5230] transition-colors shadow-sm"
                >
                    ↓ Backup
                </a>
            </div>
        </header>
    )
}

export default InfoNav