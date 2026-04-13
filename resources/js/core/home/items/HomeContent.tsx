
import { type Post } from '@/types';
import { getRandomInt } from '@/lib/utils';
import HomePanelPost from './HomePanelPost';
//CONTENIDO GENERAL
function HomeContent({ featured }: { featured: Post[]}) {

    return (
        <div className="p-0 m-0 bg-transparent flex flex-col gap-[0px]">

            <HomePanelPost post={featured[0]} left={true} />

            <HomePanelPost post={featured[1]} left={false} />

            <HomePanelPost post={featured[2]} left={true} />

        </div>
    )
}

export default HomeContent