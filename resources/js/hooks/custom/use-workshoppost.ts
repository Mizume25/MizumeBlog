/**
 * @fileoverview Logica reactiva de worpshop pestaña post
 */

import { WorkShopPostsFilter } from "@/types/custom/workshop-types";
import { router } from "@inertiajs/react";
import { useState } from "react";


function WorkShopPostHok (filter : WorkShopPostsFilter) {

    /** string siempre: el <input value> no acepta null y filter puede llegar como {} */
    const [search , setSearch] = useState<string>(filter.search ?? "")

    /** Búsqueda por título en servidor (?search=) */
    const onFilter = () => {
        const term = search.trim();

        router.get(route("panel.workshop.posts"), term ? { search: term } : {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    return {
        search,
        setSearch,
        onFilter
    }
}

export default WorkShopPostHok
