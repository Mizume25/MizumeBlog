import { WORK_CREATE } from "@/constants/work-create-constants"
import WorkForm, { WorkFormHandler } from "@/core/forms/work-form"
import useWorkCreate from "@/hooks/custom/forms/use-works-create"
import { BlogLayout } from "@/layouts/app"
import { useLangStore } from "@/store/lang-store"
import { CreateWorkOutput, Route } from "@/types"
import { Tag } from "@/types/definitions"
import { Head } from "@inertiajs/react"
import { label } from "motion/react-client"
import { useRef } from "react"
import { useStore } from "zustand"


interface WorkCreateProps {
    tags: Tag[]
}

const routes: Route[] = [
    {
        label: "Workshop",
        url: route("panel.workshop")
    },
    {
        label: "Publicaciones",
        url: route("panel.workshop.posts"),
    },
    {
        label: "Create Work",
        url: route("works.create")
    }
]



function WorkCreate({ ...props} : WorkCreateProps) {


    const { tags } = props

     const { formRef } = useWorkCreate();

    const lang = useLangStore((l) => l.lang);


    const DATA = WORK_CREATE[lang]

   


    const handleCreate = (data: CreateWorkOutput) => console.log("hola")




    return (
        <BlogLayout routes={routes}>
            <Head title={DATA.head} />
            <WorkForm ref={formRef} tags={tags} onSubmit={handleCreate}  submitLabel={DATA.head} DATA={DATA} />
        </BlogLayout>
    )
}

export default WorkCreate