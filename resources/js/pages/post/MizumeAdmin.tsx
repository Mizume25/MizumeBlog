import { useState } from 'react';
import { Post, Data, Section, SECTION, Section_Content } from '@/types';
import {
  InfoPanel,
  InfoTable,
  InfoProgresBar,
  InfoNav,
} from '../../core/admin';
import BlogLayout from '@/layouts/app/blog-layout';


function InfoSideBarRight({ posts }: { posts: Post[] }) {
  return (
    <div className="bg-white border border-[#EAD9B8] rounded-xl shadow-sm">
      <div className="px-5 py-4 border-b border-[#EAD9B8]">
        <h3 className=" text-[#3B2314]">Actividad reciente</h3>
      </div>
      <div className="p-1 capitalize">
        {posts.map((act, i) => (
          <div key={i} className="flex gap-3 p-3 border-b border-[#EAD9B8]/40 last:border-0">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 bg-green-600`}></div>
            <div>
              <p className="text-xs text-[#4A3020] leading-snug">{act.title}</p>
              <p className="text-[10px] text-gray-400 italic">{act.publish_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}





const MizumeAdmin = ({ data }: { data: Data }) => {


  /*** Secciones */
  const [section, setSection] = useState<Section_Content>(SECTION[0]);



  /** Changes Section */
  /** Changes Section */
    const handleSection = (label : Section) => {
        console.log(label)
        section.active = false;

        const sec  = SECTION.find((p) => p.label == label);

        if(sec) setSection(sec);

        section.active = true;

        
    }

  return (
    <BlogLayout>
      <div className="flex min-h-screen bg-[#F5EDD8] text-[#1C1008]">
        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 ml-0  flex flex-col min-w-0">
        <InfoNav />


          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
            <InfoPanel data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* POST TABLE */}
              <InfoTable posts={data.posts} section={section} onSection={handleSection} />

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* ACTIVITY */}
                <InfoSideBarRight posts={data.posts.slice(0, 3)} />

                {/* PROGRESS STATS */}
                <InfoProgresBar posts={data.posts} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </BlogLayout>
  );
};

export default MizumeAdmin;