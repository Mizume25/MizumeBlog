import { SharedData } from '@/types';
import { usePage, Link } from '@inertiajs/react';

function BlogTopLogin() {
        const { auth } = usePage<SharedData>().props;
  return (
     <div className="hidden items-center gap-6 justify-self-end text-sm font-medium lg:flex">
                {!auth.user ? (
                    <>
                        <Link href={route('login')} className="text-primary font-bold btn-hover-scale rounded px-3 py-1 transition-colors hover:bg-btn-info hover:text-white">
                            Iniciar Sesión
                        </Link>
                        <Link
                            href={route('register')}
                            className="text-primary btn-hover-scale font-bold rounded px-3 py-1 transition-colors hover:bg-btn-danger hover:text-white"
                        >
                            Registrarse
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href={route('logout')} className="hover:underline">
                            Log out
                        </Link>
                    </>
                )}
            </div>
  )
}

export default BlogTopLogin;