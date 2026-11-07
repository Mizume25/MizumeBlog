

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/** Stores */
import { Lang } from '@/store/lang-store';

/** Hooks */
import { ReactNode, useEffect, useState } from 'react';

import { TurtleService } from '@/custom/services';


/** Types */
import { Paginated, PostContent, PostRecord, User, WorkRecord } from '@/types/definitions';
import { PostOrder } from '@/types/custom/work-show-types';
import { ArticleProps, PageProgressProps, PostManageTab, WorkShowTab } from '@/types/custom/work-show-types';
/* Constantes */
import { DATA_WORK_SHOW_TYPE } from '@/constants/work-show-constants';

/** Modules CSS */
import animateStyles from '../../../css/AnimateCSS.module.css';
import MarkdownRenderer from '../post/MarkdownRenderer';

/** Utilidades */
import { BlogProfile, FilterSearch, WORK_LABELS } from './utils-components';
import Loading from '@/components/ui/loading';
import { Pagination } from '@/components/paginator';
import { BlogShowTrigger } from '@/layouts/app/blog-show';
import { BlogShowSidebarContent } from '@/layouts/app/blog-show-components';
import { BlocLabel } from '@/blocs/bloc-filter';
import { Button as UIButton } from '@/components/ui/button';
import { Highlight } from '@/components/animate-ui/primitives/effects/highlight';
import RevertButton from '@/components/revert-buttono';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { FlipWork } from '@/components/flip-work';
import {
    ListBox,
    ListBoxItem,
    Popover,
    SelectionIndicator,
    SelectValue,
} from '@animate-ui/react/primitives/react-aria';
import { BlocSectionPage, BlocTabs, findSectionIndex } from '@/blocs/bloc-manage-info';
import { cn, PaginatedText } from '@/lib/utils';

// Select y Button no los exporta animate-ui: vienen de react-aria-components
import { Button as AriaButton, Select } from 'react-aria-components';

/** Iconos */
import { ArrowDownZA, Calendar, CalendarCheck2, FilterIcon, RotateCcw, ArrowLeft, RotateCw, Search, UserCircle2 } from 'lucide-react';
import { ToastType } from '@/hooks/use-toast';
import { BlocComents } from '@/blocs/bloc-post';
import { div } from 'motion/react-client';


/**
 * Barra de progreso de lectura del post por secciones.
 * Progreso = (sección actual + 1) / total: la última sección es el 100%.
 * Sticky: se queda pegada arriba y solo ocupa el ancho de la columna.
 */
export function PageProgress({ section, total }: PageProgressProps) {
    const reduce = useReducedMotion();
    const progress = total > 0 ? Math.min((section + 1) / total, 1) : 0;

    return (
        <div
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={section + 1}
            className="sticky top-0 z-30 h-1 w-full overflow-hidden rounded-full bg-mizume-primary-foreground/10"
        >
            <motion.div
                className="bg-mizume-fourthary-foreground h-full origin-left"
                initial={false}
                animate={{ scaleX: progress }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 250, damping: 40, bounce: 0 }}
            />
        </div>
    );
}

/**
 * Artículo sin scroll propio: crece con su contenido y hace scroll la página.
 */
export function Article({ children, className }: ArticleProps) {
    return <article className={cn('w-full max-w-none py-6', className)}>{children}</article>;
}

interface WorkShowHeaderProps {
    work: WorkRecord,
    lang: Lang
    WORK: WORK_LABELS,
    tab: WorkShowTab
}

interface SmoothCollapseProps {
    show: boolean,
    children: React.ReactNode,
    className?: string
}

/**
 * Muestra/oculta su contenido animando altura (grid-rows 0fr ↔ 1fr), opacidad y un leve desplazamiento.
 * El contenido sigue montado para que la salida también se anime.
 */
const SmoothCollapse = ({ show, children, className }: SmoothCollapseProps) => {

    // Solo se permite overflow visible cuando la expansión ha terminado (evita recortar hovers como scale)
    const [settled, setSettled] = useState(show);

    useEffect(() => {
        if (!show) setSettled(false);
    }, [show]);

    return (
        <div
            inert={!show}
            aria-hidden={!show}
            onTransitionEnd={(e) => {
                if (e.target === e.currentTarget && e.propertyName === 'grid-template-rows' && show) setSettled(true);
            }}
            className={cn(
                'grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none',
                show ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none',
            )}
        >
            <div className={cn('min-h-0', show && settled ? 'overflow-visible' : 'overflow-hidden')}>
                <div className={cn(
                    'transition-transform duration-500 ease-in-out motion-reduce:transition-none',
                    show ? 'translate-y-0' : '-translate-y-4',
                    className,
                )}>
                    {children}
                </div>
            </div>
        </div>
    );
};

interface PostIndexProps {
    paginated: Paginated<PostRecord>,
    lang: Lang,
    user: User | null,
    onUser: (v: string) => void,
    tab: WorkShowTab,
    DATA: DATA_WORK_SHOW_TYPE,
    content: PostContent | null,
    body: string,
    section: number,
    direction: 1 | -1,
    postTab: PostManageTab
}

/** Desplazamiento horizontal (px) de la transición entre secciones */
const SECTION_SHIFT = 60;

/**
 * Transición entre secciones: `dir` = 1 avanza (entra por la derecha y sale por la izquierda),
 * `dir` = -1 vuelve (entra por la izquierda y sale por la derecha).
 */
const sectionVariants = {
    enter: (dir: 1 | -1) => ({ x: dir * SECTION_SHIFT, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: -dir * SECTION_SHIFT, opacity: 0 }),
};

export const PostsIndex = ({ paginated, lang, onUser, tab, DATA, content, body, section, direction, postTab }: PostIndexProps) => {

    const reduce = useReducedMotion();


    return (
        <>
            <SmoothCollapse show={tab !== "index"}>


                {content === null ? (
                    <Loading className='w-full h-full flex flex-col items-center justify-center' text='Loading . . .' textStyles='text-2xl text-mizume-secondary-foreground' />
                ) : (
                    <div className='w-full h-full overflow-x-hidden'>
                        <AnimatePresence mode="wait" initial={false} custom={direction}>
                            <motion.div
                                key={`${content.post.data.id}-${section}`}
                                custom={direction}
                                variants={reduce ? undefined : sectionVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {postTab === "posts" ? (
                                    <MarkdownRenderer content={body} className="mb-12" selectedId={"hola"} />
                                ) : postTab === "comments" ? (
                                    <BlocComents post_id={content.post.data.id} />
                                ) : postTab === "reports" ? (
                                    <>
                                    </>
                                ) : (
                                    <>
                                    </>
                                )}


                            </motion.div>
                        </AnimatePresence>
                    </div>
                )

                }
            </SmoothCollapse>

            <SmoothCollapse show={tab === "index"}>
                <div className='w-full h-full grid grid-cols-1 gap-6'>

                    {paginated.data.length !== 0 ? (
                        paginated.data.map((p) => (
                            <PostItem record={p} onUser={onUser} key={p.id} />
                        ))
                    ) : (
                        <div className="col-span-full flex items-center justify-center flex-row gap-5">
                            <p className='text-mizume-secondary-foreground'>{DATA.error.withOutPosts}</p>
                            <img src={TurtleService.onPath("dead")} alt={TurtleService.onName("dead")} className="h-30 w-30" />
                        </div>
                    )}


                    <div className="col-span-full">
                        <Pagination
                            prevUrl={paginated.prev_page_url}
                            nextUrl={paginated.next_page_url}
                            current={paginated.current_page}
                            last={paginated.last_page}
                            labels={PaginatedText[lang]}
                            classBTN='rounded-full border-2 border-mizume-primary-foreground bg-mizume-primary text-mizume-primary-foreground px-4 py-1.5 text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            spanClass='text-sm font-bold text-mizume-secondary-foreground'
                        />
                    </div>
                </div>
            </SmoothCollapse>
        </>
    )
}

interface PostItemProps {
    record: PostRecord,
    onUser: (v: string) => void,
}

const PostItem = ({ record, onUser }: PostItemProps) => {
    return (
        <div
            onClick={() => onUser(record.user.uuid)}
            className='bg-card-header text-card-header-foreground flex flex-col justify-between p-5 rounded-xl gap-4 shadow-sm transition-transform duration-300 hover:scale-103 cursor-pointer'
        >

            <div className='flex items-center justify-between w-full'>
                <div>
                    <BlogProfile name={record.user.name} seed={record.user.uuid} className='w-10 h-10 rounded-full border-[3px] border-mizume-primary flex items-center justify-center  ' />
                    <p>{record.user.name}</p>
                </div>
                <span className='text-sm opacity-80'>{record.publish_date}</span>
            </div>


            <div>
                <h2 className='text-xl font-semibold tracking-tight'>{record.title}</h2>
            </div>
        </div>
    )
}


interface PostIndexHeaderProps {
    lang: Lang,
    search: string,
    setSearch: (v: string) => void,
    onFilter: () => void,
    onReset: () => void,
    orderBy: PostOrder,
    setOrderBy: (v: PostOrder) => void,
    onRevert: () => void,
    tab: WorkShowTab,
    users: User[],
    user: User | null,
    onUser: (uuid: string) => void,
    onBack: () => void,
    DATA: DATA_WORK_SHOW_TYPE,
    content: PostContent | null,
    totalSections: number,
    section: number,
    setSection: (section: number) => void,
    isMobile: boolean,
    postab: PostManageTab
}

export const PostIndexHeader = ({ lang, search, setSearch, onFilter, onReset, orderBy, setOrderBy, onRevert, tab, users, user, onUser, onBack, DATA, content, totalSections, section, setSection , postab }: PostIndexHeaderProps) => {

    const userIndex = findSectionIndex(users, (u) => u.uuid === user?.uuid)




    return (
        <div className='w-full rounded-2xl bg-mizume-primary mb-5'>

            <SmoothCollapse show={tab === "index"}>
                <div className='p-4 grid grid-cols-1 md:grid-cols-12 gap-4 *:min-w-0'>
                    {/* Búsqueda por usuario */}
                    <BlocLabel
                        className='md:col-span-6 '
                        icon={Search}
                        title={DATA.search.label}
                        titleStyles='title ms-2'
                    >
                        <FilterSearch
                            search={search}
                            onFilter={onFilter}
                            setSearch={setSearch}
                            content="bg-input-border rounded-md p-1"
                            inputClass="w-full bg-input text-input-foreground placeholder:text-input-placeholder p-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-input-focus"
                            placeholder={DATA.search.placeholder}
                        />
                    </BlocLabel>

                    {/* Orden */}
                    <BlocLabel
                        className='md:col-span-3'
                        icon={Calendar}
                        title={DATA.orderBy.title}
                        titleStyles='title mx-2'
                        sideTitle={<RevertButton onToggle={onRevert} className="ms-auto bg-btn-info text-btn-info-foreground hover:bg-btn-info-foreground hover:text-btn-info" />}
                    >
                        <div className="grid grid-cols-2 gap-2 bg-item rounded-lg">
                            <Highlight
                                value={orderBy}
                                onValueChange={(v) => setOrderBy(v as PostOrder)}
                                className="inset-0 rounded-lg bg-item-active border-2 border-item-border"
                            >
                                {DATA.orderBy.types.map((o) => (
                                    <button
                                        key={o.type}
                                        aria-label={o.label}
                                        title={o.label}
                                        data-value={o.type}
                                        className="px-3 py-1 flex justify-center text-item-foreground cursor-pointer"
                                    >
                                        <o.icon />
                                    </button>
                                ))}
                            </Highlight>
                        </div>
                    </BlocLabel>

                    {/* Acciones */}
                    <div className='md:col-span-3 flex flex-col gap-2 justify-center'>
                        <UIButton className="bg-btn-success text-btn-success-foreground cursor-pointer text-md py-6" onClick={onFilter}>
                            <FilterIcon />
                            {DATA.apply}
                        </UIButton>
                        <UIButton variant={"ghost"} className="bg-btn-danger text-btn-danger-foreground cursor-pointer text-md py-6" onClick={onReset}>
                            <RotateCcw />
                            {DATA.reset}
                        </UIButton>
                    </div>
                </div>
            </SmoothCollapse>

            <SmoothCollapse show={tab !== "index"}>



                {/*
                  * Container query: el layout depende del ancho real del bloque, no de la ventana.
                  * Estrecho: uno debajo de otro · Ancho (@2xl): [Título (flexible) | Fecha | Secciones]
                  * Flex en vez de grid: funciona igual con 2 hijos (comments/reports) que con 3 (posts).
                  */}
                <div className='@container p-4'>
                    <div className='flex flex-col @2xl:flex-row gap-4'>
                        {content === null ? (
                            <>
                                <span className="sr-only" role="status">Loading</span>
                                <div aria-hidden="true" className={cn(animateStyles.shimmer, 'h-20 rounded-2xl @2xl:flex-1')} />
                                <div aria-hidden="true" className={cn(animateStyles.shimmer, 'h-20 rounded-2xl @2xl:w-36')} />
                                <div aria-hidden="true" className={cn(animateStyles.shimmer, 'h-20 rounded-2xl @2xl:w-64')} />
                            </>
                        ) : (
                            <>
                                {/* Título: ocupa el espacio libre y se recorta si es largo */}
                                <PostWidget heading text={content.post.data.title} className='min-w-0 @2xl:flex-1' />

                                {/* Fecha: solo lo que mide */}
                                <PostWidget text={content.post.data.publish_date} className='@2xl:shrink-0' />

                                <PostWidget text={content.post.data.user.name} className='@2xl:shrink-0' />

                                {postab == "posts" && (
                                    <BlocSectionPage variant='numbers' className="flex h-20 items-center justify-center rounded-2xl bg-mizume-fourthary py-2 px-4 @2xl:shrink-0 @2xl:min-w-64" lang={lang} key={content.post.data.id} sections={{ min: 1, max: totalSections }} value={section + 1} onChange={(n) => setSection(n - 1)} />
                                )}
                            </>
                        )}

                    </div>
                </div>
            </SmoothCollapse>
        </div>
    )
}

interface PostSidebarProps {
    tab: WorkShowTab,
    content: PostContent | null,
    DATA: DATA_WORK_SHOW_TYPE,
    /** Clic en un nodo del índice (recibe su id, p. ej. "2.1") */
    onIndex?: (id: string) => void
}

/** Anchos de las líneas del skeleton, imitando una lista de índice */
const SIDEBAR_SKELETON = ['w-4/5', 'w-3/5', 'w-2/3', 'w-1/2', 'w-3/4', 'w-2/5'];

/**
 * Sidebar del post con tres estados:
 * sin post elegido (mensaje + tortuga), cargando (líneas brillantes) y listo (índice del post).
 */
export const PostSidebar = ({ tab, content, DATA, onIndex }: PostSidebarProps) => {

    if (content !== null) return <BlogShowSidebarContent data={content.post.index} onSelect={(n) => onIndex?.(n.id)} />;

    if (tab === "index") {
        return (
            <div className='flex flex-col items-center justify-center gap-4 p-6 text-center'>
                <img src={TurtleService.onPath("smile")} alt={TurtleService.onName("smile")} className="h-30 w-30" />
                <p className='text-sm opacity-80'>{DATA.sidebar.empty}</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-3 p-4'>
            <span className="sr-only" role="status">{DATA.sidebar.loading}</span>
            {SIDEBAR_SKELETON.map((w, i) => (
                <div key={i} aria-hidden="true" className={cn(animateStyles.shimmer, 'h-6 rounded-md', w)} />
            ))}
        </div>
    );
}

interface BlocBackProps {
    text: string,
    onBack: () => void,
    className?: string
}

/** El span de columnas lo decide el padre (className), así no rompe el grid en móvil */
export const BlocBack = ({ text, onBack, className }: BlocBackProps) => {
    return (
        <div className={cn('flex h-15 flex-row items-center justify-center', className)}>
            <UIButton variant={'link'} className='bg-mizume-primary text-mizume-primary-foreground flex h-full w-full flex-row items-center justify-center gap-2 px-6 cursor-pointer transform-transition hover:-translate-x-1 ease-in-out duration-200' onClick={onBack}>
                <ArrowLeft />
                {text}
            </UIButton>
        </div>
    )
}






interface PostTabsBarProps {
    postTab: PostManageTab,
    setPostTab: (tab: PostManageTab) => void,
    DATA: DATA_WORK_SHOW_TYPE,
    tab: WorkShowTab
}

/**
 * Barra de pestañas del post (posts / comments / reports).
 * Ocupa el lugar de la card del work cuando se abre un post.
 * Container query: ancho → BlocTabs · estrecho → BlocTabsSelect (mismo estado).
 */
const PostTabsBar = ({ postTab, setPostTab, DATA, tab }: PostTabsBarProps) => {
    return (
        <div className="@container w-full rounded-xl bg-mizume-secondary/80 p-4">
            <div className="flex flex-row items-center gap-4">

                <BlocTabs tabs={DATA.postManage.POST_TABS} labels={DATA.postManage.TAB_LABELS} value={postTab} onChange={setPostTab} className='hidden @2xl:flex flex-1 h-16 items-center justify-center rounded-2xl bg-mizume-fourthary px-8 py-2' />

                <BlocTabsSelect tab={postTab} onTab={setPostTab} DATA={DATA} className='@2xl:hidden flex flex-1 h-16 items-center rounded-2xl bg-mizume-fourthary px-4 py-2' />

                {/* En móvil es la única forma de abrir el aside: la card (donde estaba) queda oculta */}
                {postTab === "posts" && (
                    <BlogShowTrigger className="text-mizume-secondary-foreground bold shrink-0" />
                )}
            </div>
        </div>
    )
}


/**
 * Subheader del show (solo ancho de la columna main): la barra de pestañas
 * aparece cuando se abre un post, a la vez que se pliega la card del work.
 */
export const WorkShowTabsBar = ({ postTab, setPostTab, DATA, tab }: PostTabsBarProps) => {
    return (
        <SmoothCollapse show={tab !== "index"}>
            <div className="pt-4">
                <PostTabsBar postTab={postTab} setPostTab={setPostTab} DATA={DATA} tab={tab} />
            </div>
        </SmoothCollapse>
    )
}

interface WorkShowAsideHeaderProps {
    tab: WorkShowTab,
    children?: React.ReactNode
}

/**
 * Hueco encima del aside (misma fila que WorkShowTabsBar, solo lg+).
 * Misma altura que la barra de pestañas: pt-4 + p-4 + h-16 = h-24.
 */
export const WorkShowAsideHeader = ({ tab, children }: WorkShowAsideHeaderProps) => {
    return (
        <SmoothCollapse show={tab !== "index"}>
            <div className="pt-4">
                <div className="flex h-24 items-center justify-center rounded-xl bg-mizume-secondary/80">
                    {children}
                </div>
            </div>
        </SmoothCollapse>
    )
}


/**
 * Cabecera a ancho completo del show: card del work, se pliega al abrir un post
 */
export const WorkShowHeader = ({ work, lang, WORK, tab }: WorkShowHeaderProps) => {
    const isHidden = tab != "index";
    return (
        <>
            <div className={`grid transition-[grid-template-rows] duration-700 ease-in-out ${isHidden ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
                <div className="overflow-hidden">
                    <div className={`grid min-h-45 w-full grid-cols-1 gap-4 rounded-xl bg-mizume-secondary/80 p-4 lg:grid-cols-4 lg:grid-rows-2 transition-all duration-700 ease-in-out ${isHidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>



                        <div className="lg:col-span-2 lg:row-span-2 flex min-h-25 flex-col gap-3 items-start justify-center rounded-2xl bg-mizume-secondary p-4">
                            <FlipWork work={work} labels={WORK} />
                        </div>
                        <div className="lg:col-span-2  flex min-h-25 flex-col gap-3 items-start justify-center rounded-2xl bg-yellow-300/50 p-4">Backend</div>
                    </div>
                </div>
            </div>
        </>
    );


};

interface BlocCurrentUser {
    className: string,
    user: User
}

const BlocCurrentUser = ({ className, user }: BlocCurrentUser) => {
    return (
        <div className={`${className}`}>
            <h3 className='title'>Post Actual de {user.name}</h3>
            <input
                className='flex flex-row items-center justify-center p-4 w-full bg-mizume-primary/60 text-mizume-primary-foreground rounded-xl mt-2'
                value={user.name}
                disabled
            />

        </div>
    )
}

interface BlocSelectUserProps {
    className: string,
    user: User,
    users: User[],
    onUser: (v: number) => void
}

export const BlocSelectUser = ({ user, users, onUser, className }: BlocSelectUserProps) => {
    return (
        <div className={`${className}`}>
            <h3 className='title'>Usuario</h3>
            <div className='flex flex-col items-center justify-center gap-2 w-full'>

                <Select
                    aria-label={user.name}
                    value={user.id}
                    onChange={(key) => key && onUser(key as number)}
                    className={`w-full`}
                >
                    <AriaButton className="w-full text-left capitalize bg-input text-input-foreground p-2 rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-input-focus">
                        <SelectValue />
                    </AriaButton>
                    <Popover placement="bottom start" offset={4} className="w-(--trigger-width)">
                        <ListBox className={`bg-popover text-popover-foreground p-2 rounded-xl`} >
                            {users.map((user) => (
                                <ListBoxItem key={user.uuid} id={user.id} textValue={user.name} className={`capitalize outline-none  py-2 bg-popover cursor-pointer  text-item-foreground flex flex-row-reverse justify-center items-center data-focused:bg-item-hover data-selected:text-item-active-foreground`}>
                                    {user.name}
                                    <SelectionIndicator animation="pop">✓</SelectionIndicator>
                                </ListBoxItem>
                            ))}
                        </ListBox>
                    </Popover>
                </Select>
                <Button variant={'accent'} className='w-full bg-btn-success text-btn-success-foreground hover:bg-btn-success-foreground hover:text-btn-success flex flex-row gap-2 p-4' >
                    <RotateCw />
                    Ver Post de {user.name}
                </Button>
                <Button variant={'accent'} className='w-full bg-btn-info text-btn-info-foreground hover:bg-btn-info-foreground hover:text-btn-info flex flex-row gap-2 p-4' >
                    <UserCircle2 />
                    Ver Perfil de {user.name}
                </Button>
            </div>

        </div>
    )
}


interface BlocTabsSelectProps {
    tab: PostManageTab,
    onTab: (v: PostManageTab) => void,
    DATA: DATA_WORK_SHOW_TYPE,
    className?: string,
}

/**
 * Select de pestañas (versión móvil de BlocTabs).
 * Mismo patrón que WorkFilterMedium: el id es el valor fijo y solo se traduce el label.
 */
export const BlocTabsSelect = ({ tab, onTab, DATA, className }: BlocTabsSelectProps) => {
    const LABELS = DATA.postManage.TAB_LABELS

    return (
        <div className={className}>
            <Select
                aria-label={LABELS[tab]}
                value={tab}
                onChange={(key) => key && onTab(key as PostManageTab)}
                className="w-full"
            >
                <AriaButton className="w-full text-left capitalize bg-input text-input-foreground p-2 rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-input-focus">
                    <SelectValue />
                </AriaButton>
                <Popover placement="bottom start" offset={4} className="w-(--trigger-width)">
                    <ListBox className="bg-popover text-popover-foreground p-2 rounded-xl">
                        {DATA.postManage.POST_TABS.map((key) => (
                            <ListBoxItem key={key} id={key} textValue={LABELS[key]} className="capitalize outline-none py-2 bg-popover cursor-pointer text-item-foreground flex flex-row-reverse justify-center items-center data-focused:bg-item-hover data-selected:text-item-active-foreground">
                                {LABELS[key]}
                                <SelectionIndicator animation="pop">✓</SelectionIndicator>
                            </ListBoxItem>
                        ))}
                    </ListBox>
                </Popover>
            </Select>
        </div>
    )
}

interface PostTitleProps {
    text: string,
    /** true = título del post (h1); false = dato secundario (fecha, etc.) */
    heading?: boolean,
    className?: string
}

const PostWidget = ({ text, heading = false, className }: PostTitleProps) => {
    const Tag = heading ? 'h1' : 'span';
    return (
        <div className={cn('flex h-20 items-center justify-center rounded-2xl bg-mizume-secondary p-4', className)}>
            <div className="w-full h-full min-w-0 bg-mizume-fourthary flex flex-row items-center justify-center rounded-xl text-sm px-4">
                {/* truncate + title: los títulos largos no rompen el layout y se leen al pasar el ratón */}
                <Tag className='title truncate whitespace-nowrap' title={text}>{text}</Tag>
            </div>
        </div>
    )
}


interface WorkShowMainProps {
    children: React.ReactNode;
    mainRef?: React.Ref<HTMLDivElement>;
}

export const WorkShowMain = ({ children, mainRef }: WorkShowMainProps) => {
    return (
        <div ref={mainRef} className="bg-mizume-secondary relative min-h-screen w-full rounded-b-xl p-6">
            {children}
        </div>
    );
};
