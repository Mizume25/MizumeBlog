import React from "react"
import LogoutButton from "../auth/LogoutButton";
export interface Seccion {
    nombre: string;
    ruta: string;
}
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
//SIDE BAR RESPONSIVE
function HomeSidebarMobile({isOpen , onClose} : {isOpen:boolean, onClose: () => void}) {
const { auth } = usePage<SharedData>().props;

// 2. Tipas la constante como un array de esa interfaz
const secciones: Seccion[] = [
    { nombre: 'Sobre Autores', ruta: '/sobre' },
    { nombre: 'Archivador', ruta: '/archivo'},
    { nombre: 'Intereses', ruta: '/intereses' },
];

const netWorks : Seccion[] = [
    {nombre: "Instagram" , ruta:'#'},
    {nombre: "GitHub", ruta:'#'},
    {nombre: "LinkedIn", ruta:'#'}
    
]

  const handleClick = () => {
      onClose()
  };

  

  return (
    <>
      {/* 1. Backdrop (Fondo oscuro para cerrar al hacer clic fuera) */}
      <div  onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
       
      />

      {/* 2. El Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 
        bg-[rgb(45,29,13)] p-[35px] 
        shadow-[-4px_0_15px_rgba(0,0,0,0.3)]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        {/* Botón para cerrar (Opcional pero recomendado en móvil) */}
        <button onClick={handleClick}
           
          className="text-white mb-6 text-sm font-light opacity-70 hover:opacity-100 cursor-pointer"
        >
          ✕ Cerrar
        </button>

        {/* Sección de Posts */}

        <section className="mb-[30px]">

          <div className="mb-4">
                    <img src="IMG/Foto-Perfil.jpg" alt="Perfil" className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover" />
                </div>

          <h3 className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
            Secciones
          </h3>
          <ul className="pl-0 flex flex-col gap-2">
            {secciones.map((item) => 
            
              <li key={item.nombre}
              className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mb-0">
                        <a href={item.ruta} className="text-white no-underline">
                            🐢 {item.nombre}
                        </a>
                    </li>
            
            )} 
          </ul>
        </section>

        {/* Sección de Redes */}
        <section>
          <h3 className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
            Sígueme
          </h3>
          <div className="flex flex-col gap-3">
            {netWorks.map((red) => (
              <a 
                key={red.nombre}
                href={red.ruta}
                className="py-[10px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] text-center transition-colors hover:bg-[rgb(129,106,84)] no-underline text-sm"
              >
                🐢 {red.nombre}
              </a>
            ))}
          </div>
          <br />
          {auth.user &&  <LogoutButton />}
        </section>
      </aside>
    </>
  )
}

export default React.memo(HomeSidebarMobile);