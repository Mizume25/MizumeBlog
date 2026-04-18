import { Comentario } from '@/types'
import React, { useEffect, useState } from 'react'

function ComentsTitle({ coments }:{ coments: Comentario[]}) {  

    return (
        <h3 className="text-2xl font-semibold mb-8 border-b border-[#4a3728] pb-2  text-[#d4a373]">
            Comentarios ({coments.length})
        </h3>
    )
}

export default ComentsTitle