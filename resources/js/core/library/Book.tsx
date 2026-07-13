import { type Book } from '@/types';

function BookCard({ title, author, image, accent }: Book) {
    return (
        <div
            className="relative shrink-0 w-[110px] h-[155px] bg-contain bg-no-repeat bg-center bg-[#2a2a2a]"
            style={image ? { backgroundImage: `url(/IMG/Carrusel/${image})` } : undefined}
        >
            <div
                className="w-full h-full rounded-md overflow-hidden flex flex-col justify-end p-2"
                style={{ borderLeft: `4px solid ${accent}` }}
            >
                <span className="block text-center text-[9px] font-medium text-white leading-snug bg-black/50 rounded px-1.5 py-1 [text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
                    {title}
                </span>
                <span className="block text-center text-[8px] text-white/65 mt-0.5 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                    {author}
                </span>
            </div>
        </div>
    );
}

export default BookCard;