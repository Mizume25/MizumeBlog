import React from 'react'

function ReplyBTN({ openAnswer } : { openAnswer: () => void }) {

    const handleButton = (e:React.MouseEvent<HTMLButtonElement>) => {
        openAnswer();
    }

    return (
        <button
            onClick={handleButton}
            className="text-blue-500 hover:text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
        >
            Responder
        </button>
    )
}

export default ReplyBTN