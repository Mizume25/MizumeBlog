
//SIDE BAR RESPONSIVE
function HomeSidebarMobile({onClose, isOpen} : {onClose: () => void , isOpen:boolean}) {

    console.log("Hola desde el responsive");
    console.log(isOpen);
    
  return (
    <>
      {/* 1. Backdrop (Fondo oscuro para cerrar al hacer clic fuera) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
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
        <button 
          onClick={onClose}
          className="text-white mb-6 text-sm font-light opacity-70 hover:opacity-100"
        >
          ✕ Cerrar
        </button>

        {/* Sección de Posts */}
        <section className="mb-[30px]">
          <h3 className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
            Post Destacados
          </h3>
          <ul className="pl-0 flex flex-col gap-2">
             {/* Aquí mapearás tus posts dinámicos */}
             <li className="text-white/80 text-sm italic">Cargando noticias...</li>
          </ul>
        </section>

        {/* Sección de Redes */}
        <section>
          <h3 className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
            Sígueme
          </h3>
          <div className="flex flex-col gap-3">
            {['Twitter', 'Instagram', 'LinkedIn', 'GitHub'].map((red) => (
              <a 
                key={red}
                href="#" 
                className="py-[10px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] text-center transition-colors hover:bg-[rgb(129,106,84)] no-underline text-sm"
              >
                🐢 {red}
              </a>
            ))}
          </div>
        </section>
      </aside>
    </>
  )
}

export default HomeSidebarMobile