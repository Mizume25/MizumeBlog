import React from 'react'
import { Data } from './MizumeAdmin'
import { Comentario, Post , User } from '@/types';


function InfoPanel({ data } : { data:Data }) {

    const allPosts : Post[] = data.posts;
    const allUsers : User[] = data.users;
    const allComents : Comentario [] = data.coments;

    const drafts = allPosts.filter((p: Post) => p.publicado == false);
    const publish = allPosts.length - drafts.length;


    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { label: 'Posts publicados', val: publish },
                { label: 'Borradores', val: drafts.length },
                { label: 'Usuarios registrados', val: allUsers.length },
                { label: 'Comentarios', val: allComents.length },
            ].map((stat, i) => (
                <div key={i} className="bg-white border border-[#EAD9B8] rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C8AD7F]/40"></div>
                    <p className="text-[11px] uppercase tracking-widest text-[#8B5A2B] mb-2">{stat.label}</p>
                    <p className="ext-3xl text-[#3B2314]">{stat.val}</p>
                    
                </div>
            ))}
        </div>
    )
}

export default InfoPanel