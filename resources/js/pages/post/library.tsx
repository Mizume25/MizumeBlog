import BlogLayout from '@/layouts/app/blog-layout'
import { Post } from '@/types'
import React, { useEffect, useState } from 'react'
import { getFormatoPost, Formato } from '@/types/utils';
import { Tag } from 'lucide-react';
import LibraryHeader from '@/core/library/LibraryHeader';
import LibrarySideBarLeft from '@/core/library/LibrarySideBarLeft';
import LibraryContent from '@/core/library/LibraryContent';



function Library({ posts }: { posts: Post[] }) {

 
  
    return (
        <BlogLayout>
            
            <LibraryHeader />

            <main className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-260px)]">


                <LibrarySideBarLeft />

                <LibraryContent posts={posts} />
                
            </main>


        </BlogLayout>

    )
}

export default Library