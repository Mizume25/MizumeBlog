import React, { useEffect, useState } from 'react';
import { User, Post, Comentario } from '@/types';
import {
  InfoPanel, 
  InfoSideBarLeft,
  InfoNav, 
  InfoTable, 
  InfoSideBarRight, 
  InfoProgresBar, 
  InfoTableMobile, 
} from '../../core/admin';

const useMediaQuery = (query:string) => {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            const media = window.matchMedia(query);

            // Actualizar el estado inicial
            if (media.matches !== matches) {
                setMatches(media.matches);
            }

            // Definir el listener para cambios de pantalla
            const listener = () => setMatches(media.matches);

            // Soporte para navegadores modernos y antiguos
            media.addEventListener('change', listener);

            return () => media.removeEventListener('change', listener);
        }, [matches, query]);

        return matches;
    };


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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 2. Esta es la función que "atrapa" el valor del hijo
  const handleFiltrado = (nombre: string): void => {
    console.log("Cambiando a:", nombre);
    setCategoriaActual(nombre);
  };

  const posts = categoriaActual === 'Todos' ? data.posts : data.posts.filter((p) => p.categoria === categoriaActual);

  const actualPost = getLatestPosts(data.posts,MAX_ACTUAL_POST)

  const CONTENT = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex min-h-screen bg-[#F5EDD8] text-[#1C1008]">
      {/* ── SIDEBAR ── */}
      <InfoSideBarLeft  
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}/>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 ml-0 lg:ml-64 flex flex-col min-w-0">
        {/* TOPBAR */}
         <InfoNav onMenuOpen={() => setSidebarOpen(true)} />

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          <InfoPanel data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* POST TABLE */}
            {!CONTENT ? (
              <InfoTable posts={posts} getCategoria={handleFiltrado} categoriaActual={categoriaActual} />
            ) : (
              <InfoTableMobile posts={posts} getCategoria={handleFiltrado} categoriaActual={categoriaActual}/>
            )}

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