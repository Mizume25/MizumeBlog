import React from 'react'
import { netWork } from "../home/HomeSideBarRight"

function PostProfile() {
    return (
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
        
    )
}

export default PostProfile