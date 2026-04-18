import { Post } from '@/types'
import React from 'react'

function InfoSideBarRight( { posts }:{ posts: Post[]}) {
    return (
        <div className="bg-white border border-[#EAD9B8] rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-[#EAD9B8]">
                <h3 className=" text-[#3B2314]">Actividad reciente</h3>
            </div>
            <div className="p-1">
                {posts.map((act, i) => (
                    <div key={i} className="flex gap-3 p-3 border-b border-[#EAD9B8]/40 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 bg-green-600`}></div>
                        <div>
                            <p className="text-xs text-[#4A3020] leading-snug">{act.titulo}</p>
                            <p className="text-[10px] text-gray-400 italic">{act.fecha_publicacion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InfoSideBarRight