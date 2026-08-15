import { Artwork_Image } from '@/types';
import { useEffect, useState } from 'react';


export function useImageLogic(images: FileList | undefined) {
    const [imageAlts, setImageAlts] = useState<Artwork_Image[]>([]);

    
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

    const allCompleted =
        imageAlts.length > 0 && imageAlts.every((item) => item.alt.trim().length > 0);

    return { imageAlts, setAlt, allCompleted };
}