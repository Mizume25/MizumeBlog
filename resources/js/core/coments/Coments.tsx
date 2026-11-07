import { type CommentRecord } from '@/types/definitions';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { ComentForm, ComentContent } from './index'
import Loading from '@/components/ui/loading';



interface ComentsProps {
    coments: CommentRecord[],
    loading?: boolean,
    error?: string | null,
    /** Crea un comentario (parent_id para respuestas). Debe lanzar si falla */
    onCreate: (body: string, parent_id?: number | null) => Promise<void>,
    onDelete: (id: number) => Promise<void>,
    /** Edita el texto de un comentario o respuesta. Debe lanzar si falla */
    onUpdate: (id: number, body: string) => Promise<void>,
}

/*** MAIN */
function Coments({ coments, loading = false, error = null, onCreate, onDelete, onUpdate }: ComentsProps) {
    const { auth } = usePage<SharedData>().props;
    return (
        <section id='comentarios' className="mt-12 lg:col-start-4 lg:col-span-6 bg-[#2c1e17] text-[#f3e5ab] p-8 rounded-lg shadow-2xl border border-[#4a3728] mx-auto max-w w-full">

            {/*** Titulo de la Seccción */}
            <h3 className="text-2xl font-semibold mb-8 border-b border-[#4a3728] pb-2  text-[#d4a373]">
                Comentarios {auth?.user ? (coments.length) : ("")}
            </h3>


            {auth?.user ? (
                <>
                    {error && (
                        <div className="mb-4 text-sm text-red-400">{error}</div>
                    )}

                    {coments.length != 0 ? (

                        <ComentContent coments={coments} onDelete={onDelete} onCreate={onCreate} onUpdate={onUpdate} />


                    ) : loading ? (
                        <div className="flex justify-center p-4 text-[#8b5e3c]">
                            <Loading className='w-full h-full flex flex-col items-center justify-center' text='Loading . . .' textStyles='text-2xl text-mizume-secondary-foreground' />
                        </div>
                    ) : (
                        <div className="flex justify-center gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">
                            <span> ¡Se el primero en comentar! </span>
                        </div>
                    )}

                    <ComentForm onCreate={onCreate} />

                </>

            ) : (
                <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">
                    <span> Si quieres ver los comentarios, registrate !</span>
                </div>

            )}




        </section>
    )
}

export default Coments