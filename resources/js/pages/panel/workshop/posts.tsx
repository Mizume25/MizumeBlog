/**
 * panel/workshop/posts: pendiente de implementar.
 * Cuando exista, el controlador añadirá su prop igual que manage añade `posts`.
 */

import { Head } from "@inertiajs/react"
import { DATA_WORKSHOP } from "@/constants/workshop-constants"
import WorkShopLayout from "@/layouts/app/workshop-layout"
import { useLangStore } from "@/store/lang-store"
import { WorkShopPostsProps } from "@/types/custom/workshop-types"
import { WorkShopPostActions, WorkShopPostsMain } from "@/core/desktop/workshop-components"
import { InfoPanel, InfoTable } from "@/blocs/bloc-info"
import { Pagination } from "@/components/paginator"
import { PaginatedText } from "@/lib/utils"
import WorkShopPostHok from "@/hooks/custom/use-workshoppost"




// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WorkShopPosts({ paginated , stats, filter }: WorkShopPostsProps) {

    const lang = useLangStore((l) => l.lang)

    const DATA = DATA_WORKSHOP[lang]

    const { search , setSearch, onFilter, postTab , setPostTab , onReset} = WorkShopPostHok(filter)

    return (
        <>
            <Head title={DATA.heads.posts} />
            <WorkShopPostsMain >
                <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-stretch mb-5">
                    {/* Métricas: ocupan el espacio disponible */}
                    <div className="min-w-0 flex-1">
                        <InfoPanel stats={stats} lang={lang} />
                    </div>

                    {/* Acciones: 3 columnas, con la misma altura que las tarjetas */}
                    <div className="grid grid-cols-3 gap-4 xl:w-md">
                        <WorkShopPostActions lang={lang} />
                    </div>
                </div>

                <div className="w-full flex flex-col gap-4 bg-mizume-secondary p-5 rounded-2xl">
                    <InfoTable lang={lang} posts={paginated.data} TEXT={DATA}  onFilter={onFilter} search={search} setSearch={setSearch} postTab={postTab} setPostTab={setPostTab} onReset={onReset}  />

                    <div>
                        <Pagination
                            prevUrl={paginated.prev_page_url}
                            nextUrl={paginated.next_page_url}
                            current={paginated.current_page}
                            last={paginated.last_page}
                            labels={PaginatedText[lang]}
                            spanClass='text-sm font-bold text-mizume-secondary-foreground'
                            
                        />
                    </div>
                </div>
            </WorkShopPostsMain>
        </>
    )
}

WorkShopPosts.layout = WorkShopLayout

export default WorkShopPosts
