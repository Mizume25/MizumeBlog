/*** @import Imports de Inerficies de Formularios y objetos submit */
import { Label } from '@/components/ui/label';
/*** @import Variables de Estado  y de referencia */

/** @imports Interfaces y Diseño Web + Iconos */
import InputError from '@/components/input-error';
import { useImageLogic } from '@/hooks/use-image-logic';
import { ArtworkSchema, CreateArtworkSchemaOutput } from '@/types';
import { Button, Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowBigLeft, Book, CheckCircle2, Folder, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const ImageForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        formState: { isSubmitting },
    } = useForm({
        resolver: zodResolver(ArtworkSchema),
    });

    const [processing, setProcessing] = useState(false);

    const onSubmit = (data: CreateArtworkSchemaOutput) => {
        setProcessing(true);

        const formData = new FormData();
        if (data.title) formData.append('title', data.title);
        if (data.images && data.images.length > 0) {
            Array.from(data.images).forEach((file) => {
                formData.append('images[]', file);
            });
        }

        if (data.photos && data.photos.length > 0) {
            data.photos.forEach((photo, i) => {
                formData.append(`photos[${i}][name]`, photo.name);
                formData.append(`photos[${i}][alt]`, photo.alt);
                if (photo.num !== undefined && photo.num !== null) {
                    formData.append(`photos[${i}][num]`, String(photo.num));
                }
            });
        }

        router.post(route('artwork.store'), formData, {
            onSuccess: () => {
                reset();
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const images = watch('images');

    const { imageAlts, setAlt, allCompleted } = useImageLogic(images);

    const [alt, setalt] = useState(false);

    useEffect(() => {
        if (images && images.length > 0) setalt(true);
    }, [images]);

    useEffect(() => {
        setValue('photos', imageAlts);
    }, [imageAlts]);

    return (
        <>
            <div>
                <div>
                    <div className="mx-auto flex flex-row gap-4 rounded-lg p-4 shadow-lg sm:p-8 lg:min-w-150">
                        <form
                            onSubmit={handleSubmit(onSubmit, (errors) => console.log('Errores de validación:', errors))}
                            className="w-100 rounded-2xl bg-[#754C22] p-4"
                        >
                            <div className="flex flex-row justify-between gap-2 text-center">
                                {/** Link de Vuelta */}
                                <div className="flex flex-row">
                                    <a
                                        href={route('post.panel')}
                                        className="flex cursor-pointer items-center gap-2 text-white/30 transition-transform duration-150 hover:-translate-x-1.5"
                                    >
                                        <ArrowBigLeft size={26} className="text-white" />
                                        Volver
                                    </a>
                                </div>
                            </div>

                            <div className="min:h-96 mt-10 flex w-full flex-col gap-8">
                                {/*  Titulo de la obra   */}
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-xl text-white">
                                        <Book size={19} />
                                        <span>Titlo de la obra</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        {...register('title')}
                                        placeholder="Title work..."
                                        className="rounded-xl border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
                                    <InputError message={errors.title?.message} className="bg-[#754C22]/40" />
                                </div>
                                {/*  Titulo de la carpeta   */}
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-xl text-white">
                                        <Folder size={19} />
                                        <span>Carpeta</span>
                                    </Label>
                                    <Input
                                        disabled
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        placeholder="System Folder Name..."
                                        className="rounded-xl border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="h-12 w-full cursor-pointer rounded-2xl bg-[#e2d255] font-bold text-[#885200] transition-transform duration-150 hover:scale-105"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    Crear Artwork
                                </Button>
                            </div>
                        </form>

                        {/* Pantalla de preview, como hermano del form dentro del mismo flex */}
                        <div className="h-80 w-100 flex-shrink-0 flex-col rounded-2xl bg-[#e5c385] p-7">
                            <label className="flex h-full cursor-pointer flex-row items-center justify-center gap-2 rounded-2xl border-4 border-dotted border-white/50 bg-white/30 ps-4 transition-transform duration-150 hover:scale-105">
                                {images === undefined || images.length === 0 ? (
                                    <>
                                        <Upload size={26} />
                                        <p className="text-center text-black">Subir Imagenes </p>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={26} color="green" />
                                        <p className="text-green-800">{`${images.length} Imagenes por subir`}</p>
                                    </>
                                )}
                                <Input
                                    id="images"
                                    type="file"
                                    className="hidden"
                                    accept=".jpg, .jpeg, .png, .webp"
                                    multiple
                                    {...register('images')}
                                />
                                <InputError message={errors.images?.message} />
                                <InputError message={errors.photos?.message} />
                            </label>
                        </div>
                    </div>
                </div>

                <Dialog open={alt} onClose={() => {}} className="relative z-50">
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                        <DialogPanel className="max-h-[90vh] w-full max-w-4xl rounded-2xl bg-white p-6">
                            <DialogTitle className="text-lg font-bold">Descripciones de Imágenes</DialogTitle>
                            <p className="mt-1 mb-4 text-sm text-gray-600">Añade una descripción para cada imagen antes de subirla</p>

                            <div className="scrollbar-gutter-stable flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-2">
                                {Array.from(images ?? []).map((file, i) => (
                                    <div key={file.name} className="flex items-center gap-4 rounded-xl bg-gray-100 p-3">
                                        <img src={URL.createObjectURL(file)} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-black">{file.name}</p>
                                            <input
                                                type="text"
                                                placeholder="Sin descripción"
                                                onChange={(e) => setAlt(i, e.target.value)}
                                                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                className={`mt-10 h-12 w-100 cursor-pointer rounded-2xl bg-green-400 font-bold text-white transition-transform duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40`}
                                tabIndex={4}
                                disabled={!allCompleted}
                                onClick={() => setalt(false)}
                            >
                                Confirmar
                            </Button>
                        </DialogPanel>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default ImageForm;
