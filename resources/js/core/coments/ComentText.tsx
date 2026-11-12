import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { useState } from 'react';
import ReplyBTN from './ReplyBTN';
import ReplyComent from './ReplyComent';
import EditComent from './EditComent';
import { CommentRecord } from '@/types/definitions';

interface ComentTextProps {
    coment: CommentRecord,
    onDelete: (id: number) => Promise<void>,
    onCreate: (body: string, parent_id?: number | null) => Promise<void>,
    onUpdate: (id: number, body: string) => Promise<void>,
}

function ComentText({ coment, onDelete, onCreate, onUpdate }: ComentTextProps) {
    const { auth } = usePage<SharedData>().props;

    /** Solo el autor puede editar (el backend también lo comprueba) */
    const isOwner = auth.user.id == coment.user.id;

    const [editing, setEditing] = useState(false);


    const handleDelete = () => {
        onDelete(coment.id);
    };



    const [reply, setreply] = useState(false);

    const openReply = () => {
        setreply(prev => !prev);
    };

    const closeReply = () => {
        setreply(false)
    }

    /** La respuesta cuelga de este comentario */
    const onReply = (body: string) => onCreate(body, coment.id);


   


    return (
        <div className="flex-grow" key={coment.user.id} >
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-card-header">{coment.user.name}</h4>

                <span className="text-xs text-header-muted">{coment.publish_date}</span>
            </div>
            {editing ? (
                <EditComent
                    initial={coment.description}
                    closeEdit={() => setEditing(false)}
                    onSave={(body) => onUpdate(coment.id, body)}
                />
            ) : (
                <p className="text-sm leading-relaxed text-md-muted">
                    {coment.description}
                </p>
            )}

            {auth.user.id != coment.user.id && (
                <ReplyBTN openAnswer={openReply} />
            )} 

            {reply && (
                <ReplyComent closeReply={closeReply} onReply={onReply} />
            )}




            {(isOwner || auth.user.role == 'admin') && !editing && (
                <div className="flex justify-start gap-2 mt-2">
                    {isOwner && (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-4 py-1 border-2 border-card-header text-card-header hover:bg-card-header hover:text-card-header-foreground text-xs font-bold rounded-md transition-colors cursor-pointer"
                        >
                            Editar
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="px-4 py-1 border-2 border-btn-danger text-btn-danger hover:bg-btn-danger hover:text-btn-danger-foreground text-xs font-bold rounded-md transition-colors cursor-pointer"
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    )
}

export default ComentText