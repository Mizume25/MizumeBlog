import { SharedData, WEB_ROUTE } from '@/types';
import { Link, usePage } from '@inertiajs/react';

import LogoutButton from '../../core/auth/LogoutButton';
import BlogTopHeader from '@/components/top/blog-top-header';
import BlogTopRoutes from '@/components/top/blog-top-routes';
import BlogTopTitle from '@/components/top/blog-top-title';


export function BlogTopBar() {
    const { auth } = usePage<SharedData>().props;

    return (
        <BlogTopHeader>
            {/* Nav: oculta en mobile */}
            <BlogTopRoutes />


            <BlogTopTitle />

            {/* Auth buttons: ocultos en mobile */}
            <div className="hidden items-center gap-6 justify-self-end text-sm font-medium lg:flex">
                {!auth.user ? (
                    <>
                        <Link href={route('login')} className="hover:underline">
                            Iniciar Sesión
                        </Link>
                        <Link
                            href={route('register')}
                            className="bg-primary text-primary-foreground btn-hover-scale rounded px-3 py-1 transition-colors hover:bg-[#4a3728]"
                        >
                            Registrarse
                        </Link>
                    </>
                ) : (
                    <>
                        <LogoutButton />
                    </>
                )}
            </div>

            <div>

            </div>
        </BlogTopHeader >
    );
}

export default BlogTopBar;
