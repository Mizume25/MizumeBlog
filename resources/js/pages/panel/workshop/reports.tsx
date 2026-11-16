/**
 * panel/workshop/reports: pendiente de implementar.
 * Cuando exista, el controlador añadirá su prop igual que manage añade `posts`.
 */

import { Head } from "@inertiajs/react"
import { DATA_WORKSHOP } from "@/constants/workshop-constants"
import WorkShopLayout from "@/layouts/app/workshop-layout"
import { useLangStore } from "@/store/lang-store"
import { WorkShopReportsProps } from "@/types/custom/workshop-types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WorkShopReports(_: WorkShopReportsProps) {

    const lang = useLangStore((l) => l.lang)

    return <Head title={DATA_WORKSHOP[lang].heads.reports} />
}

WorkShopReports.layout = WorkShopLayout

export default WorkShopReports
