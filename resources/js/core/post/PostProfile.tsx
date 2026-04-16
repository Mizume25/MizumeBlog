import React from 'react'
import { netWork } from "../home/HomeSideBarRight"

function PostProfile() {
    return (
        <div className="bg-[#2A1B12] p-8 rounded-xl border border-white/10 shadow-xl text-center">

            <img
                src="/IMG/Foto-Perfil.jpg"
                className="w-32 h-32 rounded-full border-[5px] border-[#C8AD7F] object-cover mx-auto shadow-lg mb-5"
                alt="Gabriel"
            />

            <h3 className="text-white text-2xl font-semibold">Gabriel</h3>

            <div className="w-12 h-[1px] bg-[#C8AD7F]/50 mx-auto my-3"></div>

            <p className="text-[#A18B75] text-sm tracking-wide">
                Blog de Lecturas
            </p>

            {/* SOCIAL */}
            <div className="flex justify-center gap-4 mt-6">
                {netWork.map((p, i) => (
                    <a
                        key={i}
                        href={p.ruta}
                        className="w-11 h-11 rounded-full bg-[#3A8EDB] hover:bg-[#2F76B7] text-black flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md"
                    >
                        {p.nombre.slice(0, 2)}
                    </a>
                ))}
            </div>
        </div>
    )
}

export default PostProfile