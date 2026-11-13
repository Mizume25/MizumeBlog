import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Route, SharedData, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BlogLayout } from '@/layouts/app';
import { useLangStore } from '@/store/lang-store';
import { PROFILE_DATA } from '@/constants/profile-constants';




export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const { auth } = usePage<SharedData>().props

    const lang = useLangStore((l) => l.lang)

    const DATA = PROFILE_DATA[lang];

    const routes: Route[] = [
        {
            label: auth.user.name,
            url: route("profile.edit")
        }
    ]

    return (
        <BlogLayout routes={routes} >
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6 bg-mizume-fourthary p-4 rounded-2xl">
                    <HeadingSmall title={DATA.password.title} description={DATA.password.subtitle} />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label className='text-mizume-fourthary-foreground' htmlFor="current_password">{DATA.password.labels.current}</Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full bg-mizume-fourthary-foreground text-mizume-fourthary"
                                autoComplete="current-password"
                                placeholder={DATA.password.labels.current}
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label className='text-mizume-fourthary-foreground' htmlFor="password">{DATA.password.labels.new}</Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full bg-mizume-fourthary-foreground text-mizume-fourthary"
                                autoComplete="new-password"
                                placeholder={DATA.password.labels.new}
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label className='text-mizume-fourthary-foreground' htmlFor="password_confirmation">{DATA.password.labels.confirm}</Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="mt-1 block w-full bg-mizume-fourthary-foreground text-mizume-secondary"
                                autoComplete="new-password"
                                placeholder={DATA.password.labels.confirm}
                            />

                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}
                                className='bg-amber-600 rounded-2xl cursor-pointer transition-transform duration-150 hover:scale-105 hover:bg-amber-700'
                            >{DATA.password.actions.save}</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">{lang === "es" ? "Guardado" : "Saved" }</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </BlogLayout>
    );
}
