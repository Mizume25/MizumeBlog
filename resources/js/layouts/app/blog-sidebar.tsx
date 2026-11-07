import * as React from 'react';
import { RenderProfileGuest, RenderProfileAuth, BlogNavigation } from './blog-sidebar-help';
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
  MegaphoneIcon,
  Home,
  UserCircle2,
  BookBookmark,
  FileWarning,
  LogOutIcon,
  LogIn,
  UserPlus,
  TurtleIcon


} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, router, usePage } from '@inertiajs/react';
import { Route, SharedData } from '@/types';
import BlogToggler from '@/components/ui/blog-toggler-';
import { useLangStore } from '@/store/lang-store';
import { ROUTE } from '@/constants/routes';




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
          name: 'Sobre MizumeBlog',
          url: "#",
          icon: TurtleIcon,

        },
        {
          name: 'Menu Principal',
          url: ROUTE.main,
          icon: Home,

        },
        {
          name: 'Autores',
          url: ROUTE.authors.index,
          icon: UserCircle2,
        },
        {
          name: 'Obras',
          url: ROUTE.work.index,
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
          name: 'About MizumeBlog',
          url: "#",
          icon: TurtleIcon,

        },
        {
          name: 'Home',
          url: ROUTE.main,
          icon: Home,

        },
        {
          name: 'Authors',
          url: ROUTE.authors.index,
          icon: UserCircle2,

        },
        {
          name: 'Works',
          url: ROUTE.work.index,
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
  routes: Route[]
}

export const BlogSidebar = ({ children, routes }: BlogSidebarProps) => {
  const isMobile = useIsMobile();

  const { auth, quote } = usePage<SharedData>().props;

  const lang = useLangStore((l) => l.lang)
  const setLang = useLangStore((l) => l.setLang)

  const { url: currentURL } = usePage();
  const content: DATA_TYPE = DATA[lang];

  const role: UserType = (auth?.user?.role as UserType | undefined) ?? "guest"




  // El item activo se deriva de la URL actual: no depende del idioma ni se pierde al recargar
  const isActive = (itemUrl: string) => {
    if (itemUrl === '#') return false
    const path = new URL(itemUrl, window.location.origin).pathname
    const current = currentURL.split('?')[0]
    return path === '/' ? current === '/' : current.startsWith(path)
  }

  const blogWebPolicies = [
    {
      title: "Aviso Legal",
    },
    {
      title: "Política de Privacidad",
    },
    {
      title: "Política de Cookies"
    },
    {
      title: "Términos y Condiciones de Uso"
    },
    {
      title: "Banner y Panel de Gestión de Cookies",
    },
    {
      title: "Cláusulas en Formularios y Comentarios",
    }
  ];



  const BlogFooter = () => {
    return (
      <footer className="w-full  text-header-foreground px-5 bg-header ">

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            {quote.message} - {quote.author}
          </p>
          <div className="flex flex-row items-center gap-4">
            {NETWORKS.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
                <p.icon size={30} />
              </a>
            ))}
          </div>
        </div>


        <ul className="list-none mt-4  pt-4 border-t border-current/40 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center gap-x-6 py-4">
          {blogWebPolicies.map((p) => (
            <li key={p.title} className="text-xs opacity-80">
              {p.title}
            </li>
          ))}
        </ul>
      </footer>
    );
  };

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
                  <SidebarMenuButton size={'lg'} asChild isActive={isActive(item.url)}>
                    <Link href={item.url} className='text-xl'>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
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

      <SidebarInset className="min-w-0">
        <header className="bg-header text-header-foreground flex min-h-16 shrink-0 items-center transition-[width,height] ease-linear md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full min-w-0 flex-col gap-2 px-4 py-2 md:flex-row md:items-center md:py-0">
            {/* Móvil: fila superior con trigger + navegación */}
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger className="-ml-1 shrink-0" />
              <Breadcrumb className="min-w-0 text-header-muted">
                <BreadcrumbList className="flex-nowrap">
                  <BreadcrumbItem className="hidden md:block text-header-muted">
                    <BreadcrumbLink href="#">
                    </BreadcrumbLink>
                  </BreadcrumbItem>


                  <BlogNavigation isMobile={isMobile} routes={routes} />

                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Móvil: fila inferior con botones; escritorio: a la derecha */}
            <div className="flex shrink-0 flex-row items-center justify-end gap-2 md:ml-auto">
              <LanguagueSwitch lang={lang} onLang={setLang} />

              <BlogToggler />

            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4  p-4">
          {children}
        </div>
        <BlogFooter />
      </SidebarInset>
    </SidebarProvider >
  );
};