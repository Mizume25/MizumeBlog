import { Post } from '@/types';
import LibraryCard from './LibraryCard';




function LibraryContent({ posts } : { posts: Post[]}) {
    return (
        <section className="flex-1 px-4 sm:px-10 py-8  bg-[#e7d9bc]">

            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold">Literatura</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                {posts.map(post => (
                    <LibraryCard key={post.id} post={post} />
                ))}


            </div>

            <button className="mt-8  text-xs  border-[#2B1D12] px-5 py-2.5 hover:bg-[#2B1D12] hover:text-[#EFE7D8] transition-colors">
                CARGAR MÁS →
            </button>
        </section>
    )
}

export default LibraryContent