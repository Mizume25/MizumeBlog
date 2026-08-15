/*** @import Imports de Inerficies de Formularios y objetos submit */
import { Label } from '@/components/ui/label';
/*** @import Variables de Estado  y de referencia */

/** @imports Interfaces y Diseño Web + Iconos */
import InputError from '@/components/input-error';
import { useImageLogic } from '@/hooks/use-image-logic';
import { Artwork, Artwork_Image, ArtworkSchema, confirmDelete, CreateArtworkSchemaOutput } from '@/types';
import { Button, Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowBigLeft, Book, CheckCircle2, Folder, Image, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface ImageEditProps {
    artwork: Artwork;
    pictures: Artwork_Image[];
}

const ImageFormEdit = ({ artwork, pictures }: ImageEditProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(ArtworkSchema),
        defaultValues: {
            title: artwork.title,
        },
    });

    const [processing, setProcessing] = useState(false);

    const handleUpdate = (data: CreateArtworkSchemaOutput) => {
        setProcessing(true);
        const formData = new FormData();
        formData.append('_method', 'put');
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

        router.post(route('artwork.update', artwork.id), formData, {
            onSuccess: () => {
                reset();
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const updateAlt = () => {
        router.put(
            `/artwork/${artwork.id}/img/${picture.id}`,
            { alt: altValue },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const [picture, setPicture] = useState<Artwork_Image>(pictures[0] ?? null);

    const [altValue, setAltValue] = useState(picture?.alt ?? '');

    const images = watch('images');

    const { imageAlts, setAlt, allCompleted } = useImageLogic(images);

    const [alt, setalt] = useState(false);

    useEffect(() => {
        if (images && images.length > 0) setalt(true);
    }, [images]);

    useEffect(() => {
        setValue('photos', imageAlts);
    }, [imageAlts]);

    useEffect(() => {
        setAltValue(picture?.alt ?? '');
    }, [picture]);

    /** Borra Artworks */
    const handleDelete = () => {
        confirmDelete('¿Eliminar Artwork?', `Esta acción borrará "${artwork.title}" permanentemente.`, () =>
            router.delete(route('artwork.destroy', artwork.id)),
        );
    };

    /** Borra Imagenes Especificas */
    const handleDeleteImage = (name: string, id: number | undefined) => {
        if (id === undefined || name === undefined) return;
        confirmDelete('¿Eliminar Imagen?', `Esta acción eliminara "${name}" permanentemente.`, () => {
            router.delete(route('artwork.remove', [artwork.id, id]), {
                onSuccess: () => {
                    const rest = pictures.filter((p) => p.id !== id);
                    setPicture(rest[0] ?? null);
                },
            });
        });
    };

    return (
        <>
            <div>
                <div>
                    <div className="mx-auto flex flex-row gap-4 rounded-lg p-4 shadow-lg sm:p-8 lg:min-w-150">
                        <form
                            onSubmit={handleSubmit(handleUpdate, (errors) => console.log('Errores de validación:', errors))}
                            className="h-140 w-100 rounded-2xl bg-[#754C22] p-6"
                        >
                            <div className="flex flex-row justify-between gap-2 text-center">
                                {/** Link de Vuelta */}
                                <div className="flex flex-row">
                                    <a
                                        href={route('artwork.index')}
                                        className="flex cursor-pointer items-center gap-2 text-white/30 transition-transform duration-150 hover:-translate-x-1.5"
                                    >
                                        <ArrowBigLeft size={26} className="text-white" />
                                        Volver
                                    </a>
                                </div>
                            </div>

                            <div className="mt-10 flex w-full flex-col gap-8">
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
                                        value={artwork.code}
                                        tabIndex={1}
                                        placeholder="System Folder Name..."
                                        className="rounded-xl border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
                                </div>
                            </div>

                            <Label className="mt-5 flex items-center gap-2 text-xl text-white">
                                <Folder size={19} />
                                <span>Imagenes</span>
                            </Label>
                            <label className="mt-2 flex h-14 cursor-pointer flex-row items-center justify-center gap-2 rounded-2xl border-4 border-dotted border-white/50 bg-white/30 ps-4 transition-transform duration-150 hover:scale-105">
                                {images === undefined || images.length === 0 ? (
                                    <>
                                        <Upload size={26} className="text-white" />
                                        <p className="text-center text-white">Subir Imagenes </p>
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
                                <InputError message={errors.images?.message} className="bg-[#754C22]/40" />
                                <InputError message={errors.photos?.message} className="bg-[#754C22]/40" />
                            </label>

                            <Button
                                type="submit"
                                className="mt-5 h-12 w-full cursor-pointer rounded-2xl bg-[#e2d255] font-bold text-[#885200] transition-transform duration-150 hover:scale-105"
                                tabIndex={4}
                                disabled={processing}
                            >
                                Actualizar Artwork
                            </Button>

                            <Button
                                type="button"
                                className="mt-5 flex h-12 w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-[#df3a3a] font-bold text-white transition-transform duration-150 hover:scale-105"
                                tabIndex={4}
                                onClick={handleDelete}
                            >
                                Eliminar Artwork
                            </Button>
                        </form>

                        {/* Pantalla de preview, como hermano del form dentro del mismo flex */}
                        <div className="h-130 pb-15 w-140 flex-shrink-0 flex-col rounded-2xl bg-[#e5c385] p-7">
                            {pictures.length === 0 || pictures === undefined ? (
                                <>
                                    <p className="text-center text-xl text-black">No Hay Imagenes Disponibles</p>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={`/storage/IMG/${artwork.code}/${picture.name}`}
                                        alt={`${picture.alt}`}
                                        className="h-full w-full cursor-pointer rounded-2xl object-contain transition-transform duration-200 group-hover:scale-110"
                                    />
                                
                                    <Input
                                        type="text"
                                        value={altValue}
                                        onChange={(e) => setAltValue(e.target.value)}
                                        onBlur={updateAlt}
                                        placeholder="Sin descripción"
                                        className="-mt-2 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                                    />

                                     <Button
                                        type="submit"
                                        className="mt-10 h-12 w-full cursor-pointer rounded-2xl bg-green-400 font-bold text-white transition-transform duration-150 hover:scale-105"
                                        tabIndex={4}
                                        onClick={() => updateAlt()}
                                    >
                                        Actualizar {picture.name}
                                    </Button>
                               
                                    <Button
                                        type="submit"
                                        className="mt-2 h-12 w-full cursor-pointer rounded-2xl bg-[#df3a3a] font-bold text-white transition-transform duration-150 hover:scale-105"
                                        tabIndex={4}
                                        onClick={() => handleDeleteImage(picture.name, picture.id)}
                                    >
                                        Eliminar {picture.name}
                                    </Button>
                                </>
                            )}
                        </div>

                        <div
                            className={`h-130 w-100 overflow-y-auto rounded-2xl bg-[#754C22] p-6 ${pictures === undefined || pictures.length === 0 ? 'hidden' : ''}`}
                        >
                            {/* contenido que puede exceder la altura */}

                            <div className="flex w-full flex-col gap-4">
                                <div
                                    className={`scrollbar-gutter-stable mt-2 flex min-h-0 flex-col gap-4 gap-x-4 overflow-y-auto p-3 pr-5 text-left`}
                                >
                                    {pictures.map((p, i) => {
                                        return (
                                            <Label
                                                key={i}
                                                className="text-md flex h-12 cursor-pointer flex-row items-center justify-start rounded-xl bg-amber-100 px-3 py-2 text-center text-black transition-transform duration-150 hover:scale-105"
                                                onClick={() => setPicture(p)}
                                            >
                                                <Image size={14} className="me-2 shrink-0" /> {p.name}
                                            </Label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para elegir obra */}
            {/* Modal para gestionar alt de imágenes */}
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
        </>
    );
};

export default ImageFormEdit;
