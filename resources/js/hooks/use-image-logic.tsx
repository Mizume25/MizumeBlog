import { Artwork_Image } from '@/types';
import { useEffect, useState } from 'react';

export function useImageLogic(images: FileList | undefined) {
    const [imageAlts, setImageAlts] = useState<Artwork_Image[]>([]);

    
    
    const moveImage = (index: number, direction: -1 | 1) => {
        setImageAlts((prev) => {
            const newOrder = [...prev];
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= newOrder.length) return prev;
            [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
            return newOrder;
        });
    };

    useEffect(() => {
        const files = Array.from(images ?? []);
        setImageAlts(files.map((file) => ({ name: file.name, alt: '' })));
    }, [images]);

    const setAlt = (index: number, value: string) => {
        setImageAlts((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], alt: value };
            return updated;
        });
    };

    const allCompleted = imageAlts.length > 0 && imageAlts.every((item) => item.alt.trim().length > 0);

    return { imageAlts, setAlt, allCompleted, moveImage };
}
