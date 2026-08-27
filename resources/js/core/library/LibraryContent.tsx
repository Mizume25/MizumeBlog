import { BackgroundPositionKeywordCard, Post } from '@/types';
import LibraryCard from './LibraryCard';
import { Section_Content } from '@/types';

interface LibraryContentProps {
    posts: Post[],
    section: Section_Content,
    edit: boolean,
    onID: (id: number) => void
    position: BackgroundPositionKeywordCard | null
    selectPost: Post,
}


function LibraryContent({posts , section , edit, onID, position  , selectPost} : LibraryContentProps) {
    return (
        <section className="flex-1 px-4 sm:px-10 py-8  bg-[#e7d9bc]">

            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold capitalize">{ section.label }</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                {posts.map(post => (
                    <LibraryCard key={post.id} post={post} section={section} edit={edit} onID={onID} position={position} selectPost={selectPost}/>
                ))}


            </div>

         
        </section>
    )
}

export default LibraryContent