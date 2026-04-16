
const transformarFecha = (data :string) => {
        // 1. Creamos el objeto fecha (asegurándote de que el string sea YYYY-MM-DD)
        const fecha = new Date(data);

        // 2. Usamos el formateador de Intl
        return new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(fecha);
};

//Titulo de el articulo
function PostTitle({data, webtitle, autor }: { data: string, webtitle: string | undefined, autor: string }) {


    let newDate:string = transformarFecha(data);

    // Uso: transformarFecha("2025-04-09") -> "9 de abril de 2025"


    return (
        <header className="px-8 pb-4 text-center">
            <div className="bg-[#C8AD7F] py-8 px-6 rounded-xl shadow-lg mb-6 relative">
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-md drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
               
                   { webtitle || `Lectura de ${autor}`}
                </h1>

            </div>
            <p className="text-[#A18B75] italic text-sm mb-4">Publicado el {newDate}</p>
            <div className="w-24 h-px bg-white/20 mx-auto mb-8"></div>
        </header>
    )
}

export default PostTitle