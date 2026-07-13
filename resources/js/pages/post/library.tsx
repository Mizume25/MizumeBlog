import BlogLayout from '@/layouts/app/blog-layout'
import { Post } from '@/types'
import { useState } from 'react'
import LibraryHeader from '@/core/library/LibraryHeader';
import LibrarySideBarLeft from '@/core/library/LibrarySideBarLeft';
import LibraryContent from '@/core/library/LibraryContent';
import { Section, SECTION, Section_Content } from '@/types';


/**
 * 
 * @param 
 * @returns 
 */

export interface NavContentProps {
    section : Section_Content
    onSection: (label : Section) => void
}

export interface LibraryCardProps {
    post: Post,
    section: Section_Content
}


function Library({ posts }: { posts: Post[] }) {

    /** Secciones de estado */
    const [ section , setSection ] = useState<Section_Content>(SECTION[0]);


    /** Changes Section */
    const handleSection = (label : Section) => {

        section.active = false;

        const sec  = SECTION.find((p) => p.label == label);

        if(sec) setSection(sec);

        section.active = true;

        
    }
  
    return (
        <BlogLayout>
            
            <LibraryHeader onSection={handleSection}  section={section} />

            <main className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-260px)]">


                <LibrarySideBarLeft onSection={handleSection} section={section} />

                <LibraryContent posts={posts} section={section} />
                
            </main>


        </BlogLayout>

    )
}

export default Library