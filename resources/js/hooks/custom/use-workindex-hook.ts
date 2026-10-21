import { WorkRecord } from "@/types/definitions";
import { useDeferredValue, useMemo, useState } from "react";
import MiniSearch from "minisearch";
import { MEDIUM_VALUES_TYPE, NAV_VALUES_TYPE } from "@/types/custom/work-index-types"
import { DATA_WORK_INDEX_TYPE } from "@/constants/work-index-constants";




/**
 * Hook de funcio Principal del hook 
 */
export function useWorkIndex(works: WorkRecord[], DATA: DATA_WORK_INDEX_TYPE) {

    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);

    // Los valores de categoría y medio no dependen del idioma, así que el filtro se mantiene al cambiarlo
    const [category, setCategory] = useState<NAV_VALUES_TYPE>(DATA.NAV_VALUES[0]);

    const [medium, setMedium] = useState<MEDIUM_VALUES_TYPE>(DATA.SELECT_VALUES[0]);

    const [selectTag, setSelectTag] = useState<number[]>([]);

    // Opciones del select derivadas de la categoría actual
    const select = useMemo<MEDIUM_VALUES_TYPE[]>(() => {
        if (category === "todos") return DATA.SELECT_VALUES;
        if (category === "literatura") return DATA.LITERATURA_VALUES;
        return DATA.ANIMEMANGA_VALUES;
    }, [category, DATA]);



    const mini = useMemo(() => {
        const m = new MiniSearch<WorkRecord>({
            idField: "id",
            fields: ["title", "authors"],
            extractField: (w, field) =>
                field === "authors"
                    ? w.authors
                        .map((a) => [a.name, a.last_name, a.pseudonym].filter(Boolean).join(" "))
                        .join(" ")
                    : (w as Record<string, any>)[field],
            processTerm: (t) =>
                t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
            searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
        });
        m.addAll(works);
        return m;
    }, [works]);

    const WORKS = useMemo(() => {

        const noneCategory = category === "todos";
        const noneMedium = medium === "todos";
        const noneTag = selectTag.length === 0;
        const q = deferredQuery.trim();
        const ids = q ? new Set(mini.search(q).map((r) => r.id)) : null;

        if (!ids && noneCategory && noneMedium && noneTag) return works;

        return works.filter(
            (w) =>
                (!ids || ids.has(w.id)) &&
                (noneCategory || w.category === category) &&
                (noneMedium || w.medium === medium) &&
                (noneTag || selectTag.every((id) => w.tags.some((t) => t.id === id)))
        );
    }, [works, category, medium, deferredQuery, mini, selectTag]);


    const filterCategory = (c: NAV_VALUES_TYPE) => {
        setCategory(c);
        setMedium(DATA.SELECT_VALUES[0]);
    };

    const filterMedium = (m: MEDIUM_VALUES_TYPE) => setMedium(m);

    const onTag = (id: number, checked: boolean) => {
        setSelectTag((prev) =>
            checked ? [...prev, id] : prev.filter((t) => t !== id)
        );
    }

    return {
        WORKS,
        medium,
        category,
        select,
        filterCategory,
        filterMedium,
        query,
        setQuery,
        selectTag,
        onTag
    }


}