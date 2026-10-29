import { WorkRecord } from "@/types/definitions";
import { useMemo, useState } from "react";
import { CategorySelect, MEDIUM_VALUES_TYPE, WorkFilters, WorkOrder } from "@/types/custom/work-index-types"
import { DATA_WORK_INDEX_TYPE } from "@/constants/work-index-constants";
import { router } from "@inertiajs/react";




/**
 * Hook de funcio Principal del hook
 */
export function useWorkIndex(works: WorkRecord[], DATA: DATA_WORK_INDEX_TYPE, filters: WorkFilters) {


    const [category, setCategory] = useState<CategorySelect>((filters.category ?? DATA.values.category) as CategorySelect)

    const [medium, setMedium] = useState<MEDIUM_VALUES_TYPE>(filters.medium ?? "todos");

    const [search , setSearch] = useState(filters.search ?? "");

    /** Opciones de medium disponibles según la categoría */
    const getMediumOptions = (c: CategorySelect) =>
        c === "literatura" ? DATA.LITERATURA_VALUES
            : c === "animemanga" ? DATA.ANIMEMANGA_VALUES
                : DATA.SELECT_VALUES;

    const mediumOptions = getMediumOptions(category);

    const [selectTags, setSelectTags] = useState<number[]>(filters.tags?.map(Number) ?? DATA.values.tags);

    const [orderBy, setOrderBy] = useState<WorkOrder>(DATA.filter.orderBy.types[0].type);

    const [orderRevert, setOrderRevert] = useState(false);


    const onFilter = () => {
        const query = {
            search: search.trim() || undefined,
            category: category === "todos" ? undefined : category,
            medium: medium === "todos" ? undefined : medium,
            tags: selectTags,
        }

        router.get(
            route('works.index'), query,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );
    }

    const onTag = (id: number, checked: boolean) => {
        setSelectTags((prev) =>
            checked ? [...prev, id] : prev.filter((t) => t !== id)
        );
    }



    // Si el medium elegido no pertenece a la nueva categoría, se vuelve a "todos"
    const onCategory = (c: CategorySelect) => {
        setCategory(c);
        if (!getMediumOptions(c).includes(medium)) setMedium("todos");
    }


    const Works = useMemo(() => {

        const sorted = [...works];

        switch (orderBy) {
            case "date":
                sorted.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
                break;
            case "alpha":
                sorted.sort((a, b) => a.title.localeCompare(b.title, "es"));
                break;
            default:
                break;
        }

        if (orderRevert) sorted.reverse();

        return sorted;

    }, [orderBy, orderRevert, works])



    const onReset = () => {
        setCategory(DATA.values.category as CategorySelect)
        setMedium("todos");
        setSearch("");
        setSelectTags(DATA.values.tags);
        setOrderBy(DATA.filter.orderBy.types[0].type);
        setOrderRevert(false);

        
        router.get(
            route('works.index'), {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );

    }

    return {
        Works,
        medium,
        setMedium,
        mediumOptions,
        category,
        setCategory,
        onCategory,
        onFilter,
        onReset,
        selectTags,
        setSelectTags,
        onTag,
        orderBy,
        setOrderBy,
        orderRevert,
        setOrderRevert,
        search,
        setSearch
    }


}
