import { useState , JSX} from 'react';

type Seccion = 'Literatura' | 'AnimeManga' | 'Reflexiones' | null;

const archivador = () => {
    const [seccionActiva, setSeccionActiva] = useState<Seccion>(null);

    const secciones: { id: Seccion; label: string; icon: JSX.Element }[] = [
        {
            id: 'Literatura',
            label: 'Literatura',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            id: 'AnimeManga',
            label: 'Anime/Manga',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3.75 9h16.5m-16.5 6.75h16.5M9 3.75 7.5 20.25M16.5 3.75 15 20.25" />
                </svg>
            ),
        },
        {
            id: 'Reflexiones',
            label: 'Reflexiones',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
            ),
        },
    ];

    return (
        <main className="min-h-screen w-full flex flex-col">

            {/* ── Header ── */}
            <header
                className="w-full h-56 bg-no-repeat bg-cover bg-[center_22%] shadow-inner border-b border-white/10 relative"
                style={{ backgroundImage: "url('/Ejemplo.jpg')" }}
            >
                {/* Botón Home — solo visible en móvil (<lg) */}
                <a
                    href="/"
                    className="lg:hidden absolute top-4 left-4 flex items-center gap-2 bg-[#2A1B12]/80 hover:bg-[#C8AD7F]/20 border border-white/10 text-[#C8AD7F] px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-widest">Home</span>
                </a>
            </header>

            {/* ── Título flotante ── */}
            <div className="relative z-10 flex justify-center -mt-10 px-4">
                <div className="bg-[#C8AD7F] py-5 px-14 rounded-2xl shadow-2xl border border-[#b39a6f]">
                    <h1
                        className="text-4xl md:text-5xl font-bold text-white tracking-tighter uppercase"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' }}
                    >
                        Archivador
                    </h1>
                </div>
            </div>

            {/* ── Select — solo visible en móvil (<lg) ── */}
            <div className="lg:hidden w-full px-4 mt-8">
                <div className="relative max-w-sm mx-auto">
                    <select
                        value={seccionActiva ?? ''}
                        onChange={e => setSeccionActiva((e.target.value as Seccion) || null)}
                        className="w-full appearance-none bg-[#2A1B12]/95 border border-white/10 text-[#C8AD7F] text-sm font-medium uppercase tracking-widest px-5 py-3 rounded-2xl shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8AD7F]/40 transition-all"
                    >
                        <option value="">— Selecciona una sección —</option>
                        {secciones.map(({ id, label }) => (
                            <option key={id} value={id ?? ''}>{label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#C8AD7F]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ── Layout principal ── */}
            <div className="container mx-auto mt-12 px-4 pb-12 lg:grid lg:grid-cols-12 gap-8 items-start">

                {/* ── Aside — solo visible en desktop (lg+) ── */}
                <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-10 z-30">
                    <nav className="bg-[#2A1B12]/95 p-4 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/10 shadow-2xl">
                        <h2 className="text-[#C8AD7F] text-xs uppercase tracking-[0.3em] font-bold mb-8 text-center">
                            Explorar
                        </h2>
                        <ul className="flex flex-col space-y-6">

                            {/* Home */}
                            <li>
                                <a
                                    href="/"
                                    className="group flex flex-col items-center p-4 rounded-xl hover:bg-[#C8AD7F]/20 transition-all"
                                >
                                    <svg className="w-6 h-6 text-[#C8AD7F] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                    <span className="text-base text-white font-bold uppercase">Inicio</span>
                                </a>
                            </li>

                            {/* Secciones */}
                            {secciones.map(({ id, label, icon }) => (
                                <li key={id}>
                                    <button
                                        onClick={() => setSeccionActiva(seccionActiva === id ? null : id)}
                                        className={`group w-full flex flex-col items-center p-4 rounded-2xl transition-all duration-300
                                            ${seccionActiva === id
                                                ? 'bg-[#C8AD7F]/20'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="text-[#C8AD7F] mb-2 group-hover:scale-110 transition-transform">
                                            {icon}
                                        </span>
                                        <span className="text-base text-white font-medium tracking-wide capitalize">
                                            {label}
                                        </span>
                                        <div className={`h-0.5 bg-[#C8AD7F] transition-all duration-500 mt-1
                                            ${seccionActiva === id ? 'w-full' : 'w-0 group-hover:w-full'}`}
                                        />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* ── Screen principal ── */}
                <div className="w-full lg:col-span-9">
                    <div
                        className="w-full min-h-[60vh] lg:min-h-[75vh] mt-4 lg:mt-0 bg-[#2A1B12]/90 rounded-3xl border border-white/10 p-6 lg:p-10 relative overflow-hidden transition-all duration-500"
                        style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(200,173,127,0.1)' }}
                    >
                        {/* Placeholder */}
                        {!seccionActiva && (
                            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4 opacity-30">
                                <svg className="w-16 h-16 text-[#C8AD7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                                </svg>
                                <p className="text-[#C8AD7F] text-sm uppercase tracking-widest">Selecciona una sección</p>
                            </div>
                        )}

                        {/* Contenido sección activa */}
                        {seccionActiva && (
                            <div>
                                <h2 className="text-[#C8AD7F] text-xs uppercase tracking-[0.3em] font-bold mb-8">
                                    {seccionActiva}
                                </h2>
                                {/* aquí irán los posts filtrados */}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
};

export default archivador;