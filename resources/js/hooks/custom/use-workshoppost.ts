/**
 * @fileoverview Logica reactiva de worpshop pestaña post
 */

import { WORKSHOP_POST_TABS_TYPE } from "@/constants/workshop-constants";
import { WorkShopPostsFilter } from "@/types/custom/workshop-types";
import { router } from "@inertiajs/react";
import { useState } from "react";


function WorkShopPostHok(filter: WorkShopPostsFilter) {

    /** string siempre: el <input value> no acepta null y filter puede llegar como {} */
    const [search, setSearch] = useState<string>(filter.search ?? "")

    /** Se inicializa desde el backend para que la pestaña no vuelva a "all" tras recargar */
    const [postTab, setPostTab] = useState<WORKSHOP_POST_TABS_TYPE>(filter.status ?? "all");

    /** Filtro en servidor: título (?search=) y estado (?status=). undefined = no se envía */
    const onFilter = () => {
        router.get(route("panel.workshop.posts"), {
            search: search.trim() || undefined,
            status: postTab === "all" ? undefined : postTab,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    const onReset = () => {
        setPostTab("all")
        setSearch("")
        router.get(
            route('panel.workshop.posts'), {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );

    }



    return {
        search,
        setSearch,
        onFilter,
        postTab,
        setPostTab,
        onReset
    }
}

export default WorkShopPostHok
