/**
 * @fileoverview Archivo reactivo de hook ts
 */

import { AUTHOR_YEAR_MIN, DATA_AUTHOR_INDEX_TYPE } from "@/constants/authors-index-constants";
import { ORDER_DEFAULT, sortByOrder, ValueOrder } from "@/lib/order";
import { useLangStore } from "@/store/lang-store";
import { AuthorFilter } from "@/types/custom/work-index-types";
import { Author } from "@/types/definitions";
import { router } from "@inertiajs/react";
import { useMemo, useState } from "react"



export function useAuthorsIndex(authors: Author[], DATA: DATA_AUTHOR_INDEX_TYPE, filters: AuthorFilter) {


    const [year, setYear] = useState<number>(filters.year != null ? Number(filters.year) : AUTHOR_YEAR_MIN);

    const [search, setSearch] = useState(filters.search ?? "");

    const [orderBy, setOrderBy] = useState<ValueOrder>(ORDER_DEFAULT);

    const lang = useLangStore((l) => l.lang);

    const [orderRevert, setOrderRevert] = useState(false);


    const Authors = useMemo(() => sortByOrder(authors, orderBy, {
        date: (a) => Number(a.birth_year),
        alpha: (a) => a.pseudonym?.trim() || `${a.last_name ?? ""} ${a.name ?? ""}`.trim(),
    }, lang, orderRevert), [orderBy, orderRevert, authors, lang])


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
        setOrderBy(ORDER_DEFAULT);
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
