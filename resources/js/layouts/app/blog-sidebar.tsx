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
import { User, UserType } from '@/types/definitions';
import { useSidebar } from '@/components/animate-ui/components/radix/sidebar';
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
import { LanguagueSwitch } from '@/components/languague-switch'
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
  FileWarning,
  LogOutIcon,
  LogIn,
  UserPlus


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
import BlogToggler from '@/components/ui/blog-toggler-';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { useLangStore } from '@/store/lang-store';



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
  es: {
    title: "Mizumeblog",
    subtitle: "comunidad",
    sidebar: {
      header: "Contenido Principal",
      items: [
        {
          name: 'Menu Principal',
          url: '#',
          icon: Home,
        },
        {
          name: 'Archivador',
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
        sessionOut: {
          content: "Cerrar Session",
          icon: LogOutIcon
        },
        sessionIn: {
          content: "Iniciar Session",
          icon: LogIn
        },
        reports: "Reportes",
        policy: "Politicas",
        register: {
          content: "Registrate",
          icon: UserPlus
        },
      }
    },

  },
  en: {
    title: "Mizumeblog",
    subtitle: "community",
    sidebar: {
      header: "Main Content",
      items: [
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
          name: 'Authors',
          url: '#',
          icon: UserCircle2,
        },
        {
          name: 'Works',
          url: '#',
          icon: BookBookmark,
        },
        {
          name: 'Claims',
          url: '#',
          icon: FileWarning,
        },
        {
          name: 'Policy',
          url: '#',
          icon: MegaphoneIcon,
        },
      ],
      profile: {
        settings: "Profile",
        sessionOut: {
          content: "Log out",
          icon: LogOutIcon
        },
        sessionIn: {
          content: "Login",
          icon: LogIn
        },
        reports: "Reports",
        policy: "Policy",
        register: {
          content: "Register",
          icon: UserPlus
        },

      }
    },
  }
}

export type DATA_TYPE = typeof DATA.es




interface BlogSidebarProps {
  children: React.ReactNode;
}

export const BlogSidebar = ({ children }: BlogSidebarProps) => {
  const isMobile = useIsMobile();

  const { auth, quote } = usePage<SharedData>().props;

  const lang = useLangStore((l) => l.lang)
  const setLang = useLangStore((l) => l.setLang)


  const content: DATA_TYPE = DATA[lang];

  const role: UserType = (auth?.user?.role as UserType | undefined) ?? "guest"








  const BlogFooter = () => {
    return (
      <div className='w-full min-h-8 bg-mizume-fourthary text-mizume-fourthary-foreground flex flex-col lg:flex-row justify-center items-center p-4'>
        <div className='w-full lg:w-[50%]  h-full p-4'>
          <div className='h-full w-full text-[12px] '>
            <p> {quote.message} - {quote.author}
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
    role: UserType,
    user: User | null
  }


  const RenderProfileType = ({ isMobile, role, user }: ProfileFooterProps) => {
    const { open } = useSidebar();
    return (
      <SidebarFooter>
        {role !== "guest" ? (
          <RenderProfileAuth isMobile={isMobile} role={role} user={user} content={content} />
        ) : (
          <RenderProfileGuest content={content} open={open} />
        )}
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
                    {content.title}
                  </span>
                  <span className="truncate text-xs">
                    {content.subtitle}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* Team Switcher */}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className='text-lg'>{content.sidebar.header}</SidebarGroupLabel>
            <SidebarMenu >
              {content.sidebar.items.map((item) => (
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

        <RenderProfileType isMobile={isMobile} role={role} user={auth.user} />
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="bg-mizume-fourthary text-mizume-fourthary-foreground flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb className="text-mizume-secondary-foreground">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block text-mizume-secondary-foreground">
                  <BreadcrumbLink href="#">

                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-mizume-secondary-foreground" />
                <BreadcrumbItem className="text-mizume-secondary-foreground">
                  <BreadcrumbPage className="text-mizume-secondary-foreground"> Menu </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex flex-row items-center justify-center gap-2">
              <LanguagueSwitch lang={lang} onLang={setLang} />

              <BlogToggler />

            </div>
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