import { Post } from '@/types';

/** Props de Card Book */
type BookCardProps = Pick<Post, "title" | "author" | "cover_card" | "config">

function BookCard({ title, author, cover_card, config }: BookCardProps) {
    return (
        <div
            className="relative shrink-0 w-[160px] h-[210px] bg-no-repeat bg-center bg-[#2a2a2a] bg-cover"
            style={{ backgroundImage: `url(/IMG/Cards/${cover_card})`,
                     objectPosition: `${config?.card_config}`
                    }}
        >
            <div
                className="w-full h-full rounded-md overflow-hidden flex flex-col justify-end p-2"
                style={{ borderLeft: `4px solid ${config?.accent}` }}
            >
               
                <span className="bg-white rounded-xl capitalize block text-center text-sm text-black mt-0.5">
                    {author}
                </span>
            </div>
        </div>
    );
}

export default BookCard;