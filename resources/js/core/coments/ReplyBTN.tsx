import React from 'react'
function ReplyBTN({ openAnswer } : { openAnswer: () => void }) {

    const handleButton = (e:React.MouseEvent<HTMLButtonElement>) => openAnswer();
    
    return (
        <button
            onClick={handleButton}
            className="text-btn-info hover:text-btn-info/80 text-xs font-semibold transition-colors cursor-pointer"
        >
            Responder
        </button>
    )
}

export default ReplyBTN