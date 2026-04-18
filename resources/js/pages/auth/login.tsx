import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: any;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="MizumeBlog" description="Inicia session">
            <Head title="Iniciar Session" />

            {/* CONTENEDOR CENTRADO Y TARJETA MARRÓN */}
            <div className="mx-auto w-full max-w-md rounded-lg bg-[#754C22] p-8 shadow-lg border border-border/50">

                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        {/* EMAIL */}
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="email" className="text-white">Correo Electronico</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* PASSWORD */}
                        <div className="grid gap-2 text-left">
                            <div className="flex items-center">
                                <Label
                                    htmlFor="email"
                                    className="text-white my-custom-class"
                                >
                                    Contraseña
                                </Label>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="ml-auto text-sm text-white/70 hover:text-white" tabIndex={5}>
                                        ¿Olvidaste tu contraseña?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* REMEMBER ME */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', !!checked)}
                                className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-[#754C22] cursor-pointer"
                            />
                            <Label htmlFor="remember" className="text-white">Recuérdame</Label>

                        </div>

                        {/* BOTÓN LOGIN (BLANCO COMO EL DE LA WELCOME) */}
                        <Button
                            type="submit"
                            className="mt-4 w-full bg-white text-[#754C22] hover:bg-white/90 font-bold h-12 cursor-pointer"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Iniciar Sesión
                        </Button>
                        <div className="flex items-center justify-center">
                            <a
                                href="/auth/google"
                                className="bg-white flex items-center justify-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100 text-black w-[320px] pt-3 pb-3"
                            >
                                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                                <span className="leading-none">Continuar con Google</span>
                            </a>
                        </div>
                    </div>

                    {/* REGISTRO */}
                    <div className="text-white/70 text-center text-sm">
                        ¿No tienes cuenta?{' '}
                        <TextLink href={route('register')} className="text-white font-bold underline" tabIndex={5}>
                            Regístrate
                        </TextLink>
                    </div>
                </form>
            </div>

            {status && <div className="mt-4 text-center text-sm font-medium text-green-400">{status}</div>}
        </AuthLayout>
    );
}
