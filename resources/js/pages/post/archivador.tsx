import { useState, JSX, useEffect } from 'react';
import { Post } from '@/types';
import Screen from '@/core/archive/ArchiveScreen';
import ArchiveHeader from '@/core/archive/ArchiveHeader';
import ArchiveTitle from '@/core/archive/ArchiveTitle';
import ArchiveSelect from '@/core/archive/ArchiveSelect';
import ArchiveSideBarLeft from '@/core/archive/ArchiveSideBarLeft';
import ArchivePanel from '@/core/archive/ArchivePanel';
export type Seccion = 'Literatura' | 'AnimeManga' | 'Reflexiones';


const filterPost = (seccionActiva : Seccion , posts : Post[]) => {
        return posts.filter((p:any) => p.categoria === seccionActiva);
}


const archivador = ({ posts }: { posts: Post[] }) => {

    const [seccionActiva, setSeccionActiva] = useState<Seccion>('Literatura');
    const [list, setlist] = useState<Post[]>(posts.filter((p:any) => p.categoria === seccionActiva));

    useEffect( () => {

        setlist(filterPost(seccionActiva, posts))

    },[seccionActiva])
    

    //Tomar valor de Select
    const handleValueSelect = (section: Seccion): void => {
        setSeccionActiva(section);
    }

    const handleValueNav = (section: Seccion): void => {
        setSeccionActiva(section);
        
    }

    return (
        <main className="min-h-screen w-full flex flex-col">

            {/* ── Header ── */}
            <ArchiveHeader seccionActiva={seccionActiva}/>

            {/* ── Título flotante ── */}
            <ArchiveTitle />

            {/* ── Select ── */}
            <ArchiveSelect seccionActiva={seccionActiva} getSection={handleValueSelect} />

            {/* ── Layout principal ── */}
            <div className="container mx-auto -mt-2 px-4 pb-12 lg:grid lg:grid-cols-12 gap-8 items-start">
                <ArchiveSideBarLeft seccionActiva={seccionActiva} getSectionID={handleValueNav} />
                {/* ── Screen principal ── */}
                <ArchivePanel seccionActiva={seccionActiva} posts={list} />


            </div>
        </main>
    );
};

export default archivador;