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

interface BlogSidebarProps {
  children: React.ReactNode;
}

export const BlogSidebar = ({ children }: BlogSidebarProps) => {
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
                    <a href={item.url} className='text-xl'>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
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
        <header className="bg-mizume-tertiary text-mizume-tertiary-foreground flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb className='text-mizume-secondary-foreground'>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block text-mizume-secondary-foreground">
                  <BreadcrumbLink href="#">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='text-mizume-secondary-foreground' />
                <BreadcrumbItem className='text-mizume-secondary-foreground'>
                  <BreadcrumbPage className='text-mizume-secondary-foreground"'> Menu </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[url(/IMG/Fondo.jpg)]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};