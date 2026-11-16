/**
 * panel/workshop/requests: pendiente de implementar.
 * Cuando exista, el controlador añadirá su prop igual que manage añade `posts`.
 */

import { Head } from "@inertiajs/react"
import { DATA_WORKSHOP } from "@/constants/workshop-constants"
import WorkShopLayout from "@/layouts/app/workshop-layout"
import { useLangStore } from "@/store/lang-store"
import { WorkShopRequestsProps } from "@/types/custom/workshop-types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WorkShopRequests(_: WorkShopRequestsProps) {

    const lang = useLangStore((l) => l.lang)

    return <Head title={DATA_WORKSHOP[lang].heads.requests} />
}

WorkShopRequests.layout = WorkShopLayout

export default WorkShopRequests
