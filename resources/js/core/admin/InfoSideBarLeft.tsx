import { usePage } from '@inertiajs/react';
import React from 'react'
import { SharedData } from '@/types';
interface InfoSideBarLeftProps {
    isOpen: boolean;
    onClose: () => void;
}

function InfoSideBarLeft({ isOpen, onClose }: InfoSideBarLeftProps) {
    const { auth } = usePage<SharedData>().props;
    return (
        <>
            {/* Overlay — solo móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 w-64 h-screen
                bg-[#3B2314] border-r-2 border-[#A08050]
                z-50 flex flex-col overflow-y-auto
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="p-7 border-b border-yellow-900/30 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl text-[#C8AD7F] tracking-wide">MiZumeBlog</h1>
                        <span className="text-[10px] text-[#C8AD7F]/50 italic tracking-widest uppercase">Panel de Administración</span>
                    </div>
                    {/* Botón cerrar — solo visible en móvil */}
                    <button
                        onClick={onClose}
                        aria-label="Cerrar menú"
                        className="lg:hidden mt-1 text-[#C8AD7F]/60 hover:text-[#C8AD7F] transition-colors touch-manipulation"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-3 mt-4">
                    <p className="px-2 mb-2 text-[10px] uppercase tracking-[2px] text-[#C8AD7F]/40">Principal</p>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-[#C8AD7F]/20 text-[#C8AD7F] font-semibold border-l-4 border-[#C8AD7F]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Panel
                        </a>
                        <a href={route('dashboard')} className="flex items-center gap-3 px-3 py-2 rounded-md text-[#E8D5A3]/70 hover:bg-[#C8AD7F]/10 hover:text-[#E8D5A3] transition-all group">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Posts
                            
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[#E8D5A3]/70 hover:bg-[#C8AD7F]/10 hover:text-[#E8D5A3] transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Borradores
                        </a>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-[#C8AD7F]/10">
                    <div className="flex items-center gap-3 p-2 bg-[#C8AD7F]/10 rounded-lg">
                        <div className="w-9 h-9 rounded-full bg-[#A08050] flex items-center justify-center text-white border border-[#C8AD7F]">G</div>
                        <div className="leading-tight">
                            <p className="text-sm font-semibold text-[#E8D5A3]">{ auth.user.name }</p>
                            <span className="text-[11px] text-[#C8AD7F]/50 italic">{ auth.user.role   }</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default InfoSideBarLeft