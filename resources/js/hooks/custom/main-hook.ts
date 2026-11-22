import { WorkRecord } from "@/types/definitions";
import { useCallback, useState } from "react";

/**
 * Obra seleccionada en el carrusel de la home.
 *
 * Se guarda el id, no el objeto: al cambiar de idioma router.reload() trae `works` traducidos
 * y la obra seleccionada se vuelve a leer de las props (si se guardara el objeto, quedaría en
 * el idioma anterior). Si la obra deja de estar en la home, se cae a la primera.
 */
export function useMainHook(works: WorkRecord[]) {

    const [selectedId, setSelectedId] = useState<number | null>(works[0]?.id ?? null);

    const work: WorkRecord | null = works.find((w) => w.id === selectedId) ?? works[0] ?? null;

    const changeWork = useCallback((newWork: WorkRecord) => {
        setSelectedId(newWork.id);
    }, []);

    return {
        work,
        changeWork
    }
}
