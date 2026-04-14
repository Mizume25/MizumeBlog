
import React from 'react';
import { type Post } from '@/types';
import { getRandomInt } from '@/lib/utils';
import HomePanelPost from './HomePanelPost';
//CONTENIDO GENERAL
function HomeContent({ mainPosts }: { mainPosts: Post[] | undefined}) {
    
    return (
        <div className="p-0 m-0 bg-transparent flex flex-col gap-[0px]">

            <HomePanelPost post={mainPosts ? mainPosts[0] : undefined} left={true} />

            <HomePanelPost post={mainPosts ? mainPosts[1] : undefined} left={false} />

            <HomePanelPost post={mainPosts ? mainPosts[2] : undefined} left={true} />

        </div>
    )
}

export default React.memo(HomeContent);