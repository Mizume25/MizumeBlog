import { Lang } from "@/store/lang-store"
import { apiPost } from "@/types/api"
import { PostManageTab, PostOrder, PostUserFilter, WorkShowTab } from "@/types/custom/work-show-types"
import { PostContent, PostRecord, User } from "@/types/definitions"
import { router } from "@inertiajs/react"
import MarkdownService from "@/services/MarkdownService"
import { useEffect, useMemo, useState } from "react"
import { useToast } from "../use-toast"


export default function useWorkShow(filter: PostUserFilter, posts: PostRecord[], slug: string, users: User[], lang: Lang) {


    const [search, setSearch] = useState<string>(filter.search ?? "");

    const [orderBy, setOrderBy] = useState<PostOrder>("date");

    const [orderRevert, setOrderRevert] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    const [post, setPost] = useState<PostRecord | null>(null);

    const [tab, setTab] = useState<WorkShowTab>("index");

    /** Pestaña de gestión del post (posts / comments / reports): guarda el valor, no el label */
    const [postTab, setPostTab] = useState<PostManageTab>("posts");

    const [content, setContent] = useState<PostContent | null>(null);

    const { toast, showToast } = useToast();


    /** Servicio de markdown: se crea una vez por cada post que llega */
    const markdown = useMemo(
        () => content
            ? new MarkdownService(content.post.content, content.post.index)
            : null,
        [content]
    );

    /** Sección actual (base 0); vuelve a la primera al cambiar de post */
    const [section, setSection] = useState(0);

    /** Dirección del último cambio: 1 = avanza (entra por la derecha), -1 = vuelve (entra por la izquierda) */
    const [direction, setDirection] = useState<1 | -1>(1);

    useEffect(() => {
        setSection(0)
        setDirection(1)
    }, [content])

    /** Cambia de sección guardando hacia dónde se mueve */
    const changeSection = (next: number) => {
        if (next === section) return
        setDirection(next > section ? 1 : -1)
        setSection(next)
    }

    /** Clic en un nodo del índice: salta a la sección ## a la que pertenece */
    const onIndex = (id: string) => {
        if (markdown) changeSection(markdown.sectionOf(id))
    }

    /** Total de secciones del post actual */
    const totalSections = markdown?.total() ?? 0;

    /** Trozo de markdown a renderizar: la sección actual */
    const body = markdown?.section(section) ?? "";


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





    const onUser = (uuid: string) => {
        const user = users.find((p) => p.uuid === uuid)
        if (user) setUser(user)
    }


    useEffect(() => {
        // Cada post nuevo (o volver al índice) empieza en la pestaña de publicaciones
        setPostTab("posts")

        if (user == null) {
            setTab("index")
            setContent(null)
            return
        }

        setTab("post")
        setContent(null)
        let cancelled = false

        const next = posts.find((p) => p.user.uuid === user.uuid)
        if (next) setPost(next)

        apiPost.getBuild(next?.id ?? null, lang, user.name)
            .then((data) => {
                if (!cancelled) setContent(data)
                showToast('success', 'Se ha cargado el contenido perfectamente')
                console.log(data)
            })
            .catch((err) => {
                showToast('error', `Se ha producido un error ${err}`)
            })

        return () => { cancelled = true }
    }, [user])


    const onBack = () => setUser(null)





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
        tab,
        setTab,
        postTab,
        setPostTab,
        user,
        setUser,
        onUser,
        onBack,
        content,
        setContent,
        body,
        section,
        setSection: changeSection,
        direction,
        totalSections,
        onIndex,
        toast
    }
}
