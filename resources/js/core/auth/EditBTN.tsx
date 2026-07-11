import { Pencil } from 'lucide-react';

const EditBTN = ({ id }: { id: number | undefined }) => {
    return (
        <a
            href={route('post.edit', id)}
            className="group relative flex items-center justify-center gap-2 px-3 py-1.5
                       bg-[#2c1e17] border border-[#4a3728] rounded-md
                       text-[#f3e5ab]/80 text-sm font-medium transition-all duration-300
                       hover:bg-[#4a3728] hover:text-[#f3e5ab] hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]
                       overflow-hidden cursor-pointer"
        >
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-[#f3e5ab]/5 group-hover:animate-shine" />

            <Pencil size={15} className="relative z-10 text-[#C8AD7F] transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={1.5} />

            <span className="relative z-10 hidden sm:inline transition-all duration-300 group-hover:tracking-wider">
                Editar
            </span>

            <div className="absolute left-0 top-0 h-full w-[3px] bg-[#4a3728] group-hover:bg-[#f3e5ab] transition-colors duration-300" />
        </a>
    );
};

export default EditBTN;