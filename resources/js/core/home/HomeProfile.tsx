import React, { useMemo } from "react";

interface AvatarProps {
    name?: string;
}

// Genera un color de fondo único pero consistente según el nombre
function getColorFromName(name: string): string {
    const palette = [
        "#7B3F00",
        "#5C4033", 
        "#4A235A", 
        "#1A5276", 
        "#1D6A39", 
        "#784212", 
        "#6E2C00", 
        "#212F3C", 
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
}

function HomeProfile({ name }: AvatarProps) {
    const initial = useMemo(() => {
        if (!name) return "?";
        return name.trim().charAt(0).toUpperCase();
    }, [name]);

    const bgColor = useMemo(() => {
        if (!name) return "#3D1F08";
        return getColorFromName(name);
    }, [name]);

    return (
        <div
            className="mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] flex items-center justify-center select-none"
            style={{ backgroundColor: bgColor }}
        >
            <span
                className="text-white font-bold"
                style={{ fontSize: "56px", lineHeight: 1 }}
            >
                {initial}
            </span>
        </div>
    );
}

export default React.memo(HomeProfile);