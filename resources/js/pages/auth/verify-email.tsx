// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, MailCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify email" description="">
            <Head title="Email verification" />

            <div className="rounded-xl border border-white/10 bg-black/40 p-8 text-center shadow-lg backdrop-blur-sm">

                <MailCheck className="mx-auto mb-4 h-12 w-12 text-green-400" />

                <h2 className="mb-2 text-xl font-bold text-white">Verifica tu correo electrónico</h2>
                <p className="mb-6 text-sm text-gray-300">
                    Hemos enviado un enlace de verificación a tu correo. Por favor revisa tu bandeja de entrada y haz clic en el enlace.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm font-medium text-green-400">
                        ¡Un nuevo correo ha sido enviado al correo que registraste!
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <Button disabled={processing} variant="secondary" className="w-full">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Reenviar Correo de Verificación
                    </Button>

                    <TextLink href={route('logout')} method="post" className="mx-auto block text-sm text-gray-400">
                        Cerrar sesión
                    </TextLink>
                </form>
            </div>

        </AuthLayout>
    );
}