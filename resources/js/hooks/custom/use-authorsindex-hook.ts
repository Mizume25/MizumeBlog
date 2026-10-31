/**
 * @fileoverview Archivo reactivo de hook ts
 */

import { AUTHOR_YEAR_MIN, DATA_AUTHOR_INDEX_TYPE } from "@/constants/authors-index-constants";
import { AuthorOrder } from "@/types/custom/author-index-types";
import { AuthorFilter } from "@/types/custom/work-index-types";
import { Author } from "@/types/definitions";
import { router } from "@inertiajs/react";
import { useMemo, useState } from "react"



export function useAuthorsIndex(authors: Author[], DATA: DATA_AUTHOR_INDEX_TYPE, filters: AuthorFilter) {


    const [year, setYear] = useState<number>(filters.year != null ? Number(filters.year) : AUTHOR_YEAR_MIN);

    const [search, setSearch] = useState(filters.search ?? "");

    const [orderBy, setOrderBy] = useState<AuthorOrder>(DATA.filter.orderBy.types[0].type);

    const [orderRevert, setOrderRevert] = useState(false);


    const Authors = useMemo(() => {

        const sorted = [...authors];

        const sortKey = (a: Author) =>
            a.pseudonym?.trim() || `${a.last_name ?? ""} ${a.name ?? ""}`.trim();

        switch (orderBy) {
            case "date":
                sorted.sort((a, b) => Number(b.birth_year) - Number(a.birth_year));
                break;
            case "alpha":
                sorted.sort((a, b) =>
                    sortKey(a).localeCompare(sortKey(b), "es", { sensitivity: "base" })
                );
                break;
            default:
                break;
        }

        if (orderRevert) sorted.reverse();

        return sorted;

    }, [orderBy, orderRevert, authors])


    const onFilter = () => {
        const query = {
            search: search.trim() || undefined,
            // En el mínimo del slider no se filtra por año
            year: year === AUTHOR_YEAR_MIN ? undefined : year,
        }

        router.get(
            route('authors.index'), query,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );
    }


    const onReset = () => {
        setYear(AUTHOR_YEAR_MIN);
        setSearch("");
        setOrderBy(DATA.filter.orderBy.types[0].type);
        setOrderRevert(false);

        router.get(
            route('authors.index'), {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );
    }

    return {
        year,
        setYear,
        search,
        setSearch,
        orderBy,
        setOrderBy,
        orderRevert,
        setOrderRevert,
        onFilter,
        onReset,
        Authors
    }
}
