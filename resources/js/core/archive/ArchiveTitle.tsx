import React from 'react'

function ArchiveTitle() {
    return (
        <div className="relative z-10 flex justify-center -mt-14 px-4">
            <div className="bg-[#C8AD7F] py-5 px-14 rounded-2xl shadow-2xl border border-[#b39a6f]">
                <h1
                    className="text-4xl md:text-5xl font-bold text-white tracking-tighter uppercase"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' }}
                >
                    Archivador
                </h1>
            </div>
        </div>
    )
}

export default ArchiveTitle