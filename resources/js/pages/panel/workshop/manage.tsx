/**
 * panel/workshop/manage: resumen de actividad del editor / administrador
 */

import { Head } from "@inertiajs/react"
import { InfoCurrentActivity, InfoLastPost, InfoProgresBar, InfoTagsContent, InfoWritingRhythm } from "@/blocs/bloc-info"
import { WorkShopMain } from "@/core/desktop/workshop-components"
import { DATA_WORKSHOP } from "@/constants/workshop-constants"
import WorkShopLayout from "@/layouts/app/workshop-layout"
import { useLangStore } from "@/store/lang-store"
import { WorkShopManageProps } from "@/types/custom/workshop-types"

function WorkShopManage({ posts }: WorkShopManageProps) {

    const lang = useLangStore((l) => l.lang)

    return (
        <>
            <Head title={DATA_WORKSHOP[lang].heads.manage} />
            <WorkShopMain>
                <div className="w-full min-h-25 gap-4 flex flex-col justify-start items-center">
                    <InfoProgresBar posts={posts} lang={lang} />
                    <InfoTagsContent posts={posts} lang={lang} />
                    <InfoLastPost posts={posts} lang={lang} />
                </div>
                <div className="w-full min-h-25 gap-4 flex flex-col justify-start items-center">
                    <InfoCurrentActivity posts={posts} lang={lang} />
                    <InfoWritingRhythm posts={posts} lang={lang} months={3} />
                </div>

                <div className="w-full min-h-25">
                    {/* Reports */}
                </div>
            </WorkShopMain>
        </>
    )
}

WorkShopManage.layout = WorkShopLayout

export default WorkShopManage
