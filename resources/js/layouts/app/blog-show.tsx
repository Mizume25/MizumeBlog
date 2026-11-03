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
export const BlogShow = ({ children, aside, asideTitle, asideWidth = '23rem' }: BlogShowProps) => {
    

    const { openMobile, setOpenMobile, openDesktop, toggleDesktop, contextValue } = useBlogShow(!!aside);



    return (
        <BlogShowContext.Provider value={contextValue}>
            <div className="flex w-full gap-4">
                <div className="min-w-0 flex-1">{children}</div>

                {aside && (
                    <Sidebar
                        collapsible="none"
                        containerClassName="sticky top-4 hidden shrink-0 self-start lg:block"
                        style={{ '--aside-width': asideWidth } as React.CSSProperties}
                        className={cn(
                            'h-auto max-h-[calc(100svh-2rem)] overflow-hidden rounded-lg bg-mizume-primary transition-[width] duration-300',
                            openDesktop ? 'w-(--aside-width)' : 'w-12',
                        )}
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

