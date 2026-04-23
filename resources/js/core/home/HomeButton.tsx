import React from "react";

function HomeButton({ onButtonClick }: { onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }) {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onButtonClick?.(e);
    };

    return (
        <button
            onClick={handleClick}
            className="lg:hidden fixed top-[62px] right-4 z-50 bg-[#3D1F08] p-3 rounded shadow-lg border border-white/20 active:scale-95 transition-all cursor-pointer"
        >
            <div className="space-y-1.5">
                <span className="block w-6 h-0.5 bg-white"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
            </div>
        </button>
    );
}

export default React.memo(HomeButton);