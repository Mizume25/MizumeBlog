import { Seccion } from '@/pages/post/archivador';
import { Post } from '@/types';

// ── Card individual ──────────────────────────────────────────────
interface CardProps {
    post: Post;
}

const Card = ({ post }: CardProps) => {
    const generos = post.genero?.split(',').map(g => g.trim()) ?? [];

    return (
        <a
            href={route('post.show', post.id)}
            className="group relative block focus:outline-none"
        >
            <div className="
                flex flex-col h-[280px] w-full
                bg-[#d2a264] border-[2px] border-black
                rounded-[25px] overflow-hidden
                transition-transform duration-200
                group-hover:scale-[1.02] group-hover:z-10
                shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            ">
                {/* Header - Color café ocre de la imagen */}
                <header className="
                    h-[46px] bg-[#c59454] border-b-[2px] border-black
                    flex items-center justify-between px-4 shrink-0 text-black
                ">
                    <h2 className="text-sm font-bold truncate pr-2 uppercase tracking-tight">
                        {post.titulo}
                    </h2>
                    <div className="flex gap-1 shrink-0">
                        {generos.slice(0, 1).map(g => (
                            <span
                                key={g}
                                className="px-3 py-1 bg-[#8c6c44] text-white rounded-full text-[0.6rem] font-bold uppercase shadow-sm"
                            >
                                {g}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Body */}
                <main className="flex flex-row h-full overflow-hidden">

                    {/* Sección de Imagen (Mantiene estructura original según tu pedido) */}
                    <section className="w-[35%] sm:w-[30%] shrink-0 bg-[#e5e5e5] border-r-[2px] border-black/20 overflow-hidden">
                        {post.ruta ? (
                            <img
                                src={post.ruta}
                                alt={`Portada de ${post.titulo}`}
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                                📖
                            </div>
                        )}
                    </section>

                    {/* Texto - Color beige/arena de la imagen */}
                    <section className="
                        flex-1 p-4 bg-[#d2b48c]
                        overflow-y-auto
                        [&::-webkit-scrollbar]:w-[4px]
                        [&::-webkit-scrollbar-thumb]:bg-black/20
                        [&::-webkit-scrollbar-thumb]:rounded-full
                    ">
                        <p className="text-[0.6rem] uppercase tracking-widest text-black/60 mb-1 font-medium">
                            {post.autor} · {post.fecha_publicacion}
                        </p>
                        <h3 className="text-base font-extrabold mb-2 text-black leading-tight">
                            {post.web_title || post.titulo}
                        </h3>
                        <p className="text-xs leading-relaxed text-black/90 font-medium">
                            {post.descripcion}
                        </p>
                    </section>
                </main>
            </div>
        </a>
    );
};

// ── Screen — recibe posts ya filtrados ───────────────────────────


const ArchiveScreen  = ({posts, seccionActiva} : {posts : Post[], seccionActiva:Seccion} ) => {

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] gap-3 opacity-30">
                <svg className="w-12 h-12 text-[#C8AD7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-[#C8AD7F] text-xs uppercase tracking-widest">
                    No hay posts en {seccionActiva}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {posts.map(post => (
                <Card key={post.id} post={post} />
            ))}
        </div>
    );
};

export default ArchiveScreen ;