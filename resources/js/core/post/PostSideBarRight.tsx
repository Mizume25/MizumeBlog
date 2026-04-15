
//Indice de contenido
function PostSideBarRight() {
  return (
    <aside className="lg:col-span-3 space-y-6 font-['Lexend']">
                <div className="bg-[#2A1B12]/95 p-8 rounded-lg border border-white/10 shadow-2xl text-center">
                    <div className="relative inline-block mb-4">
                        <img src="IMG/Foto-Perfil.jpg"
                            className="w-28 h-28 rounded-full border-4 border-[#C8AD7F] object-cover mx-auto shadow-xl"
                            alt="Gabriel" />
                    </div>

                    <h3 className="text-white text-2xl font-bold mb-1">Gabriel</h3>
                    <p className="text-[#A18B75] text-sm mb-6 uppercase tracking-widest">Blog de Lecturas</p>

                    <div className="flex justify-center gap-3">
                        <a href="#"
                            className="w-10 h-10 bg-[#3498db] hover:bg-[#2980b9] hover:-translate-y-1 transition-all duration-300 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-md">
                            IN
                        </a>
                        <a href="#"
                            className="w-10 h-10 bg-[#3498db] hover:bg-[#2980b9] hover:-translate-y-1 transition-all duration-300 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-md">
                            TW
                        </a>
                        <a href="#"
                            className="w-10 h-10 bg-[#3498db] hover:bg-[#2980b9] hover:-translate-y-1 transition-all duration-300 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-md">
                            GH
                        </a>
                    </div>
                </div>

                <div className="bg-[#2A1B12]/95 p-6 rounded-lg border border-white/10 shadow-2xl">
                    <h4
                        className="text-white text-lg font-bold mb-4 border-b border-[#C8AD7F]/30 pb-2 flex items-center gap-2">
                        <span className="text-[#C8AD7F]">★</span> Artículos Destacados
                    </h4>

                    <ul className="space-y-3">
                        <li>
                            <a href="#"
                                className="group flex items-center gap-3 text-[#A18B75] hover:text-white transition-all duration-300 hover:translate-x-2">
                                <span
                                    className="w-1.5 h-1.5 bg-[#C8AD7F] rounded-full group-hover:scale-150 transition-transform"></span>
                                <span className="text-sm font-medium">Análisis de la narrativa en Shiki</span>
                            </a>
                        </li>
                        <li className="border-t border-white/5 pt-3">
                            <a href="#"
                                className="group flex items-center gap-3 text-[#A18B75] hover:text-white transition-all duration-300 hover:translate-x-2">
                                <span
                                    className="w-1.5 h-1.5 bg-[#C8AD7F] rounded-full group-hover:scale-150 transition-transform"></span>
                                <span className="text-sm font-medium">El simbolismo de los Sotoba</span>
                            </a>
                        </li>
                        <li className="border-t border-white/5 pt-3">
                            <a href="#"
                                className="group flex items-center gap-3 text-[#A18B75] hover:text-white transition-all duration-300 hover:translate-x-2">
                                <span
                                    className="w-1.5 h-1.5 bg-[#C8AD7F] rounded-full group-hover:scale-150 transition-transform"></span>
                                <span className="text-sm font-medium">Filosofía y Muerte en el Manga</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
  )
}

export default PostSideBarRight