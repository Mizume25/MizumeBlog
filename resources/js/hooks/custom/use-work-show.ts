import { PostUserFilter } from "@/types/custom/work-show-types"
import { dateTime, ORDER_DEFAULT, sortByOrder, ValueOrder } from "@/lib/order"
import { useLangStore } from "@/store/lang-store"
import { PostRecord } from "@/types/definitions"
import { router } from "@inertiajs/react"
import { useMemo, useState } from "react"

/**
 * Estado del listado de posts de un work (página works/show/index).
 *
 * Ya no gestiona el post abierto ni su contenido: abrir un post es navegar a
 * works.posts.show y cada pestaña (posts / comments / reports) es su propia página.
 */
export default function useWorkShow(filter: PostUserFilter, posts: PostRecord[], slug: string) {

    const [search, setSearch] = useState<string>(filter.search ?? "");

    const [orderBy, setOrderBy] = useState<ValueOrder>(ORDER_DEFAULT);

    const lang = useLangStore((l) => l.lang);

    const [orderRevert, setOrderRevert] = useState(false);

    /** Orden en cliente sobre la página actual (igual que works/index) */
    const Posts = useMemo(() => sortByOrder(posts, orderBy, {
        date: (p) => dateTime(p.publish_date),
        alpha: (p) => p.user.name,
        // Destacados primero (mismo orden que WorkController@show)
        first: (p) => p.featured_at !== null,
    }, lang, orderRevert), [posts, orderBy, orderRevert, lang]);

    /** Búsqueda por nombre de usuario en servidor (?search=) */
    const onFilter = () => {
        const term = search.trim();

        router.get(
            route("works.show", slug), term ? { search: term } : {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );
    }

    const onReset = () => {
        setSearch("");
        setOrderBy(ORDER_DEFAULT);
        setOrderRevert(false);

        router.get(
            route("works.show", slug), {},
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
        orderBy,
        setOrderBy,
        orderRevert,
        setOrderRevert,
        Posts,
        onFilter,
        onReset,
    }
}
