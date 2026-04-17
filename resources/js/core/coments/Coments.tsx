import React from 'react'

function Coments() {
    return (
        <section className="mt-12 lg:col-start-4 lg:col-span-6 bg-[#2c1e17]/90 text-[#f3e5ab] p-8 rounded-lg shadow-2xl border border-[#4a3728] backdrop-blur-sm">
            <h3 className="text-2xl font-semibold mb-8 border-b border-[#4a3728] pb-2 font-serif text-[#d4a373]">
                Comentarios (3)
            </h3>

            {/* Lista de Comentarios */}
            <div className="space-y-6 mb-10">

                {/* Ejemplo de un Comentario Individual */}
                <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">
                    {/* Círculo de Perfil */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full border-2 border-[#8b5e3c] overflow-hidden bg-[#1e140f] flex items-center justify-center">
                            <span className="text-[10px] font-bold text-[#8b5e3c]">USER</span>
                        </div>
                    </div>

                    {/* Contenido del Comentario */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-[#d4a373]">Lector Curioso</h4>
                            <span className="text-xs text-[#8b5e3c]">Hace 2 horas</span>
                        </div>
                        <p className="text-sm leading-relaxed text-[#c8ad7f]">
                            Me ha encantado la comparación entre Fuyumi Ono y Shiori Ota. Realmente captas la esencia de los detalles retrospectivos. ¡Espero leer más sobre Shiki!
                        </p>
                    </div>
                </div>

                

                {/* Otro Comentario */}
                <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[#8b5e3c] bg-[#1e140f] overflow-hidden">
                        <img src="https://via.placeholder.com/150" alt="avatar" className="object-cover w-full h-full opacity-80" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-[#d4a373] mb-1">Bibliófilo_99</h4>
                        <p className="text-sm text-[#c8ad7f]">Interesante apunte sobre el estilo de Ubukata.</p>
                    </div>
                </div>
            </div>

            {/* Formulario de envío */}
            <form className="mt-8 space-y-4">
                <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#8b5e3c] bg-[#1e140f]"></div>
                    <div className="flex-grow space-y-3">
                        <textarea
                            placeholder="Escribe tu reflexión..."
                            className="w-full bg-[#1e140f] border border-[#4a3728] rounded-md p-3 text-[#f3e5ab] placeholder-[#5a4234] focus:outline-none focus:ring-2 focus:ring-[#8b5e3c] resize-y min-h-[100px]"
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[#8b5e3c] hover:bg-[#a67c52] text-[#1e140f] font-bold py-2 px-6 rounded-md transition-all duration-200 shadow-lg active:scale-95"
                            >
                                Enviar comentario
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default Coments