import React from 'react';
import { type Post } from '@/types';
import HomePanelPost from './HomePanelPost';
 
function HomeContent({ mainPosts }: { mainPosts: Post[] | undefined }) {
    return (
        <div className="p-0 m-0 bg-transparent flex flex-col gap-[0px]">
            {mainPosts?.map((post, index) => (
                <HomePanelPost
                    key={post.id}
                    post={post}
                    left={index % 2 === 0}
                />
            ))}
        </div>
    );
}
 
export default React.memo(HomeContent);