import BlogLayout from '@/layouts/app/blog-layout';
import { Artwork } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Book, Folder, FolderOpen, Plus } from 'lucide-react';

interface ArtworkFoldersProps {
    artworks: Artwork[];
}

export default function index({ artworks }: ArtworkFoldersProps) {
    return (
        <BlogLayout>
                <Head title="Artworks" />
            <div className="mx-auto mt-5 max-w-6xl rounded-2xl bg-amber-100 p-4 sm:p-8">
                <div className="mb-6 flex flex-row items-center justify-between">
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-black">
                        <Book size={24} />
                        Artworks
                    </h1>
                    <Link
                        href={route('artwork.create')}
                        className="flex items-center gap-2 rounded-2xl bg-[#e2d255] px-4 py-2 font-bold text-[#885200] transition-transform duration-150 hover:scale-105"
                    >
                        <Plus size={18} />
                        Nuevo Artwork
                    </Link>
                </div>

                {artworks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-4 border-dotted border-white/20 bg-white/5 py-20">
                        <FolderOpen size={40} className="text-white/30" />
                        <p className="text-white/50">Aún no hay obras catalogadas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {artworks.map((artwork) => (
                            <Link
                                key={artwork.id}
                                href={route('artwork.edit', artwork.id)}
                                className="group flex flex-col items-center gap-2 rounded-2xl bg-[#754C22] p-4 shadow-lg transition-transform duration-150 hover:scale-105"
                            >
                                <Folder
                                    size={48}
                                    className="text-[#e2d255] transition-transform duration-200 group-hover:-translate-y-0.5"
                                    fill="currentColor"
                                    fillOpacity={0.15}
                                />
                                <div className="w-full text-center">
                                    <h3 className="truncate font-bold text-white">{artwork.title}</h3>
                                    <p className="truncate text-xs text-white/50">{artwork.code}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </BlogLayout>
    );
}
