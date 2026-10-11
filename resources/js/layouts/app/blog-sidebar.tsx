import * as React from 'react';
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
import { SiInstagram, SiX, SiTiktok, SiGoodreads, SiLinkerd, SiGithub } from 'react-icons/si'
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
} from '@/components/animate-ui/components/radix/sidebar';

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  MegaphoneIcon,
  Home,
  FolderBookmark,
  UserCircle2,
  BookBookmark,
  FileWarning


} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { url } from 'zod';



const NETWORKS = [
  {
    url: "https://www.instagram.com/_mi_zume_/",
    icon: SiInstagram,
    name: "Instagram"
  },
  {
    url: "#",
    icon: SiX,
    name: "Twitter"
  },
  {
    url: "https://github.com/Mizume25",
    icon: SiGithub,
    name: "Github"
  },
  {
    url: "https://www.linkedin.com/in/gabriel-nivicela-86733035a/",
    icon: SiLinkerd,
    name: "Linkedin"
  },
  {
    url: "https://www.goodreads.com/mizume",
    icon: SiGoodreads,
    name: "Goreads"
  },
  {
    url: "https://www.tiktok.com/@m_gabi_?is_from_webapp=1&sender_device=pc",
    icon: SiTiktok,
    name: "Tik Tok"
  }

]

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
    {
      name: 'Reclamaciones',
      url: '#',
      icon: FileWarning,
    },
    {
      name: 'Politicas',
      url: '#',
      icon: MegaphoneIcon,
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

 



  const BlogFooter = ( ) => {
    return (
      <div className='w-full min-h-8 bg-mizume-fourthary text-mizume-fourthary-foreground flex flex-col lg:flex-row justify-center items-center p-4'>
        <div className='w-full lg:w-[50%]  h-full p-4'>
          <div className='h-full w-full text-[12px] '>
            <p> 'Act only according to that maxim whereby you can, at the same time, will that it should become a universal law. - Immanuel Kant'
            </p>
          </div>
        </div>
        <div className='w-full lg:w-[50%] h-full p-4'>
          <div className='h-full w-full justify-center lg:justify-end items-center flex flex-row gap-4'>
            {NETWORKS.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
                <p.icon size={30} />
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }


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
        <header className="bg-mizume-fourthary text-mizume-fourthary-foreground flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
        <div className="flex flex-1 flex-col gap-4  bg-[url(/IMG/Fondo.jpg)] p-4">
          {children}
        </div>
        <BlogFooter />
      </SidebarInset>
    </SidebarProvider>
  );
};