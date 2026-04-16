

import { type RandPost, getPosts} from "@/types/utils"
import PostProfile from "./PostProfile"




//Indice de contenido
 function PostSideBarRight({id} : {id:number}) {

    return (
        <aside className="lg:col-span-3 space-y-6 sticky top-6 h-fit">

           <PostProfile />

            {/* POSTS DESTACADOS */}
            <div className="bg-[#EDEDED] p-6 rounded-xl shadow-lg">

                <h4 className="text-[#2A1B12] text-lg font-semibold mb-5">
                    Artículos / Post Destacados
                </h4>

                <ul className="space-y-4 text-[#555]">
                 
                    

                </ul>
            </div>

        </aside>
    )
}

export default PostSideBarRight