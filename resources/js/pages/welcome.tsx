import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
           <div className="flex min-h-screen items-center justify-center p-6">
            
            <div className="w-full max-w-md rounded-lg border border-border  p-8 shadow-lg text-center bg-[#754C22]">
                
                <h1 className="mb-2 text-3xl text-[2.2rem] font-bold text-white  tracking-tight drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                    MizumeBlog
                </h1>
                <p className="mb-8 text-muted-foreground">
                    {auth.user ? `Bienvenido de nuevo, ${auth.user.name}` : 'Blog personal'}
                </p>

                <div className="flex flex-col gap-4">
                    {auth.user ? (
                        /* CASO 1: Sesión Iniciada */
                        <Link
                            href={route('dashboard')}
                            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/10"
                        >
                            Ir al Dashboard
                        </Link>
                    ) : (
                        /* CASO 2: Usuario No Identificado */
                        <>
                            <Link
                                href={route('login')}
                                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                Iniciar Sesión
                            </Link>

                            <Link
                                href={route('register')}
                                className="inline-flex h-12 items-center justify-center rounded-md bg-[#F3E5AB] px-6 font-semibold text-[#5D3A1A] transition-all hover:bg-[#2D1B0D] hover:text-[#D2B48C]"
                            >
                                Crear Cuenta
                            </Link>

                            <Link
                                href={route('dashboard')}
                                className="inline-flex h-12 items-center justify-center rounded-md border border-[#F3E5AB]/60 px-6 font-semibold text-[#F3E5AB] transition-all hover:bg-[#F3E5AB]/10"
                            >
                                Entrar como Invitado
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
