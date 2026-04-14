
// SideBar Left
function HomeSideBarLeft() {
    return (
        <aside className="bg-[rgb(45,29,13)] p-[35px] rounded-[5px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hidden lg:block sticky top-6 ">

            <section className="mb-[30px]">

                <div className="mb-4">
                    <img src="IMG/Foto-Perfil.jpg" alt="Perfil" className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover" />
                </div>

                <h3
                    className="text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] text-xl">
                    Secciones
                </h3>

                <ul className="pl-0 text-center">
                    <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mb-0">
                        <a href="#" className="text-white no-underline">
                            🐢 Sobre Autores
                        </a>
                    </li>
                    <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]">
                        <a href="#" className="text-white no-underline">
                            🐢 Archivador
                        </a>
                    </li>
                    <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]">
                        <a href="#" className="text-white no-underline">
                            🐢 Intereses
                        </a>
                    </li>
                </ul>
            </section>

        </aside>
    )
}

export default HomeSideBarLeft