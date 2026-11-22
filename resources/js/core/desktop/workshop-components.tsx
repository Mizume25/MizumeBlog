/**
 * @fileoverview Componentes workshop
 */

import { BlocSelectTabs, BlocTabs } from "@/blocs/bloc-manage-info"
import { Button } from "@/components/animate-ui/components/buttons/button"
import { WORKSHOP_TABS } from "@/constants/workshop-constants"
import { Lang } from "@/store/lang-store"
import { WorkShopTab } from "@/types/custom/workshop-types"
import { router } from "@inertiajs/react"

interface WorkShopHeaderProps {
    /** Etiqueta traducida de cada pestaña */
    labels: Record<WorkShopTab, string>
    /** Pestaña activa (la decide el layout a partir de la página) */
    value: WorkShopTab
    onChange: (tab: WorkShopTab) => void
    /** Número representativo de cada pestaña */
    counts?: Partial<Record<WorkShopTab, number>>
}

/**
 * Cabecera de pestañas del taller: BlocTabs en escritorio, select en móvil.
 * Controlada: el layout es quien navega al cambiar de pestaña.
 */
export const WorkShopHeader = ({ labels, value, onChange, counts }: WorkShopHeaderProps) => {
    return (
        <div className="h-20 w-full bg-mizume-primary p-4 rounded-2xl ">
            <BlocTabs
                className="hidden md:block h-full bg-card rounded-sm font-bold "
                tabClassName="text-card-foreground"
                indicatorClassName="bg-card-foreground"
                tabs={WORKSHOP_TABS}
                labels={labels}
                value={value}
                onChange={onChange}
                badges={counts}
            />

            <BlocSelectTabs
                className="md:hidden h-full flex items-center"
                tabs={WORKSHOP_TABS}
                labels={labels}
                value={value}
                onChange={onChange}
                badges={counts}
            />

        </div>
    )
}




interface WorkShopMainProps {
    children: React.ReactNode
}

export const WorkShopMain = ({ children }: WorkShopMainProps) => {
    return (
        <div className="bg-mizume-primary relative min-h-screen w-full rounded-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 content-start items-start gap-4">
            {children}
        </div>
    )
}

interface WorkShopPostsMainProps {
    children: React.ReactNode
}

export const WorkShopPostsMain = ({ children }: WorkShopPostsMainProps) => {
    return (
        <div className="bg-mizume-primary relative min-h-screen w-full rounded-2xl p-4 lg:p-8 content-start items-start gap-4">
            {children}
        </div>
    )
}

interface WorkShopPostActions {
    lang: Lang
}

export const WorkShopPostActions = ({ lang }: WorkShopPostActions) => {

    const ACTIONS = {
        es: {
            actions: [
                {
                    label: "Publicacion +",
                    url: "#"
                },
                {
                    label: "Obra +",
                    url: route("works.create")
                },
                {
                    label: "Autor +",
                    url: "#"
                }
            ]
        },
        en: {
            actions: [
                {
                    label: "Posts +",
                    url: "#"
                },
                {
                    label: "Work +",
                    url: route("works.create")
                },
                {
                    label: "Author +",
                    url: "#"
                }
            ]
        }
    }


    const DATA = ACTIONS[lang]


    return DATA.actions.map((a, i) => (
        <Button
            key={i}
            variant="default"
            onClick={() => router.get(a.url)}
            className="h-full min-h-15 w-full cursor-pointer bg-mizume-secondary text-mizume-tertiary hover:bg-mizume-fourthary"
        >
            {a.label}
        </Button>
    ))
}



