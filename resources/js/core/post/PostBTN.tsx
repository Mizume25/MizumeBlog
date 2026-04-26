import React from 'react'

function PostBTN({ onButtonClick }: { onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }) {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onButtonClick?.(e);
    };

    return (
        <button
            onClick={handleClick}
            className="lg:hidden fixed top-[58px] sm:top-[42px] right-2 z-40 bg-[#754C22] p-2.5 rounded-lg shadow-lg border border-white/20 active:scale-95 transition-all cursor-pointer">
            <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-white"></span>
                <span className="block w-5 h-0.5 bg-white"></span>
                <span className="block w-5 h-0.5 bg-white"></span>
            </div>
        </button>
    )
}

export default PostBTN