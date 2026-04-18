import React from 'react'

function InfoNav() {
    return (
        <header className="sticky top-0 z-40 bg-[#F5EDD8] border-b border-[#EAD9B8] px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl text-[#3B2314]">Resumen general</h2>
            <div className="flex items-center gap-4">
                <button className="cursor-pointer px-4 py-2 text-sm border border-[#EAD9B8] rounded-md hover:border-[#A08050] hover:text-[#3B2314] transition-all">Vista previa</button>
                <button className="cursor-pointer px-4 py-2 text-sm bg-[#3B2314] text-[#E8D5A3] rounded-md hover:bg-[#6B3F1F] transition-colors shadow-sm">+ Nuevo post</button>
            </div>
        </header>
    )
}

export default InfoNav