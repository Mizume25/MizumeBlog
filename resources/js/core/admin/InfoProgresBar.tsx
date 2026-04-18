import { Post } from '@/types'
import React from 'react'

function InfoProgresBar({ posts } : { posts:Post[]}) {

    const v1 = posts.filter((p: any) => p.categoria === 'Literatura');
    const v2 = posts.filter((p: any) => p.categoria === 'AnimeManga');
    const v3 = posts.filter((p: any) => p.categoria === 'Reflexiones');

    const Literatura = (v1.length * 100) / posts.length;
    const AnimeManga = (v2.length * 100) / posts.length;
    const Reflexiones = (v3.length * 100) / posts.length;

    const r1 = Math.round(Literatura).toString();
    const r2 = Math.round(AnimeManga).toString();
    const r3 = Math.round(Reflexiones).toString();

    return (
        <div className="bg-white border border-[#EAD9B8] rounded-xl p-5 shadow-sm">
            <h3 className="text-[#3B2314] mb-4">Métricas por género</h3>
            <div className="space-y-4">
                {[
                    { label: 'Literatura', val: v1.length, width: r1},
                    { label: 'AnimeManga', val: v2.length, width: r2},
                    { label: 'Reflexiones', val: v3.length, width: r3 },
                ].map((g, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-xs mb-1 italic text-[#4A3020]">
                            <span>{g.label}</span>
                            <span className="font-bold">{g.val}</span>
                        </div>
                        <div className="h-1.5 bg-[#F5EDD8] rounded-full overflow-hidden">
                            <div
                            style={{ width: `${g.width}%` }}
                            className={`h-full bg-[#C8AD7F] rounded-full`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InfoProgresBar