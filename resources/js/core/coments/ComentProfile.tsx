import React from 'react'

/**
 * Avatar Indiviudal de Comentario
 * @param avatar string url de el avatar de usuario
 * @returns JXS
 */
function ComentProfile({ avatar } : { avatar : string | undefined}) {
    const userAvatar = avatar ? avatar : '/IMG/IconApp.png';
    return (
        <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full border-2 border-[#8b5e3c] overflow-hidden  flex items-center justify-center bg-slate-50"
                style={{
                    backgroundImage: `url(${userAvatar})`,
                    backgroundSize: 'cover'
                }}>

            </div>
        </div>
    )
}

export default ComentProfile