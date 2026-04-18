import React, { useEffect, useState } from 'react';
import { User, Post, Comentario } from '@/types';
import InfoPanel from '@/core/admin/InfoPanel';
import InfoSideBarLeft from '@/core/admin/InfoSideBarLeft';
import InfoNav from '@/core/admin/InfoNav';
import InfoTable from '@/core/admin/InfoTable';
import InfoSideBarRight from '@/core/admin/InfoSideBarRight';
import InfoProgresBar from '@/core/admin/InfoProgresBar';


export interface Data {
  users: User[],
  posts: Post[],
  coments: Comentario[]
}

function getLatestPosts(posts: Post[], limit: number): Post[] {
  return [...posts]
    .sort((a, b) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime())
    .slice(0, limit);
}

const MizumeAdmin = ({ data }: { data: Data }) => {

  //Variable de Estado
  const MAX_ACTUAL_POST = 3;

  const [categoriaActual, setCategoriaActual] = useState('Todos');

  // 2. Esta es la función que "atrapa" el valor del hijo
  const handleFiltrado = (nombre: string): void => {
    console.log("Cambiando a:", nombre);
    setCategoriaActual(nombre);
  };

  const posts = categoriaActual === 'Todos' ? data.posts : data.posts.filter((p) => p.categoria === categoriaActual);

  const actualPost = getLatestPosts(data.posts,MAX_ACTUAL_POST)

  console.log(data)

  return (
    <div className="flex min-h-screen bg-[#F5EDD8] text-[#1C1008]">
      {/* ── SIDEBAR ── */}
      <InfoSideBarLeft />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* TOPBAR */}
        <InfoNav />

        <div className="p-8 space-y-8">
          <InfoPanel data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* POST TABLE */}
            <InfoTable posts={posts} getCategoria={handleFiltrado} categoriaActual={categoriaActual} />

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* ACTIVITY */}
              <InfoSideBarRight posts={actualPost}/>

              {/* PROGRESS STATS */}
              <InfoProgresBar posts={data.posts}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MizumeAdmin;