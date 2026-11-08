import { PostOrder, PostUserFilter } from "@/types/custom/work-show-types"
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

    const [orderBy, setOrderBy] = useState<PostOrder>("date");

    const [orderRevert, setOrderRevert] = useState(false);

    /** Orden en cliente sobre la página actual (igual que works/index) */
    const Posts = useMemo(() => {

        const sorted = [...posts];

        switch (orderBy) {
            case "date":
                sorted.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
                break;
            case "alpha":
                sorted.sort((a, b) => a.user.name.localeCompare(b.user.name, "es"));
                break;
        }

        if (orderRevert) sorted.reverse();

        return sorted;

    }, [posts, orderBy, orderRevert]);

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
        setOrderBy("date");
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
