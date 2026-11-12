import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PROFILE_DATA } from '@/constants/profile-constants';
import { cn } from '@/lib/utils';
import { useLangStore } from '@/store/lang-store';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        url: '/settings/profile',
        
    },
    {
        title: 'Password',
        url: '/settings/password',
        
    },
    {
        title:'History',
        url:'/settings/history'
    }
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const currentPath = window.location.pathname;

    const lang = useLangStore((l) => l.lang)

     const DATA = PROFILE_DATA[lang];

    return (
        <div className="px-4 py-6 bg-mizume-primary rounded-2xl">
            <Heading title={DATA.title} description={DATA.subtitle} />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48 ">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {DATA.sidebar.map((item) => (
                            <Button
                                key={item.url}
                                size="sm"
                                variant="ghost"
                              
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.url,
                                })}
                            >
                                <Link href={item.url} prefetch classID=''>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-full h-screen">
                    <section className="max-w-full space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
