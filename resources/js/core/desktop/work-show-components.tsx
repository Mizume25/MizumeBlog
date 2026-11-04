import { BlocSectionPage, BlocTabs, SectionsTypes } from '@/blocs/bloc-manage-info';
import { cn, PaginatedText } from '@/lib/utils';
import { Nodo } from '@/types/custom/blog-show-types';
import { ArticleProps, PageProgressProps } from '@/types/custom/work-show-types';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useState } from 'react';
// Select y Button no los exporta animate-ui: vienen de react-aria-components
import { Button as AriaButton, Select } from 'react-aria-components';
import {
    ListBox,
    ListBoxItem,
    Popover,
    SelectionIndicator,
    SelectValue,
} from '@animate-ui/react/primitives/react-aria';
import { Paginated, PostRecord, User, WorkRecord } from '@/types/definitions';
import { Lang } from '@/store/lang-store';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { RotateCw, UserCircle2 } from 'lucide-react';
import { FlipWork } from '@/components/flip-work';
import { BlogProfile, WORK_LABELS } from './utils-components';
import { div } from 'motion/react-client';
import { Pagination } from '@/components/paginator';
import { BlogShowTrigger } from '@/layouts/app/blog-show';


export const SIDEBAR_DATA: Nodo[] = [
    {
        id: 'introduccion',
        title: '1. Introducción',
        children: [
            {
                id: 'palabras-destacadas',
                title: '1.1 Palabras destacadas',
                children: [
                    {
                        id: 'ejemplo-parrafo-largo',
                        title: '1.1.1 Ejemplo de párrafo largo',
                        children: [
                            {
                                id: 'encabezado-nivel-5',
                                title: '1.1.1.1 Encabezado de nivel 5',
                                children: [
                                    {
                                        id: 'encabezado-nivel-6',
                                        title: '1.1.1.1.1 Encabezado de nivel 6',
                                        children: [
                                            // Nivel 6 de anidación: solo existe si añades el "#" como raíz
                                            { id: 'hoja-nivel-6', title: 'Hoja de nivel 6' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    { id: 'citas', title: '2. Citas' },
    {
        id: 'listas',
        title: '3. Listas',
        children: [
            { id: 'lista-sin-ordenar', title: '3.1 Lista sin ordenar' },
            { id: 'lista-ordenada', title: '3.2 Lista ordenada' },
            { id: 'lista-de-tareas', title: '3.3 Lista de tareas' },
        ],
    },
    {
        id: 'tablas',
        title: '4. Tablas',
        children: [
            { id: 'tabla-simple', title: '4.1 Tabla simple' },
            { id: 'tabla-con-alineacion', title: '4.2 Tabla con alineación' },
            { id: 'tabla-comparativa', title: '4.3 Tabla comparativa' },
        ],
    },
    {
        id: 'codigo',
        title: '5. Código',
        children: [
            { id: 'codigo-javascript', title: '5.1 Bloque de código JavaScript' },
            { id: 'codigo-python', title: '5.2 Bloque de código Python' },
            { id: 'codigo-bash', title: '5.3 Bloque de código Bash' },
        ],
    },
    {
        id: 'mas-contenido',
        title: '6. Más contenido Lorem Ipsum',
        children: [
            { id: 'seccion-a', title: '6.1 Sección A' },
            {
                id: 'seccion-b',
                title: '6.2 Sección B',
                children: [{ id: 'puntos-clave-seccion-b', title: 'Puntos clave de la sección B' }],
            },
            { id: 'seccion-c', title: '6.3 Sección C' },
        ],
    },
    { id: 'enlaces-e-imagenes', title: '7. Enlaces e imágenes' },
    { id: 'notas-finales', title: '8. Notas finales' },
];

/**
 * Barra de progreso de lectura del post.
 * Mide el scroll de la ventana relativo a `targetRef`:
 * 0% cuando el inicio del post llega arriba de la pantalla,
 * 100% cuando el final del post llega abajo de la pantalla.
 * Sticky: se queda pegada arriba y solo ocupa el ancho de la columna.
 */
export function PageProgress({ targetRef }: PageProgressProps) {
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end end'],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 250, damping: 40, bounce: 0 });
    const reduce = useReducedMotion();

    return (
        <div className="sticky top-0 z-30 h-1 w-full overflow-hidden rounded-full bg-black/10">
            <motion.div className="bg-mizume-fourthary h-full origin-left" style={{ scaleX: reduce ? scrollYProgress : smooth }} />
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
    children: React.ReactNode;
    work: WorkRecord,
    lang: Lang
    WORK: WORK_LABELS
}

interface WorkPostTitleProps {
    className: string
    title: string
}

const WorkPostTitle = ({ title, className }: WorkPostTitleProps) => {
    return (
        <div className={`${className}`}>
            <div className='w-full h-full flex flex-col items-center justify-center gap-4'>

            </div>
            <h2 className='title'>{title}</h2>
        </div>
    )
}

interface PostIndexProps {
    paginated: Paginated<PostRecord>,
    lang: Lang
}

export const PostsIndex = ({ paginated, lang }: PostIndexProps) => {

    return (
        <div className='w-full h-full grid grid-cols-1 gap-6'>
            {paginated.data.map((p) => (
                <div
                    key={p.id || p.title}
                    className='bg-mizume-primary text-mizume-primary-foreground flex flex-col justify-between p-5 rounded-xl gap-4 shadow-sm transition-transform duration-300 hover:scale-103 cursor-pointer'
                >

                    <div className='flex items-center justify-between w-full'>
                        <BlogProfile name={p.user.name} seed={p.user.uuid} className='w-10 h-10 rounded-full border-[3px] border-mizume-primary flex items-center justify-center  ' />
                        <span className='text-sm opacity-80'>{p.publish_date}</span>
                    </div>


                    <div>
                        <h2 className='text-xl font-semibold tracking-tight'>{p.title}</h2>
                    </div>
                </div>
            ))}

            <div className="col-span-full">
                <Pagination
                    prevUrl={paginated.prev_page_url}
                    nextUrl={paginated.next_page_url}
                    current={paginated.current_page}
                    last={paginated.last_page}
                    labels={PaginatedText[lang]}
                    classBTN='rounded-full border-2 border-black bg-mizume-primary text-mizume-primary-foreground px-4 py-1.5 text-sm font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    spanClass='text-sm font-bold text-mizume-secondary-foreground'
                />
            </div>

            {/*
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
            <div className='bg-mizume-primary text-mizume-primary-foreground flex flex-col flex-center justify-center p-4 h-35 rounded-xl'>
                <h2>"hokla"</h2>
                <p>"wdwdwdw</p>
                <p>lkjrferjkner </p>
            </div>
                */}
        </div>
    )
}






export const WorkShowHeader = ({ children, work, lang, WORK }: WorkShowHeaderProps) => {


    const sections: SectionsTypes = {
        min: 1,
        max: 10
    }


    return (
        <div className="grid min-h-45 w-full grid-cols-1 gap-4 rounded-xl bg-mizume-secondary/80 p-4 lg:grid-cols-4 lg:grid-rows-2">

            {/* <WorkPostTitle title={post.title} className='flex min-h-25 items-center justify-start rounded-2xl bg-mizume-fourthary p-8 lg:col-span-2' /> */}
            {/* <BlocSelectUser className='lg:col-span-2 flex min-h-25 flex-col gap-3 items-start justify-center rounded-2xl bg-mizume-fourthary p-4' onUser={onUser} user={user} users={users} /> */}
             <BlogShowTrigger className="text-mizume-secondary-foreground bold" />
            <div className="lg:col-span-2 lg:row-span-2 flex min-h-25 flex-col gap-3 items-start justify-center rounded-2xl bg-mizume-secondary p-4">
                <FlipWork work={work} labels={WORK} />
            </div>
            {/* <BlocCurrentUser className='lg:col-span-2 flex min-h-25 flex-col gap-3 items-start justify-center rounded-2xl bg-mizume-fourthary  p-4' user={currentUser} /> */}
            <div className="lg:col-span-2  flex min-h-25 flex-col gap-3 items-start justify-center rounded-2xl bg-yellow-300/50 p-4">Backend</div>
            {/* <BlocTabs tabs={["Post", "Comentarios", "Reportes"] as const} className='lg:col-span-2 flex flex-row h-20 items-center justify-center rounded-2xl bg-mizume-fourthary px-8 py-2' onLabel={(v: string) => console.log(v)} /> */}
            {/* <BlocSectionPage className="lg:col-span-2 flex h-20 items-center justify-center rounded-2xl bg-mizume-fourthary py-2 px-4" lang={lang}
                sections={sections}
            /> */}
           

        </div>
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
                    <AriaButton className="w-full text-left capitalize bg-mizume-secondary text-mizume-secondary-foreground p-2 rounded-xl cursor-pointer outline-none">
                        <SelectValue />
                    </AriaButton>
                    <Popover placement="bottom start" offset={4} className="w-(--trigger-width)">
                        <ListBox className={`bg-mizume-secondary p-2 rounded-xl`} >
                            {users.map((user) => (
                                <ListBoxItem key={user.uuid} id={user.id} textValue={user.name} className={`capitalize outline-none  py-2 bg-mizume-secondary cursor-pointer  text-mizume-tertiary flex flex-row-reverse justify-center items-center data-focused:bg-mizume-fourthary`}>
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


interface WorkShowMainProps {
    children: React.ReactNode;
    mainRef?: React.Ref<HTMLDivElement>;
}

export const WorkShowMain = ({ children, mainRef }: WorkShowMainProps) => {
    return (
        <div ref={mainRef} className="bg-mizume-secondary relative min-h-screen w-full rounded-xl p-6">
            {children}
        </div>
    );
};
