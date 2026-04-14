
//Titulo de el articulo
function PostTitle({ title, data, webtitle, autor }: { title: string, data: string, webtitle: string | undefined, autor: string }) {

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

    let newDate:string = transformarFecha(data);

    // Uso: transformarFecha("2025-04-09") -> "9 de abril de 2025"


    return (
        <header className="px-8 pb-4 text-center">
            <div className="bg-[#C8AD7F] py-8 px-6 rounded-xl shadow-lg mb-6 relative">
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">
                    {title}
                    <span className="text-2xl md:text-3xl opacity-90">{webtitle || `Lectura de ${autor}`}</span>
                </h1>

            </div>
            <p className="text-[#A18B75] italic text-sm mb-4">Publicado el {newDate}</p>
            <div className="w-24 h-px bg-white/20 mx-auto mb-8"></div>
        </header>
    )
}

export default PostTitle