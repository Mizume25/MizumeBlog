import { useState, FormEvent } from 'react';
import { router } from '@inertiajs/react';

function create() {

    const [form, setForm] = useState({
        titulo: '',
        web_title: '',
        categoria: '',
        autor: '',
        genero: '',
        fecha_publicacion: '',
        descripcion: '',
        publicado: false,
        portadaFile: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setForm(prev => ({ ...prev, portadaFile: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('titulo', form.titulo);
        data.append('web_title', form.web_title);
        data.append('categoria', form.categoria);
        data.append('autor', form.autor);
        data.append('genero', form.genero);
        data.append('fecha_publicacion', form.fecha_publicacion);
        data.append('descripcion', form.descripcion);
        data.append('publicado', form.publicado ? '1' : '0');
        if (form.portadaFile) data.append('ruta', form.portadaFile);

        router.post(route('post.store'), data);
    };

    const CATEGORIAS = ['Literatura', 'AnimeManga', 'Reflexiones'];

    return (
        <main className="min-h-screen flex items-start justify-center px-4 py-12">
            <div className="w-full max-w-2xl">

                {/* ── Breadcrumb ── */}
                <p className="inline-block bg-[#FFF9F0] px-4 py-2 rounded-2xl shadow-sm border border-[#8B5A2B]/10 text-[11px] uppercase tracking-widest text-[#8B5A2B]/60 mb-6">
                    Panel · Posts · <span className="text-[#3B2314] font-bold">Nuevo</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-0" encType="multipart/form-data">

                    {/* ═══════════════════════════════════════
                        HERO: Portada (izq) + Título (der)
                    ═══════════════════════════════════════ */}
                    <div className="bg-[#3B2314] rounded-t-2xl overflow-hidden flex flex-col sm:flex-row">

                        {/* Portada */}
                        <label
                            htmlFor="portada-input"
                            className="relative group cursor-pointer sm:w-48 shrink-0 aspect-[3/4] sm:aspect-auto overflow-hidden"
                            aria-label="Subir portada"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Portada"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full min-h-[160px] bg-[#6B3F1F]/40 flex items-center justify-center">
                                    <span className="text-4xl opacity-40">📖</span>
                                </div>
                            )}
                            {/* Overlay al hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="text-[10px] text-white/80 uppercase tracking-widest">
                                    {preview ? 'Cambiar' : 'Subir'}
                                </span>
                            </div>
                            <input
                                id="portada-input"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImage}
                            />
                        </label>

                        {/* Título + subtítulo sobre el fondo oscuro */}
                        <div className="flex-1 p-8 flex flex-col justify-center gap-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#C8AD7F]/50 mb-1">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={form.titulo}
                                    onChange={handleChange}
                                    placeholder="Título del post"
                                    required
                                    className="
                                        w-full bg-transparent border-b border-[#C8AD7F]/30
                                        text-[#E8D5A3] text-xl font-semibold
                                        placeholder:text-[#C8AD7F]/25
                                        focus:outline-none focus:border-[#C8AD7F]
                                        transition-colors pb-1
                                    "
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#C8AD7F]/50 mb-1">
                                    Subtítulo / Web title
                                </label>
                                <input
                                    type="text"
                                    name="web_title"
                                    value={form.web_title}
                                    onChange={handleChange}
                                    placeholder="Subtítulo o descripción corta"
                                    className="
                                        w-full bg-transparent border-b border-[#C8AD7F]/30
                                        text-[#C8AD7F]/80 text-sm italic
                                        placeholder:text-[#C8AD7F]/20
                                        focus:outline-none focus:border-[#C8AD7F]/60
                                        transition-colors pb-1
                                    "
                                />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════
                        BODY: resto de campos
                    ═══════════════════════════════════════ */}
                    <div className="bg-white border-x border-[#EAD9B8] px-8 py-8 space-y-7">

                        {/* Categoría + Género */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8B5A2B] mb-1.5">
                                    Categoría
                                </label>
                                <select
                                    name="categoria"
                                    value={form.categoria}
                                    onChange={handleChange}
                                    required
                                    className="
                                        w-full bg-[#F5EDD8] border border-[#EAD9B8]
                                        text-[#3B2314] text-sm
                                        px-3 py-2 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-[#C8AD7F]
                                        transition-all cursor-pointer
                                    "
                                >
                                    <option value="">— Selecciona —</option>
                                    {CATEGORIAS.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8B5A2B] mb-1.5">
                                    Género(s)
                                </label>
                                <input
                                    type="text"
                                    name="genero"
                                    value={form.genero}
                                    onChange={handleChange}
                                    placeholder="Ej: Novela, Realismo"
                                    className="
                                        w-full bg-[#F5EDD8] border border-[#EAD9B8]
                                        text-[#3B2314] text-sm
                                        px-3 py-2 rounded-lg
                                        placeholder:text-[#8B5A2B]/30
                                        focus:outline-none focus:ring-2 focus:ring-[#C8AD7F]
                                        transition-all
                                    "
                                />
                            </div>
                        </div>

                        {/* Fecha de publicación */}
                        {/* Fecha de publicación + Autor */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8B5A2B] mb-1.5">
                                    Fecha de publicación
                                </label>
                                <input
                                    type="date"
                                    name="fecha_publicacion"
                                    value={form.fecha_publicacion}
                                    onChange={handleChange}
                                    required
                                    className="
                w-full bg-[#F5EDD8] border border-[#EAD9B8]
                text-[#3B2314] text-sm
                px-3 py-2 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#C8AD7F]
                transition-all cursor-pointer
            "
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8B5A2B] mb-1.5">
                                    Autor
                                </label>
                                <input
                                    type="text"
                                    name="autor"
                                    value={form.autor}
                                    onChange={handleChange}
                                    placeholder="Nombre del autor"
                                    className="
                w-full bg-[#F5EDD8] border border-[#EAD9B8]
                text-[#3B2314] text-sm
                px-3 py-2 rounded-lg
                placeholder:text-[#8B5A2B]/30
                focus:outline-none focus:ring-2 focus:ring-[#C8AD7F]
                transition-all
            "
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-[#8B5A2B] mb-1.5">
                                Resumen / Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Escribe una breve descripción o resumen del post..."
                                className="
                                    w-full bg-[#F5EDD8] border border-[#EAD9B8]
                                    text-[#3B2314] text-sm
                                    px-4 py-3 rounded-lg
                                    placeholder:text-[#8B5A2B]/30
                                    focus:outline-none focus:ring-2 focus:ring-[#C8AD7F]
                                    transition-all resize-none
                                "
                            />
                        </div>

                        {/* Publicado toggle */}
                        <div className="flex items-center gap-3 py-2">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={form.publicado}
                                onClick={() => setForm(prev => ({ ...prev, publicado: !prev.publicado }))}
                                className={`
                                    relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0
                                    ${form.publicado ? 'bg-[#3B2314]' : 'bg-[#EAD9B8]'}
                                `}
                            >
                                <span className={`
                                    absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow
                                    transition-transform duration-300
                                    ${form.publicado ? 'translate-x-5' : 'translate-x-0'}
                                `} />
                            </button>

                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all duration-300 ${form.publicado
                                ? 'text-green-700 bg-green-50 border-green-200'
                                : 'text-[#6B3F1F] bg-[#C8AD7F]/20 border-[#C8AD7F]/40'
                                }`}>
                                {form.publicado ? 'Publicado' : 'Borrador'}
                            </span>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════
                        FOOTER: guardar
                    ═══════════════════════════════════════ */}
                    <div className="bg-[#F5EDD8] border border-[#EAD9B8] rounded-b-2xl px-8 py-5 flex items-center justify-between gap-4">
                        <a
                            href={route('post.panel')}
                            className="text-sm text-[#8B5A2B]/60 hover:text-[#3B2314] transition-colors"
                        >
                            ← Cancelar
                        </a>
                        <button
                            type="submit"
                            className="
                                cursor-pointer
                                px-6 py-2.5 text-sm font-semibold
                                bg-[#3B2314] text-[#E8D5A3]
                                rounded-lg shadow-sm
                                hover:bg-[#6B3F1F]
                                active:scale-95
                                transition-all duration-150
                                touch-manipulation
                            "
                        >
                            Crear post
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}

export default create;