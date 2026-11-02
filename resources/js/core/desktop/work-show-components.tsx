import { cn } from '@/lib/utils';
import { Nodo } from '@/types/custom/blog-show-types';
import { ArticleProps, PageProgressProps } from '@/types/custom/work-show-types';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

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
}



export const WorkShowHeader = ({ children }: WorkShowHeaderProps) => {
    return (
        <nav className="grid min-h-45 w-full grid-cols-1 grid-rows-2 gap-4 rounded-xl bg-white p-4 max-md:grid-cols-2 lg:grid-cols-4">
            <div className="flex h-25 items-center justify-center rounded-2xl bg-red-200 p-4">TITULO POST</div>
            <div className="flex h-25 items-center justify-center rounded-2xl bg-green-200 p-4">AUTHOR</div>
            <div className="col-span-2 flex h-25 items-center justify-center rounded-2xl bg-yellow-200 p-4">GESTION BACKEND</div>
            <div className="col-span-2 flex h-25 items-center justify-center rounded-2xl bg-blue-200 p-4">SECCIONES</div>
            <div className="col-span-2 row-span-2 hidden h-full items-center justify-center rounded-2xl bg-gray-400 p-4 lg:flex">CARD</div>
            <div className="col-span-2 flex h-15 items-center justify-center rounded-2xl bg-purple-200 p-4">PESTAÑAS</div>
        </nav>
    );
};

interface WorkShowMainProps {
    children: React.ReactNode;
    mainRef?: React.Ref<HTMLDivElement>;
}

export const WorkShowMain = ({ children, mainRef }: WorkShowMainProps) => {
    return (
        <div ref={mainRef} className="bg-mizume-secondary relative mt-4 min-h-screen w-full rounded-xl px-4">
            {children}
        </div>
    );
};
