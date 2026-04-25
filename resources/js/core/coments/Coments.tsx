import ComentsTitle from './ComentsTitle'
import ComentContent from './ComentContent'
import ComentForm from './ComentForm'
import { Comentario, User } from '@/types'
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';


function Coments({ coments, post_id, users }: { coments: Comentario[], post_id: number,users:User[] }) {
    const { auth } = usePage<SharedData>().props;
    return (
       <section className="mt-12 lg:col-start-4 lg:col-span-6 bg-[#2c1e17] text-[#f3e5ab] p-8 rounded-lg shadow-2xl border border-[#4a3728] mx-auto max-w w-full">
            <ComentsTitle coments={coments} />


            {auth?.user ? (
                <>
                {coments.length != 0 ? (

                        <ComentContent coments={coments} users={users}/>
                        

                    ) : (
                    <div className="flex justify-center gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">
                        <span> ¡Se el primero en comentar! </span>
                    </div>
                )}

                <ComentForm post_id={post_id}/>

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