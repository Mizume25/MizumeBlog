import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/animate-ui/components/radix/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
    ChevronsUpDown,
    LogOut,
    Settings2,
    MegaphoneIcon,
    GavelIcon
} from 'lucide-react';
import { Button } from '@/components/animate-ui/components/buttons/button';

import { User, UserType } from '@/types/definitions';
import { Link, router } from "@inertiajs/react";
import { BlogProfile } from '@/core/desktop/utils-components';
import { DATA_TYPE } from './blog-sidebar';
import { Route } from '@/types';
import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { goBack } from '@/lib/utils';

interface RenderProfileProps {
    isMobile: boolean
    role: UserType
    user: User | null
    content: DATA_TYPE
}

export const RenderProfileAuth = ({ isMobile, role, user, content }: RenderProfileProps) => {


    const RenderAdminSettings = () => {
        return (
            <DropdownMenuItem>
                <GavelIcon />
                <a href="#">Panel</a>
            </DropdownMenuItem>
        )
    }

    const RenderEditorSettings = () => {
        return (
            <DropdownMenuItem>
                <GavelIcon />
                <a href="#">Panel</a>
            </DropdownMenuItem>
        )
    }

    const RenderSettingsExtra = () => {
        switch (role) {
            case "admin":
                return <RenderAdminSettings />
            case "editor":
                return <RenderEditorSettings />
            default:
                return null
        }
    }


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >

                            <BlogProfile name={user?.name} />


                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user?.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.email}
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
                                <BlogProfile name={user?.name} className='mx-auto w-10 h-10 rounded-full border-[3px] border-mizume-primary flex items-center justify-center select-none' />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user?.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Settings2 />
                                {content.sidebar.profile.settings}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <MegaphoneIcon />
                                {content.sidebar.profile.policy}
                            </DropdownMenuItem>
                            {role !== "guest" && <RenderSettingsExtra />}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut />
                            <Link href={route("logout")} method="post" as="button">
                                {content.sidebar.profile.sessionOut.content}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

interface RenderProfileGuestProps {
    content: DATA_TYPE,
    open: boolean
}
/**
 * FUncion de Usuario Invitado
 * @returns 
 */
export const RenderProfileGuest = ({ content, open }: RenderProfileGuestProps) => {

    const Login = content.sidebar.profile.sessionIn.icon
    const Register = content.sidebar.profile.register.icon
    let style = open ? "block" : "hidden"
    return (
        <SidebarMenu>
            <SidebarMenuItem>

                <Button variant={'ghost'} className='w-full mb-2' onClick={() => router.get("login")} >
                    <Login />
                    <p className={`${style}`}> {content.sidebar.profile.sessionIn.content}</p>
                </Button>
                <Button variant={'default'} className='w-full bg-btn-danger text-btn-danger-foreground hover:bg-red-300' onClick={() => router.get("register")} >
                    <Register />
                    <p className={`${style}`}> {content.sidebar.profile.register.content}</p>
                </Button>


            </SidebarMenuItem>
        </SidebarMenu>
    )
}


function BlogSidebarHelp() {
    return (
        <div>blog-sidebar-help</div>
    )
}

interface BlogNavigationProps {
    routes: Route[],
    isMobile: boolean
}

export const BlogNavigation = ({ routes, isMobile }: BlogNavigationProps) => {
    let ROUTES: Route[] = [];

    const safeRoutes = Array.isArray(routes) ? routes : [];

    if (isMobile) {
        if (safeRoutes.length <= 2) {
            ROUTES.push(...safeRoutes);
        } else {

            ROUTES = [
                safeRoutes[0],
                {
                    label: "...",
                    url: route("main"),
                },
                safeRoutes[safeRoutes.length - 1]
            ];
        }
    } else {
        ROUTES.push(...safeRoutes);
    }

    const LAST_ITEM = ROUTES.length - 1

    return ROUTES.map((r, index) => (
        <React.Fragment key={r.url || index}>
            <BreadcrumbItem className="text-mizume-secondary-foreground text-sm">
                <BreadcrumbPage className="text-mizume-secondary-foreground text-sm">
                    <Button
                        variant="link"
                        className="max-w-[40vw] text-mizume-secondary-foreground md:max-w-none text-sm m-0 px-3" 
                        onClick={() =>  r.label === "..." ?  goBack() :  router.get(r.url)}
                    >
                        <span className="truncate">{r.label}</span>
                    </Button>
                </BreadcrumbPage>
            </BreadcrumbItem>
            {LAST_ITEM != index && (
                <BreadcrumbSeparator className="text-mizume-secondary-foreground" />
            )}

        </React.Fragment>
    ));
};





export default BlogSidebarHelp