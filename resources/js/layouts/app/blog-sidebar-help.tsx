import * as React from 'react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarMenuAction,
} from '@/components/animate-ui/components/radix/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/animate-ui/primitives/radix/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
    AudioWaveform,
    BadgeCheck,
    Bell,
    BookOpen,
    Bot,
    ChevronRight,
    ChevronsUpDown,
    Command,
    CreditCard,
    Folder,
    Forward,
    Frame,
    GalleryVerticalEnd,
    LogOut,
    Map,
    MoreHorizontal,
    PieChart,
    Plus,
    Settings2,
    Sparkles,
    SquareTerminal,
    Trash2,
    MegaphoneIcon,
    GavelIcon

} from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { DATA, CONTENT } from './blog-sidebar';

interface RenderProfileProps {
    isMobile: boolean
}

export const RenderProfileAuth = ({ isMobile }: RenderProfileProps) => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={DATA.user.avatar}
                                    alt={DATA.user.name}
                                />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {DATA.user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {DATA.user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={DATA.user.avatar}
                                        alt={DATA.user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {DATA.user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {DATA.user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Settings2 />
                                {CONTENT.profile.settings}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <MegaphoneIcon />
                                {CONTENT.profile.reports}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <GavelIcon />
                                {CONTENT.profile.policy}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}


/**
 * FUncion de Usuario Invitado
 * @returns 
 */
export const RenderProfileGuest = () => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className='w-full h-full flex justify-center items-center gap-2'>
                <div className='w-[50%] h-auto bg-btn-info text-btn-info-foreground  text-sm rounded-md cursor-pointer hover:bg-blue-500/90 text-center'>
                      <a href={route("login")}>Iniciar Session</a>
                </div>
                <div className='w-[50%] h-auto bg-btn-danger text-sm text-btn-danger-foreground rounded-md cursor-pointer hover:bg-red-500/70 text-center'>
                      <a href={route("register")}> Registrarse </a>
                </div>
            </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}


function BlogSidebarHelp() {
    return (
        <div>blog-sidebar-help</div>
    )
}





export default BlogSidebarHelp