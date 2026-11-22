import { CreateWorkInput, CreateWorkOutput, WorkSchema } from "@/types";
import { Tag } from "@/types/definitions";
import { forwardRef } from "react";
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WORK_CREATE_TYPE } from "@/constants/work-create-constants";
import { WorkLangFields } from "@/core/desktop/forms/work-create-components";
/**
 * @inteface Propiedades props de edit y create
 */
interface WorkFormProps {
    DATA: WORK_CREATE_TYPE
    tags: Tag[];
    defaultValues?: Partial<CreateWorkInput>;
    onSubmit: SubmitHandler<CreateWorkOutput>;
    submitLabel?: string;
    processing?: boolean;
    cover_url?: string;
}

/**
 * @interface  Funcion de reset
 */
export interface WorkFormHandler {
    resetForm: () => void;
}



const WorkForm = forwardRef<WorkFormHandler, WorkFormProps>(({ tags, defaultValues, onSubmit, DATA, submitLabel = false, processing = false, cover_url }, ref) => {

    const {
        register,
        handleSubmit,
        formState: { errors, submitCount },
        control,
        setValue,
        reset,
        watch,
        getValues,
    } = useForm<CreateWorkInput, unknown, CreateWorkOutput>({
        resolver: zodResolver(WorkSchema),

        defaultValues: {
            title: { default: '', es: '', en: '' },
            sinopsi: { es: '', en: '' },
            ...defaultValues,
        },
    });


    return (
        <div className="bg-secondary text-secondary-foreground border-border/50 mx-auto rounded-lg border p-4 shadow-lg sm:p-8 w-full max-w-7xl h-full">
            <form onSubmit={handleSubmit(onSubmit, (errors) => console.log('Errores de validación:', errors))}>
                {/* Header del formulario */}
                <div className="w-full flex flex-row justify-start items-start gap-4 h-5 mb-10">
                    <h2 className="font-bold text-xl italic border-b-2">
                        {DATA.head}
                    </h2>
                </div>

                {/* Campos traducibles: título en default | es | en; sinopsis solo en es | en */}
                <WorkLangFields DATA={DATA} register={register} errors={errors} submitCount={submitCount} />



            </form>
        </div>
    )

})

export default WorkForm