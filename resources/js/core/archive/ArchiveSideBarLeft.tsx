import { JSX } from "react";
import { Seccion } from "@/pages/post/archivador";


function ArchiveSideBarLeft({seccionActiva, getSectionID} : {seccionActiva:Seccion, getSectionID: (id:Seccion) => void}) {

    //Obtener Evento Botton
    const handelButton = (e:React.MouseEvent<HTMLButtonElement>) => {
        getSectionID(e.currentTarget.id as Seccion);
        console.log(e.currentTarget.id as Seccion);
        
    }

    const secciones: { id: Seccion; label: string; icon: JSX.Element }[] = [
        {
            id: 'Literatura',
            label: 'Literatura',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            id: 'AnimeManga',
            label: 'Anime/Manga',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3.75 9h16.5m-16.5 6.75h16.5M9 3.75 7.5 20.25M16.5 3.75 15 20.25" />
                </svg>
            ),
        },
        {
            id: 'Reflexiones',
            label: 'Reflexiones',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
            ),
        },
    ];
    return (
        < aside className = "hidden lg:block lg:col-span-3 lg:sticky lg:top-10 z-30" >
            <nav className="bg-[#2A1B12]/95 p-4 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/10 shadow-2xl">
                <h2 className="text-[#C8AD7F] text-xs uppercase tracking-[0.3em] font-bold mb-8 text-center">
                    Explorar
                </h2>
                <ul className="flex flex-col space-y-6">
                    <li>
                        <a
                            href="/"
                            className="group flex flex-col items-center p-4 rounded-xl hover:bg-[#C8AD7F]/20 transition-all"
                        >
                            <svg className="w-6 h-6 text-[#C8AD7F] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span className="text-base text-white font-bold uppercase">Inicio</span>
                        </a>
                    </li>

                    {secciones.map(({ id, label, icon }) => (
                        <li key={id}>
                            <button
                                id={id}
                                onClick={handelButton}
                                className={`cursor-pointer group w-full flex flex-col items-center p-4 rounded-2xl transition-all duration-300
                                            ${seccionActiva === id ? 'bg-[#C8AD7F]/20' : 'hover:bg-white/5'}`}
                            >
                                <span className="text-[#C8AD7F] mb-2 group-hover:scale-110 transition-transform">
                                    {icon}
                                </span>
                                <span className="text-base text-white font-medium tracking-wide capitalize">
                                    {label}
                                </span>
                                <div className={`h-0.5 bg-[#C8AD7F] transition-all duration-500 mt-1
                                            ${seccionActiva === id ? 'w-full' : 'w-0 group-hover:w-full'}`}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
                </aside >
  )
}

export default ArchiveSideBarLeft