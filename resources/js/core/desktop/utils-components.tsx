import React, { useMemo } from "react";

interface AvatarProps {
    name?: string;
}


function getColorFromName(name: string): string {
    const palette = [
        // Rojos 
        "#B91C1C", 
        "#BE123C", 
        "#BE185D", 
        "#A21CAF", 

        // Naranjas 
        "#C2410C", 
        "#B45309", 
        "#7B3F00", 

        // Verdes
        "#4D7C0F", 
        "#15803D", 
        "#1D6A39", 
        "#047857", 

        // Azules 
        "#0F766E", 
        "#0E7490", 
        "#0369A1", 
        "#1D4ED8", 
        "#1A5276", 

        // Violetas
        "#4338CA", 
        "#6D28D9", 
        "#7E22CE", 
        "#4A235A", 

        // Neutros
        "#5C4033", 
        "#334155",
        "#212F3C", 
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
}

export function BlogProfile ({ name }: AvatarProps) {

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
            className="mx-auto w-10 h-10 rounded-full border-[3px] border-[#C4A484] flex items-center justify-center select-none"
            style={{ backgroundColor: bgColor }}
        >
            <span
                className="text-white font-bold"
                style={{ fontSize: "14px", lineHeight: 1 }}
            >
                {initial}
            </span>
        </div>
    );
}

