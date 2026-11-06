import * as React from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
} from '@/components/animate-ui/components/radix/sidebar';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/animate-ui/components/radix/sheet';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { cn } from '@/lib/utils';
import useBlogShow, { BlogShowContext, useBlogShowContext } from '@/hooks/custom/use-blog-show';
import type { BlogShowProps } from '@/types/custom/blog-show-types';








/**
 * Layout de vista de detalle con un sidebar secundario.
 *
 * - Escritorio (lg+): panel a la derecha, plegable con su propio botón
 *   (plegado queda una franja con el botón para volver a abrirlo).
 * - Móvil: el panel se abre como Sheet desde la derecha con <BlogShowTrigger />.
 *
 * Debe usarse DENTRO de BlogLayout: reutiliza el contexto del SidebarProvider
 * principal y usa collapsible="none" para no afectar al sidebar principal.
 */
export const BlogShow = ({ children, header, subheader, asideHeader, aside, asideTitle, asideWidth = '23rem' }: BlogShowProps) => {


    const { openMobile, setOpenMobile, openDesktop, toggleDesktop, contextValue } = useBlogShow(!!aside);



    return (
        <BlogShowContext.Provider value={contextValue}>
            {/* Cabecera a ancho completo (dentro del provider para que BlogShowTrigger funcione) */}
            {header}

            {/*
              * Fila subheader: [subheader | asideHeader]. El hueco del aside replica su ancho
              * (abierto/plegado) para quedar alineado. Sin margen propio: si el contenido
              * se colapsa a 0 no deja hueco (el espaciado lo pone el contenido).
              */}
            {(subheader || asideHeader) && (
                <div className="flex w-full items-stretch gap-4">
                    <div className="min-w-0 flex-1">{subheader}</div>
                    {aside && (
                        <div
                            style={{ '--aside-width': asideWidth } as React.CSSProperties}
                            className={cn(
                                'hidden shrink-0 overflow-hidden transition-[width] duration-300 lg:block',
                                openDesktop ? 'w-(--aside-width)' : 'w-12',
                            )}
                        >
                            {asideHeader}
                        </div>
                    )}
                </div>
            )}

            <div className={cn('flex w-full items-stretch gap-4', header && 'mt-4')}>
                <div className="min-w-0 flex-1">{children}</div>

                {aside && (
                    // La columna solo aporta ANCHO; su altura la marca el main (items-stretch).
                    // El panel va en absoluto para que su contenido nunca agrande la fila
                    // (si no cabe, hace scroll dentro de SidebarContent).
                    <div
                        style={{ '--aside-width': asideWidth } as React.CSSProperties}
                        className={cn(
                            'relative hidden shrink-0 transition-[width] duration-300 lg:block',
                            openDesktop ? 'w-(--aside-width)' : 'w-12',
                        )}
                    >
                    {/* Wrapper propio: Highlight fuerza position:relative inline en su contenedor,
                        por eso el absolute va aquí y no en containerClassName */}
                    <div className="absolute inset-0">
                    <Sidebar
                        collapsible="none"
                        containerClassName="h-full"
                        className="h-full w-full overflow-hidden rounded-lg bg-mizume-primary"
                    >
                        <SidebarHeader
                            className={cn(
                                'flex-row items-center',
                                openDesktop ? 'justify-between' : 'justify-center px-0',
                            )}
                        >
                            {openDesktop && asideTitle && (
                                <span className="truncate text-lg font-semibold">
                                    {asideTitle}
                                </span>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleDesktop}
                                aria-label={openDesktop ? 'Plegar panel' : 'Desplegar panel'}
                                title={openDesktop ? 'Plegar panel' : 'Desplegar panel'}
                                aria-expanded={openDesktop}
                                className="shrink-0"
                            >
                                {openDesktop ? <PanelRightClose /> : <PanelRightOpen />}
                            </Button>
                        </SidebarHeader>

                        {openDesktop && (
                            <SidebarContent>
                                <SidebarGroup>
                                    {aside}
                                </SidebarGroup>
                            </SidebarContent>
                        )}
                    </Sidebar>
                    </div>
                    </div>
                )}
            </div>

            {aside && (
                <Sheet open={openMobile} onOpenChange={setOpenMobile}>
                    <SheetContent side="right" className="max-w-[85vw] bg-mizume-primary lg:hidden">
                        <SheetHeader>
                            <SheetTitle>{asideTitle ?? ''}</SheetTitle>
                        </SheetHeader>
                        {/* Sidebar provee el contexto Highlight que necesitan los SidebarMenuButton */}
                        <Sidebar
                            collapsible="none"
                            containerClassName="min-h-0 flex-1"
                            className="h-full w-full overflow-y-auto bg-transparent px-4 pb-4"
                        >
                            {aside}
                        </Sidebar>
                    </SheetContent>
                </Sheet>
            )}
        </BlogShowContext.Provider>
    );
};

/**
 * Botón para abrir el sidebar secundario en móvil.
 * Colócalo en cualquier nav dentro de <BlogShow>. Se oculta en escritorio.
 */
export const BlogShowTrigger = ({ className }: { className?: string }) => {
    const { hasAside, setOpenMobile } = useBlogShowContext();
    if (!hasAside) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(true)}
            aria-label="Abrir panel"
            title="Abrir panel"
            className={cn('lg:hidden', className)}
        >
            <PanelRightOpen />
        </Button>
    );
};

