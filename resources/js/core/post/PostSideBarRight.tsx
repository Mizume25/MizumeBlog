//SIDE BAR INDEX
function PostSideBarRight({ index }: { index: string[] }) {

    let count: number = 0;

    return (

        <aside id="sidebarIndex" className="fixed inset-y-0 left-0 z-[60] w-80 bg-[#2A1B12] p-8 shadow-2xl transform -translate-x-full transition-transform duration-300 ease-in-out 
             lg:relative lg:translate-x-0 lg:col-span-3 lg:bg-[#2A1B12]/95 lg:block lg:transform-none
             lg:sticky lg:top-10 lg:h-fit lg:p-8 lg:pr-6 lg:ml-10  border border-white/10">

            <button id="closeSidebar"
                className="lg:hidden absolute top-4 right-4 text-[#C8AD7F] hover:text-white transition-colors">
                <i className="fas fa-times text-2xl"></i>
            </button>

            <h3 className="text-white text-2xl font-bold border-b-2 border-[#C8AD7F]/40 pb-3 mb-6 tracking-tight">
                Índice de Contenido
            </h3>

            <ul className="space-y-6 text-[#A18B75]">
                

                {index.map((p,i) =>
                    <li
                        className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-3 cursor-pointer">
                        <span className="text-xl group-hover:scale-125 transition-transform">🐢</span>
                        <a href={`#section${i + 1}`} className="text-lg font-medium group-hover:text-white transition-colors">{p}</a>
                    </li>

                 
                )}

                <li
                    className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-3 cursor-pointer border-t border-white/10 pt-4">
                    <span className="text-xl group-hover:scale-125 transition-transform">🐢</span>
                    <a href="#" className="text-lg font-medium group-hover:text-white transition-colors">VOLVER A
                        HOME </a>
                </li>
            </ul>
        </aside>
    )
}

export default PostSideBarRight