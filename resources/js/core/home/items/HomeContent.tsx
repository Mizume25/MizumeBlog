
import { type Post } from '@/types';
import { getRandomInt } from '@/lib/utils';
import HomePanelPost from './HomePanelPost';
//CONTENIDO GENERAL
function HomeContent({ featured }: { featured: Post[] | undefined}) {

    return (
        <div className="p-0 m-0 bg-transparent flex flex-col gap-[0px]">

            <HomePanelPost post={featured ? featured[0] : undefined} left={true} />

            <HomePanelPost post={featured ? featured[1] : undefined} left={false} />

            <HomePanelPost post={featured ? featured[2] : undefined} left={true} />

        </div>
    )
}

export default HomeContent