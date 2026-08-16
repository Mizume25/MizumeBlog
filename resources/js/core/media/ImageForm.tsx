/*** @import Imports de Inerficies de Formularios y objetos submit */
import { Label } from '@/components/ui/label';
/*** @import Variables de Estado  y de referencia */

/** @imports Interfaces y Diseño Web + Iconos */
import InputError from '@/components/input-error';

/** @imports Objeto de Routing */
import { router } from '@inertiajs/react';

/** @imports Emojis */
import { ArrowBigLeft, Book, CheckCircle2, Folder, Upload } from 'lucide-react';

/** @imports Hooks utilizados */
import { useImageLogic } from '@/hooks/use-image-logic';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

/** @imports Objetos de Formularios */
import { ArtworkSchema, CreateArtworkSchemaOutput, Post } from '@/types';
import { Button, Dialog, DialogPanel, DialogTitle, Input, Select } from '@headlessui/react';
import Switch from 'react-switch';
import { zodResolver } from '@hookform/resolvers/zod';

const ImageForm = ( { posts } : { posts: Post[]}) => {
    /** Hook de formulario */
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

    /**
     * Variables de Formulario
     */

    const images = watch('images');

    /**
     * Logica de agregado de texto alternativos a imagenes
     */
    const { imageAlts, setAlt, allCompleted, moveImage } = useImageLogic(images);

    /**
     * @global Variables de Estado Usadas
     */

    /** Variable de procesamiento submit */
    const [processing, setProcessing] = useState(false);

    /** Varaible de Modal abierto y cerrado  */
    const [isOpen, setIsOpen] = useState(false);

     const [showAssociate, setShowAssociate] = useState(true);
    const [post, setPost] = useState<number | null>(null);

    /**
     * Variable de control para abrir en caso de que se suban imagenes
     */
    useEffect(() => {
        if (images && images.length > 0) setIsOpen(true);
    }, [images]);

    /**
     * Varaible de control para setear texto alternativo
     */
    useEffect(() => {
        setValue('photos', imageAlts);
    }, [imageAlts]);

    /**
     * Funcion para realizar el store de Artwork
     * @param data
     */
    const onSubmit = (data: CreateArtworkSchemaOutput) => {
        setProcessing(true);

        const formData = new FormData();
        if (data.title) formData.append('title', data.title);
        if (data.post_id) formData.append('post_id', String(data.post_id));
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

    useEffect(() => {
        if (posts.length > 0) {
            setPost(posts[0].id);
            setValue('post_id', posts[0].id);
        }
    }, []);

    const onAsociate = () => {
        setShowAssociate((prev) => !prev);
        console.log(showAssociate);
        if (showAssociate) {
            setPost(posts[0].id);
        } else {
            setPost(null);
        }
    };

    const onChangePost = (id: number) => {
        setPost(id);
        setValue('post_id', id);
    };

    return (
        <>
            <div className="w-full p-4">
                <div className="mx-auto flex w-full max-w-6xl flex-wrap items-stretch justify-center gap-6">
                    {/*   Contendor de Formulario   */}
                    <form
                        onSubmit={handleSubmit(onSubmit, (errors) => console.log('Errores de validación:', errors))}
                        className="min-w-80 flex-1 basis-100 rounded-2xl bg-[#754C22] p-6 shadow-lg"
                    >
                        <div className="flex flex-row justify-between gap-2 text-center">
                            {/** Link de Vuelta */}
                            <div className="flex flex-row">
                                <a
                                    href={route('post.panel')}
                                    className="flex cursor-pointer items-center gap-2 text-white/30 transition-transform duration-150 hover:-translate-x-1.5"
                                >
                                    <ArrowBigLeft size={24} className="text-white" />
                                    <span>Volver</span>
                                </a>
                            </div>
                        </div>

                        <div className="mt-8 flex w-full flex-col gap-6">
                            {/*  Titulo de la obra   */}
                            <div className="flex flex-col gap-2">
                                <Label className="flex items-center gap-2 text-lg whitespace-nowrap text-white">
                                    <Book size={19} />
                                    <span>Título de la obra</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    {...register('title')}
                                    placeholder="Title work..."
                                    className="rounded-xl border-white/20 bg-white/30 p-3 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                />
                                <InputError message={errors.title?.message} className="bg-[#754C22]/40" />
                            </div>
                            {/*  Titulo de la carpeta   */}
                            <div className="flex flex-col gap-2">
                                <Label className="flex items-center gap-2 text-lg whitespace-nowrap text-white">
                                    <Folder size={19} />
                                    <span>Carpeta</span>
                                </Label>
                                <Input
                                    disabled
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    placeholder="System Folder Name..."
                                    className="rounded-xl border-white/20 bg-white/30 p-3 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="flex items-center gap-2 text-lg whitespace-nowrap text-white">
                                    <Folder size={19} />
                                    <span>Posts</span>
                                </Label>
                                <Select
                                    disabled={!showAssociate}
                                    id="post"
                                    className="rounded-2xl bg-white/30 p-2 text-gray-50 capitalize"
                                    onChange={(e) => onChangePost(Number(e.target.value))}
                                >
                                    {posts.map((p) => (
                                        <option value={p.id} key={p.id} className="bg-white/30 text-black capitalize">
                                            {p.title}
                                        </option>
                                    ))}
                                </Select>

                                <Switch
                                    checked={showAssociate}
                                    onChange={onAsociate}
                                    onColor="#07a202"
                                    offColor="#454545"
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="h-14 w-full cursor-pointer rounded-2xl bg-[#e2d255] font-bold text-[#885200] transition-transform duration-150 hover:scale-105"
                                tabIndex={4}
                                disabled={processing}
                            >
                                Crear Artwork
                            </Button>
                        </div>
                    </form>

                    {/* Screen para subir imagenes */}
                    <div className="min-w-80 flex-1 basis-100 flex-col rounded-2xl bg-[#e5c385] p-6 shadow-lg">
                        <label className="flex h-full min-h-70 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-4 border-dotted border-white/50 bg-white/30 px-6 text-center transition-transform duration-150 hover:scale-[1.02]">
                            {images === undefined || images.length === 0 ? (
                                <>
                                    <Upload size={40} />
                                    <p className="text-xl text-black">Subir Imágenes</p>
                                    <p className="text-sm text-black/50">Arrastra tus archivos aquí o haz click para seleccionar</p>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={40} color="green" />
                                    <p className="text-xl text-green-800">{`${images.length} Imágenes por subir`}</p>
                                </>
                            )}
                            <Input id="images" type="file" className="hidden" accept=".jpg, .jpeg, .png, .webp" multiple {...register('images')} />
                            <InputError message={errors.images?.message} />
                            <InputError message={errors.photos?.message} />
                        </label>
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                    <DialogPanel className="max-h-[90vh] w-full max-w-4xl rounded-2xl bg-white p-6">
                        <DialogTitle className="text-lg font-bold">Descripciones de Imágenes</DialogTitle>
                        <p className="mt-1 mb-4 text-sm text-gray-600">
                            Añade una descripción y ordena las imágenes según el orden de las claves en tu markdown
                        </p>

                        <div className="scrollbar-gutter-stable flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-2">
                            {imageAlts.map((item, i) => {
                                const file = Array.from(images ?? []).find((f) => f.name === item.name);
                                if (!file) return null;

                                return (
                                    <div key={item.name} className="flex items-center gap-3 rounded-xl bg-gray-100 p-3">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveImage(i, -1)}
                                                disabled={i === 0}
                                                className="cursor-pointer rounded bg-gray-300 px-2 py-0.5 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                ▲
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveImage(i, 1)}
                                                disabled={i === imageAlts.length - 1}
                                                className="cursor-pointer rounded bg-gray-300 px-2 py-0.5 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                ▼
                                            </button>
                                        </div>

                                        <img src={URL.createObjectURL(file)} className="h-16 w-16 shrink-0 rounded-lg object-cover" />

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-black">
                                                {i + 1}. {item.name}
                                            </p>
                                            <input
                                                type="text"
                                                value={item.alt}
                                                placeholder="Sin descripción"
                                                onChange={(e) => setAlt(i, e.target.value)}
                                                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Button
                            type="button"
                            className="mt-10 h-12 w-full cursor-pointer rounded-2xl bg-green-400 font-bold text-white transition-transform duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 lg:w-100"
                            tabIndex={4}
                            disabled={!allCompleted}
                            onClick={() => setIsOpen(false)}
                        >
                            Confirmar
                        </Button>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default ImageForm;
