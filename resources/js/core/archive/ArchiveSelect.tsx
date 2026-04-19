import React from 'react';
import { JSX } from 'react';
import { Seccion } from '@/pages/post/archivador';
function ArchiveSelect({ seccionActiva, getSection }: { seccionActiva: Seccion, getSection: (section: Seccion) => void }) {
    const secciones: { id: Seccion; label: string; icon: JSX.Element }[] = [
        {
            id: 'Literatura',
            label: 'Literatura',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            id: 'AnimeManga',
            label: 'Anime/Manga',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3.75 9h16.5m-16.5 6.75h16.5M9 3.75 7.5 20.25M16.5 3.75 15 20.25" />
                </svg>
            ),
        },
        {
            id: 'Reflexiones',
            label: 'Reflexiones',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
            ),
        },
    ];
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const val = e.target.value as Seccion;
        getSection(val);
    };

    return (
        <div className="lg:hidden w-full px-4 mt-8">
            <div className="relative max-w-sm mx-auto">
                <select
                    value={seccionActiva ?? ''}
                    onChange={() => handleChange}
                    className="w-full appearance-none bg-[#2A1B12]/95 border border-white/10 text-[#C8AD7F] text-sm font-medium uppercase tracking-widest px-5 py-3 rounded-2xl shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8AD7F]/40 transition-all"
                >
                    <option value="">— Selecciona una sección —</option>
                    {secciones.map(({ id, label }) => (
                        <option key={id} value={id ?? ''}>{label}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#C8AD7F]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default ArchiveSelect