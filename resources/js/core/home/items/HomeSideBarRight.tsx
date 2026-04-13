import { itemID, SideBarChange } from "@/pages/dashboard";
import { type Post } from "@/types"
import { ReactNode } from 'react';

interface Props {
    featured: Post[];
    ID_ITEM: itemID;
    modo: 'posts' | 'secciones'; // Recibimos la condición
    ID_SIDE_BAR:SideBarChange
}

//Home Side Bar Right
function HomeSideBarRight({ featured, ID_ITEM, ID_SIDE_BAR, modo }: Props) {

   // TU FUNCIÓN (La fábrica mejorada)
    const renderContenido = (): ReactNode => {
        
        // CONDICIÓN 1: Si el padre pide "secciones" (como hacía setSectionsContent)
        if (modo === 'secciones') {
            const secciones = [
                { t: "🐢 Sobre Autores", h: "#sobre-autores" },
                { t: "🐢 Archivador", h: "#archivador" },
                { t: "🐢 Intereses", h: "#intereses" }
            ];
            
            return secciones.map((sec, index) => (
                <li key={index} className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left">
                    <a href={sec.h} id={ID_ITEM.item[index]} className="text-white block">
                        {sec.t}
                    </a>
                </li>
            ));
        }

        // CONDICIÓN 2: El contenido por defecto (como hacía setPostsContent)
        return featured.slice(3).map((p, index) => {
            const currentId = ID_ITEM.item[index];
            return (
                <li key={p.id} className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left">
                    <a href={p?.ruta} id={currentId} className="text-white block">
                        {p.titulo}
                    </a>
                </li>
            );
        });
    };
    return (
        <aside id={ID_SIDE_BAR.sidebar} className="bg-[rgb(45,29,13)] p-[35px] rounded-[5px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] 
    /* --- MÓVIL (Estado inicial: Lejos a la derecha) --- */
    fixed inset-y-0 right-0 z-40 w-72 
    transform translate-x-full lg:transform-none duration-200 ease-out
    
    /* --- DESKTOP (Estado fijo en el grid) --- */
    lg:static lg:translate-x-0 lg:w-full lg:block lg:sticky lg:top-6 lg:z-auto">

            <section className="mb-[30px]">
                <h3 id={ID_SIDE_BAR.title}
                    className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                    Post Destacados
                </h3>
                <ul className="pl-0 text-center" id="list-right">
                    {renderContenido()}
                    {/*
                    <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]">
                        <a href="../Post/Post_Destacados/TextosStendhal.html" className="text-white no-underline block"
                            id="itemTwo">
                            Examen a Rojo y negro de Stendhal
                        </a>
                    </li>
                    <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]">
                        <a href="../Post/Post_Destacados/TextosMallarme.html" className="text-white no-underline block"
                            id="itemThree">
                            Escrutinio a textos de Mallarme
                        </a>
                    </li>
                        */}
                </ul>
            </section>

            <section>
                <h3
                    className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                    Sígueme
                </h3>
                <section className="flex flex-wrap gap-[10px]">
                    <a href="#"
                        className="inline-block py-[8px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] transition-colors duration-300 hover:bg-[rgb(129,106,84)] no-underline">
                        🐢 Twitter
                    </a>
                    <a href="#"
                        className="inline-block py-[8px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] transition-colors duration-300 hover:bg-[rgb(129,106,84)] no-underline">
                        🐢 Instagram
                    </a>
                    <a href="#"
                        className="inline-block py-[8px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] transition-colors duration-300 hover:bg-[rgb(129,106,84)] no-underline">
                        🐢 LinkedIn
                    </a>
                    <a href="#"
                        className="inline-block py-[8px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] transition-colors duration-300 hover:bg-[rgb(129,106,84)] no-underline">
                        🐢 GitHub
                    </a>
                </section>
            </section>
        </aside>
    )
}

export default HomeSideBarRight