import React from 'react'
import { Seccion } from '@/pages/post/archivador'
import { Post } from '@/types'
import ArchiveScreen from './ArchiveScreen'
function ArchivePanel({ seccionActiva, posts }: { seccionActiva: Seccion, posts: Post[] }) {
    return (

        <div className="w-full lg:col-span-9">
            <div
                className="w-full min-h-[60vh] lg:min-h-[75vh] mt-4 lg:mt-0 bg-[#B09472]/90 rounded-3xl border border-white/5 p-6 lg:p-10 relative overflow-hidden transition-all duration-500"
                style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
            >
                {/* Placeholder sin sección */}
                {!seccionActiva && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4 opacity-30">
                        <svg className="w-16 h-16 text-[#C8AD7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                        </svg>
                        <p className="text-[#C8AD7F] text-sm uppercase tracking-widest">Selecciona una sección</p>
                    </div>
                )}

                {/* Screen con cards filtradas */}
                {seccionActiva && (
                    <ArchiveScreen posts={posts} seccionActiva={seccionActiva} />
                )}
            </div>
        </div>

    )
}

export default ArchivePanel