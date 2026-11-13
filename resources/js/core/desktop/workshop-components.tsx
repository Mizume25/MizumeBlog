/**
 * @fileoverview Componentes workshop
 */

import { Lang } from "@/store/lang-store"
import { label } from "motion/react-client"
import { InfoProgresBar } from "../admin"

interface WorkShopProps {
    totalPosts: number,
    totalComments: number,
    lang: Lang
}


const WORKSHOPTEXT = {
    es: {
        post: "Todas las Publicaciones",
        comments: "Todos los Comentarios"
    },
    en: {
        post: "All Posts",
        comments: "All Comments"
    }
}



export const WorkShopHeader = () => {
    return (
        <div className="h-20 max-w-8xl bg-mizume-primary p-4 grid grid-cols-1 max-md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl">

            <div className="bg-accent-foreground text-accent rounded-xl hidden lg:flex flex-col items-center justify-center ">
                Manage
            </div>

            <div className="bg-muted-foreground text-muted rounded-xl hidden lg:flex flex-col items-center justify-center">
                Posts
            </div>
            <div className="bg-muted-foreground text-muted rounded-xl hidden lg:flex flex-col items-center justify-center">
                Reports
            </div>
            <div className="bg-muted-foreground text-muted rounded-xl hidden lg:flex flex-col items-center justify-center">
                Solicitudes
            </div>

            <div className="col-span-full bg-muted-foreground text-muted rounded-xl flex lg:hidden flex-col items-center justify-center">
                SELECT
            </div>

        </div>
    )
}




interface WorkShopMainProps {
    children: React.ReactNode
}

export const WorkShopMain = ({ children } : WorkShopMainProps) => {
    return (
        <div className="bg-mizume-primary relative min-h-screen w-full rounded-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 content-start items-start gap-4">
            {children}
        </div>
    )
}


