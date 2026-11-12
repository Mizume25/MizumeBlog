import { Head } from "@inertiajs/react"
import WorkShowLayout from "@/layouts/app/work-show-layout"
import { useLangStore } from "@/store/lang-store"
import { DATA_WORK_SHOW } from "@/constants/work-show-constants"
import { WorkShowReportsProps } from "@/types/custom/work-show-types"

/**
 * works/show/reports: pendiente de implementar.
 * Cuando exista, el controlador añadirá su prop (p. ej. `reports`) igual que comments.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WorkShowReports(_: WorkShowReportsProps) {

  const lang = useLangStore((l) => l.lang)

  return <Head title={DATA_WORK_SHOW[lang].heads.reports} />
}

WorkShowReports.layout = WorkShowLayout

export default WorkShowReports
