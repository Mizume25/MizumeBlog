/** 
 * Zona de trabajo de usuarios Editores y Administradores
*/

import { InfoCurrentActivity, InfoLastPost, InfoProgresBar, InfoTagsContent, InfoWritingRhythm } from "@/blocs/bloc-info"
import { WorkShopHeader, WorkShopMain } from "@/core/desktop/workshop-components"
import { BlogLayout } from "@/layouts/app"
import { useLangStore } from "@/store/lang-store"
import { Route } from "@/types"
import { PostRecord, User } from "@/types/definitions"


const routes : Route [] = [
    {
        label:"Workshop",
        url:route("panel.workshop")
    }
]

interface WorkShopProps {
    data: {
        user: User,
        posts: PostRecord[]
    }
}

function WorkShop({ data } : WorkShopProps) {

    const lang = useLangStore((l) => l.lang)
    console.log(data)
  return (
    <BlogLayout  routes={routes}>

            <WorkShopHeader />
            <WorkShopMain>
                <div className="w-full min-h-25 gap-4 flex flex-col justify-start items-center">
                    <InfoProgresBar posts={data.posts} lang={lang} />
                    <InfoTagsContent posts={data.posts} lang={lang} />
                    <InfoLastPost posts={data.posts} lang={lang} />
                </div>
                <div className="w-full min-h-25 gap-4 flex flex-col justify-start items-center">
                    <InfoCurrentActivity posts={data.posts} lang={lang} />
                    <InfoWritingRhythm posts={data.posts} lang={lang} months={3}   />
                </div>

                <div className="w-full min-h-25">
                    
                </div>
            </WorkShopMain>
    </BlogLayout>
  )
}

export default WorkShop