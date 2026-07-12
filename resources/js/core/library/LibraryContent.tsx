import { Post } from '@/types';
import LibraryCard from './LibraryCard';
import { LibraryCardProps } from '@/pages/post/library';
import { Section_Content } from '@/types/constants';




function LibraryContent({ posts , section } : { posts : Post[] , section:Section_Content}) {
    return (
        <section className="flex-1 px-4 sm:px-10 py-8  bg-[#e7d9bc]">

            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold capitalize">{ section.label }</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                {posts.map(post => (
                    <LibraryCard key={post.id} post={post} section={section} />
                ))}


            </div>

         
        </section>
    )
}

export default LibraryContent