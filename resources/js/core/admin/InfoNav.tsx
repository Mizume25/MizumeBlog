import { Image } from "lucide-react";

function InfoNav() {
    return (
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[#EAD9B8] bg-[#F5EDD8] px-4 py-4 lg:px-8">
            <h2 className="text-xl text-[#3B2314]">Resumen general</h2>

            {/* Botones — solo desktop */}
            <div className="hidden items-center gap-4 lg:flex">
                <a
                    href={route('post.create')}
                    className="_btn_secondary"
                >
                    + Nuevo post
                </a>

                 <a
                    href={route('artwork.index')}
                    className="_btn_secondary flex flex-row items-center justify-center"
                >
                    <Image size={16} className="me-2"/>  Artworks
                </a>
                <a
                    href={route('post.backup')}
                    className="_btn_secondary"
                >
                    ↓ Backup
                </a>
            </div>
            <div className="flex items-center lg:hidden gap-4">

                 <a
                    href={route('artwork.index')}
                    className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-md bg-[#3B2314] px-4 py-2 text-xl text-[#E8D5A3] shadow-sm transition-colors hover:bg-[#6B3F1F] lg:hidden"
                >
                    <Image size={16} />
                </a>
                
                <a
                    href={route('post.create')}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-[#3B2314] px-4 py-2 text-xl text-[#E8D5A3] shadow-sm transition-colors hover:bg-[#6B3F1F] lg:hidden"
                >
                    +
                </a>

                 

                <a
                    href={route('post.backup')}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-[#5C3D1E] px-4 py-2 text-2xl text-[#E8D5A3] shadow-sm transition-colors hover:bg-[#7A5230] lg:hidden"
                >
                    ↓
                </a>
            </div>
        </header>
    );
}

export default InfoNav;
