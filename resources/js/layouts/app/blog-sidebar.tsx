import * as React from 'react';
import { useEffect, useState } from 'react';
import { RenderProfileGuest, RenderProfileAuth } from './blog-sidebar-help';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UserType } from '@/types/definitions';
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
  Home,
  FolderBookmark,
  UserCircle2,
  BookBookmark,


} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { boolean } from 'zod';

export const DATA = {
  user: {
    name: 'Skyleen',
    email: 'skyleen@example.com',
    avatar:
      'https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};


/**
 * Texto del Sidebar
 * @returns 
 */
export const CONTENT = {
  title: "Mizumeblog",
  subtitle: "community",
  sidebar: [
    {
      name: 'Home',
      url: '#',
      icon: Home,
    },
    {
      name: 'Archive',
      url: '#',
      icon: FolderBookmark,
    },
    {
      name: 'Autores',
      url: '#',
      icon: UserCircle2,
    },
    {
      name: 'Obras',
      url: '#',
      icon: BookBookmark,
    },
  ],
  profile: {
    settings: "Perfil",
    session: "Log out",
    reports: "Reportes",
    policy: "Politicas"
  }
}

export const BlogSidebar = () => {
  const isMobile = useIsMobile();
  const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0]);
  const { auth } = usePage<SharedData>().props;

  const role: UserType = (auth?.user?.role as UserType | undefined) ?? "guest"

  if (!activeTeam) return null;



  interface ProfileFooterProps {
    isMobile: boolean,
    role: UserType  
  }


  const RenderProfileType = ({ isMobile, role }: ProfileFooterProps) => {
    return (
      <SidebarFooter>
        <RenderProfileAuth isMobile={isMobile} role={role} />
      </SidebarFooter>
    )
  }

  return (
    <SidebarProvider className='bg-mizume-primary'>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          {/* Team Switcher */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src='/Icons/turtle/turtle-reader.png' />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {CONTENT.title}
                  </span>
                  <span className="truncate text-xs">
                    {CONTENT.subtitle}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* Team Switcher */}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className='text-lg'>Contenido Principal</SidebarGroupLabel>
            <SidebarMenu >
              {CONTENT.sidebar.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton size={'lg'} asChild>
                    <a href={item.url} className='text-lg'>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? 'bottom' : 'right'}
                      align={isMobile ? 'end' : 'start'}
                    >
                      <DropdownMenuItem>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {/* Nav Project */}
        </SidebarContent>

        <RenderProfileType isMobile={isMobile} role={role} />
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[url(/IMG/Fondo.jpg)]">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-white/80" />
            <div className="aspect-video rounded-xl bg-white/80" />
            <div className="aspect-video rounded-xl bg-white/80" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};