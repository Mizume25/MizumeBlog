import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

// Components...
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PROFILE_DATA_TYPE } from '@/constants/profile-constants';
import { Lang } from '@/store/lang-store';

interface DeleteUserPorps {
    DATA:PROFILE_DATA_TYPE,
    lang: Lang
}

export default function DeleteUser({ DATA , lang} : DeleteUserPorps) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6 bg-mizume-fourthary p-4 rounded-xl">
            <HeadingSmall title={DATA.profile.delete.title} description={DATA.profile.delete.subtitle} />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">{lang === "es" ? "Advertencia" : "Warning"}</p>
                    <p className="text-sm">{lang === "es" ? "El proceso es definitivo" : "The process is definitive."}</p>
                </div>

                <Dialog>
                    <DialogTrigger>
                        <Button variant="destructive"
                        className='bg-red-400 text-white rounded-2xl cursor-pointer transition-transform duration-150 hover:scale-105 hover:bg-red-500'
                        >{DATA.profile.delete.title}</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-mizume-secondary text-mizume-secondary-foreground ring-card-border [&_[data-slot=dialog-close]]:bg-mizume-fourthary [&_[data-slot=dialog-close]]:text-mizume-fourthary-foreground [&_[data-slot=dialog-close]]:hover:bg-item-active">
                        <DialogTitle className="text-mizume-primary">{DATA.profile.delete.modal.title}</DialogTitle>
                        <DialogDescription className="text-mizume-secondary-foreground/80">
                          {DATA.profile.delete.modal.message}
                        </DialogDescription>
                        <form className="space-y-6" onSubmit={deleteUser}>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">
                                {lang == "es" ? "Contraseña" : "Password"}
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    className="border-input-border bg-input text-input-foreground placeholder:text-input-placeholder focus-visible:ring-input-focus"
                                />

                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter>
                                <DialogClose>
                                    <Button variant="secondary" onClick={closeModal} className="bg-btn-secondary text-btn-secondary-foreground hover:bg-btn-secondary/80 cursor-pointer rounded-xl">
                                  {lang == "es" ? "Cancelar" : "Cancel"}
                                    </Button>
                                </DialogClose>

                                <Button variant="destructive" disabled={processing} className="bg-btn-danger text-btn-danger-foreground hover:bg-btn-danger/85 cursor-pointer">
                                    <button type="submit">{DATA.profile.actions.delete}</button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
