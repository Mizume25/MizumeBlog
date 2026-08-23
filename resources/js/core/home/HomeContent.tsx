import React from 'react';
import { type Post } from '@/types';
import HomePanelPost from './HomePanelPost';

interface HomeContentProps {
    mainPosts: Post[],
    className: string,
    selectPost: number | null,
    position: string | null,
    edit: boolean
}
 
function HomeContent({mainPosts , className , selectPost, position, edit} : HomeContentProps) {
    return (
        /** Es izquierdo los post pares */
        <div className={`p-0 m-0 bg-transparent flex flex-col flex-1 ${className} gap-[0px] order-1`}>
            {mainPosts?.map((post, index) => (
                <HomePanelPost
                    key={post.id}
                    post={post}
                    left={index % 2 === 0}
                    selectPost={selectPost}
                    position={position}
                    edit={edit}
                />
            ))}
        </div>
    );
}
 
export default React.memo(HomeContent);