import React, { useEffect } from 'react'
import ComentProfile from './ComentProfile'
import ComentText from './ComentText'
import ReplyContent from './ReplyContent';
import { type CommentRecord , type Reply } from '@/types'

function ComentContent({ coments }: { coments: CommentRecord[] }) {



    const listComments = (coments: CommentRecord[]) => {
        return (
            <>
                {coments.map((comment) => {

                    return (
                        <div key={comment.id} className="space-y-2">
                            <div className="flex gap-4 p-4 rounded-md bg-[#3d2b1f] hover:bg-[#4a3728] transition-colors duration-300 border border-[#4a3728]/50">


                                <ComentProfile avatar={comment.user.avatar} />

                                <ComentText coment={comment} />
                            </div>

                            {/* Mapeo de Respuestas (Replies) */}
                            {comment.replies && comment.replies.length > 0 &&

                                (
                                    <div className="ml-12 space-y-2">
                                        {comment.replies.map((reply: Reply) => (
                                            <ReplyContent
                                                key={reply.id}
                                                answer={reply}
                                            />
                                        ))}
                                    </div>
                                )}
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <div className="space-y-6 mb-10" id='contentForm'>
            {listComments(coments)}
        </div>
    );
}

export default ComentContent;