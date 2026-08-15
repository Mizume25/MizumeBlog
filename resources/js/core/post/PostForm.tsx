/*** @import Imports de Inerficies de Formularios y objetos submit */
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Switch from 'react-switch';

/*** @import Variables de Estado  y de referencia */
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

/** @imports Interfaces y Diseño Web + Iconos */
import {
    Artwork,
    Artwork_Image,
    ArtworkInput,
    ArtworkPictures,
    OPTION_CATEGORY,
    PostImageWithImage,
    PostSchema,
    type CreatePostSchemaInput,
    type CreatePostSchemaOutput,
} from '@/types';
import { Button, Dialog, DialogPanel, DialogTitle, Input, Select, Textarea } from '@headlessui/react';
import {
    ArrowBigLeft,
    Book,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Computer,
    File,
    Folder,
    Image,
    LoaderCircle,
    Paperclip,
    Pencil,
    Settings,
    Tag,
    Tags,
    User,
} from 'lucide-react';

/**
 * @inteface Propiedades props para edit y create
 */
interface PostFormProps {
    tags: string[];
    defaultValues?: Partial<CreatePostSchemaInput>;
    onSubmit: SubmitHandler<CreatePostSchemaOutput>;
    submitLabel?: string;
    processing?: boolean;
    cover_url?: string;
    card_url?: string;
    container?: Record<string, ArtworkPictures[]>;
    artworks: Artwork[];
    galeries?: Artwork[];
    post_id: number;
    photos: PostImageWithImage[] | undefined;
}

/**
 * @interface  Funcion de reset
 */
export interface PostFormHandle {
    resetForm: () => void;
}

const PostForm = forwardRef<PostFormHandle, PostFormProps>(
    (
        {
            tags,
            defaultValues,
            onSubmit,
            submitLabel = false,
            processing = false,
            cover_url,
            card_url,
            container,
            artworks,
            galeries,
            post_id,
            photos,
        },
        ref,
    ) => {
        /**
         * Hook Form con propiedades de control
         */
        const {
            register,
            handleSubmit,
            formState: { errors },
            control,
            setValue,
            reset,
            watch,
            getValues,
        } = useForm<CreatePostSchemaInput, unknown, CreatePostSchemaOutput>({
            resolver: zodResolver(PostSchema),

            defaultValues,
        });
        console.log(container);
        /**
         * Variables de contenido
         */
        const cover = watch('cover');
        const cover_card = watch('cover_card');
        const content = watch('content');
        const images = watch('images');

        /**
         * @global Varaibles Generales
         */

        /**
         * Item individual para crear un etiqueta
         */
        const [tag, setTag] = useState<string>('');

        /**
         * Item individual para crear un instancia de artwork
         */

        const [galery, setGalery] = useState('');

        /**
         * Variables de control para abrir/cerrar un MODAL
         */
        /** Mostrar tags, artworks , replace*/
        const [modaltags, setModalTags] = useState(false);
        const [modalartwork, setModalArtwork] = useState(false);
        const [modalreplace, setModalReplace] = useState<boolean>(false);
        const [modalslot, setModalSlot] = useState(false);

        /** Varaible para expandir informacion */
        /**
         * Variable para mostrar artworks selecionados
         */
        const [showFolders, setShowFolders] = useState(false);

        /**
         * Variable para mostrar tags selecionados
         */
        const [showTags, setShowTags] = useState(false);

        /**
         * Variable para mostrar sidebar de imagenes
         */
        const [isSidebar, setisSidebar] = useState(false);

        /**
         * Lista de Tags Obtenidos
         */
        const [list, setList] = useState<string[]>(defaultValues?.tags ?? []);

        /**
         * Varaibles de Gestion de imagenes
         */

        /** Representacion de carpetas relacionadas */
        const [folders, setFolders] = useState<ArtworkInput[]>(galeries ?? []);

        /** Representacion de 1 solo artwork */
        const [artwork, setArtwork] = useState<Artwork | null>(galeries?.[0] ?? null);

        /** Representacion 1 sola imagen */
        const [picture, setPicture] = useState<number>(-1);

        /** Imagenes Disponibles a remplazar */
        const [avaliables, setavAvaliables] = useState<Artwork_Image[]>([]);

        /** Control de imagen y contenido */
        const [coverPreview, setCoverPreview] = useState<string | null>(null);
        const [coverCardPreview, setCoverCardPreview] = useState<string | null>(null);
        const [contentPreview, setContentPreview] = useState<string | null>(null);

        /** Funcion para el preview de cover */
        useEffect(() => {
            const file = cover?.[0];
            if (!file) {
                setCoverPreview(null);
                return;
            }
            const url = URL.createObjectURL(file);
            setCoverPreview(url);

            return () => URL.revokeObjectURL(url);
        }, [cover]);

        /** Funcion para el preview de card */
        useEffect(() => {
            const file = cover_card?.[0];
            if (!file) {
                setCoverCardPreview(null);
                return;
            }
            const url = URL.createObjectURL(file);
            setCoverCardPreview(url);
            return () => URL.revokeObjectURL(url);
        }, [cover_card]);

        /** Funcion para inicializar preview cover */
        useEffect(() => {
            const file = cover?.[0];
            if (!file) {
                setContentPreview(null);
                return;
            }

            setContentPreview(file.name);
        });

        /**
         * Obtener Artwork
         */

        const getArtwork = (id: number | null): Artwork | null => {
            if (id == null) return null;
            return artworks.find((p) => p.id == id) ?? null;
        };

        /**
         * Funcion que refresca los tags
         * @param tags
         */
        const refreshTags = (tags: string) => {
            const normalize = tags
                .toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
            setList((prev) => {
                const current = prev.includes(normalize) ? prev.filter((g) => g !== normalize) : [...prev, normalize];

                setValue('tags', current);
                return current;
            });
        };

        /**
         * Funcion que refresca los folders
         * @type artwork
         */
        const refreshFolder = (artwork: ArtworkInput) => {
            setFolders((prev) => {
                const key = artwork.id ?? artwork.title;
                const exists = prev.some((a) => (a.id ?? a.title) === key);

                const current = exists ? prev.filter((a) => (a.id ?? a.title) !== key) : [...prev, artwork];

                setValue('works', current);
                return current;
            });
        };

        const [fileInputKey, setFileInputKey] = useState(0);

        /** Variable Imperativa */
        useImperativeHandle(ref, () => ({
            resetForm: () => {
                reset();
                setList(defaultValues?.tags ?? []);
                setFileInputKey((k) => k + 1);
            },
        }));

        /**
         * Funcion para añadir tags
         * @param tag
         */
        const addTag = (tag: string | null) => {
            /**
             * Comprobamos Valores
             */
            if (tag == null) return alert('El tag no puede ser nulo');

            const clean = tag.trim();

            if (clean.length === 0) return alert('El tag no puede ser vacío');

            /**
             * Normalizamos Valores
             */
            const normalize = clean
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            /** Refrescamos  */
            refreshTags(normalize);

            /** Limpiamos */
            setTag('');
        };

        /**
         * Funcion para añadir artworks
         * @param galery
         * @returns
         */
        const addArtwork = (galery: string | null) => {
            if (galery == null) return alert('La galeria no puede ser nulo');

            const clean = galery.trim();

            if (clean.length === 0) return alert('La galeria no puede ser vacío');

            const temp: ArtworkInput = {
                id: null,
                title: clean,
            };

            /** Refrescamos  */
            refreshFolder(temp);

            /** Limpiamos */
            setGalery('');
        };

        /** Abre y cierra sidebar */
        const onToogle = () => setisSidebar((prev) => !prev);

        /** Cambia de artwork */
        const changeArtwork = (id: number | undefined) => {
            if (id === undefined) return;
            let artwork = getArtwork(id);

            setArtwork(artwork);
        };

        /**
         * Api para obtener imagenes validas
         */
        const getAvaliablePicture = async (): Promise<Artwork_Image[]> => {
            const answer = await fetch(`/api/post/${post_id}/artwork/${artwork?.id}`);

            if (!answer.ok) throw new Error('Ha habido un problema');

            const response = await answer.json();

            return response;
        };

        /**
         * Funcion para Remplazar
         */
        const handleOpenReplace = async () => {
            const valids = await getAvaliablePicture();
            setavAvaliables(valids);
            setModalReplace(true);
        };

        /**
         * Varaible reactiva para poder abrir el modal de remplazo
         */
        useEffect(() => {
            if (artwork == undefined) return;
            if (picture === -1 || picture === undefined) return;
            setModalReplace(false);
            setavAvaliables([]);
        }, [picture]);

        /**
         * Remplazo accion
         */
        useEffect(() => {
            if (!artwork || picture === -1) return;
            handleOpenReplace();
        }, [picture]);

        const handleReplaceConfirm = async (newImage: Artwork_Image) => {
            if (newImage === undefined) return;
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/api/post/${post_id}/replace/${picture}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                },
                body: JSON.stringify({ artwork_image_id: newImage.id }),
            });

            if (!response.ok) throw new Error('No se pudo reemplazar la imagen con id:' + picture);

            setModalReplace(false);
            window.location.reload();
        };

        const onExpand = async () => {
            const valids = await getAvaliablePicture();
            setavAvaliables(valids);
            setModalSlot(true);
        };

        const [selectedSlotImage, setSelectedSlotImage] = useState<Artwork_Image | null>(null);
        const [slotKey, setSlotKey] = useState('');

        const handleExpandConfirm = async () => {
            if (!selectedSlotImage || !slotKey.trim()) return;

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch(`/api/post/${post_id}/assign-key`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken ?? '' },
                body: JSON.stringify({ key: slotKey, artwork_image_id: selectedSlotImage.id }),
            });

            if (!response.ok) throw new Error('No se pudo asignar la clave');

            setModalSlot(false);
            setSelectedSlotImage(null);
            setSlotKey('');
            window.location.reload();
        };

        return (
            <>
                {/** Formulario */}
                <div>
                    <div className="border-border/50 mx-auto rounded-lg border bg-[#754C22] p-4 shadow-lg sm:p-8 lg:min-w-150">
                        <form onSubmit={handleSubmit(onSubmit, (errors) => console.log('Errores de validación:', errors))}>
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
                                {/** Header */}
                                <div className="flex flex-row justify-end gap-2">
                                    <Label className="mb-2 hidden text-right text-white lg:inline">Destacado</Label>
                                    <Controller
                                        name="featured"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                lang="es"
                                                onColor="#b39e00"
                                                offColor="#454545"
                                                checked={field.value ?? false}
                                                onChange={field.onChange}
                                                checkedIcon={false}
                                                uncheckedIcon={false}
                                            />
                                        )}
                                    />
                                </div>

                                <InputError message={errors.featured?.message} />
                            </div>

                            <div className="mb-3 flex h-20 w-full flex-col p-4">
                                <Button
                                    type="button"
                                    className="h-full w-full cursor-pointer rounded-2xl bg-white font-bold text-[#754C22] transition-transform duration-150 hover:scale-105 hover:bg-white/90"
                                    tabIndex={4}
                                    onClick={() => setModalArtwork(true)}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Artwork
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 p-3 text-left lg:grid-cols-2 lg:gap-10">
                                {/**  Titulo de la obra  */}
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-white">
                                        <Book size={20} />
                                        <span>Titulo Obra</span>
                                    </Label>

                                    <Input
                                        id="title"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        {...register('title')}
                                        placeholder="Work Title..."
                                        className="rounded-md border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
                                    <InputError message={errors.title?.message} />
                                </div>

                                {/** Titulo Web */}
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-white">
                                        <Computer size={19} />
                                        <span>Titulo Web</span>
                                    </Label>
                                    <Input
                                        id="web_title"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        {...register('web_title')}
                                        placeholder="Web title work..."
                                        className="rounded-md border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
                                    <InputError message={errors.web_title?.message} />
                                </div>

                                {/** Tags */}
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-white">
                                        <Tags size={19} />
                                        <span>Tags</span>
                                    </Label>
                                    <Button
                                        type="button"
                                        className="h-12 w-full cursor-pointer rounded-2xl bg-white font-bold text-[#754C22] transition-transform duration-150 hover:scale-105 hover:bg-white/90"
                                        tabIndex={4}
                                        onClick={() => setModalTags(true)}
                                    >
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Add Tags
                                    </Button>
                                    <InputError message={errors.tags?.message} />
                                </div>

                                {/*** Autor de la Obra */}
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-white">
                                        <User size={19} />
                                        <span>Autor</span>
                                    </Label>
                                    <Input
                                        id="author"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        required
                                        {...register('author')}
                                        placeholder="Author name..."
                                        className="rounded-md border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
                                    <InputError message={errors.author?.message} />
                                </div>

                                {/** Fecha Públicación */}
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-white">
                                        <Calendar size={19} />
                                        <span>Fecha Públicación</span>
                                    </Label>
                                    <Input
                                        id="publish_date"
                                        type="date"
                                        autoFocus
                                        tabIndex={1}
                                        {...register('publish_date')}
                                        className="rounded-md border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
                                    <InputError message={errors.publish_date?.message} />
                                </div>

                                {/*** Categorias */}
                                <div className="mb-5 flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-white">
                                        <Tag size={19} />
                                        <span>Categoria</span>
                                    </Label>
                                    <Select id="category" {...register('category')} className="rounded-md bg-white/30 p-2 text-gray-50 capitalize">
                                        {OPTION_CATEGORY.map((p) => (
                                            <option value={p} key={p} className="bg-white/30 text-black capitalize">
                                                {p}
                                            </option>
                                        ))}
                                    </Select>

                                    <InputError message={errors.category?.message} />
                                </div>
                            </div>

                            {/*** Cover */}
                            <Label className="flex items-center gap-2 text-white">
                                <Tag size={19} />
                                <span>Cover y Card</span>
                            </Label>
                            <div className="flex h-auto w-full flex-col items-center gap-4 sm:h-70 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                                {/* Card */}

                                <label className="relative mb-5 flex h-50 w-full max-w-70 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-4 border-dotted border-white/50 bg-white/30 transition-transform duration-150 hover:scale-105 sm:w-45 sm:max-w-none">
                                    {card_url ? (
                                        <img
                                            src={`/IMG/Cards/${card_url}`}
                                            alt="Cover actual"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    ) : cover_card?.length !== 0 ? (
                                        <>
                                            <img
                                                src={coverCardPreview!}
                                                alt="Preview Cover"
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-white/50">Card</p>
                                            <Image className="text-white/50" />
                                        </>
                                    )}

                                    <Input
                                        id="cover_card"
                                        {...register('cover_card')}
                                        type="file"
                                        className="hidden"
                                        accept=".jpg, .jpeg, .png, .webp"
                                    />
                                </label>

                                {/* Cover */}
                                <label className="relative mb-5 flex h-50 w-full shrink-0 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-4 border-dotted border-white/50 bg-white/30 transition-transform duration-150 hover:scale-105 sm:w-75">
                                    {cover_url ? (
                                        <img
                                            src={`/IMG/Portada/${cover_url}`}
                                            alt="Cover actual"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    ) : cover?.length !== 0 ? (
                                        <>
                                            <img src={coverPreview!} alt="Preview Cover" className="absolute inset-0 h-full w-full object-cover" />
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-white/50">Cover</p>
                                            <Image className="text-white/50" />
                                        </>
                                    )}

                                    <Input id="cover" {...register('cover')} type="file" className="hidden" accept=".jpg, .jpeg, .png, .webp" />
                                </label>
                            </div>

                            {/*** Descripcion */}
                            <div>
                                <div className="mb-6 flex flex-col gap-2">
                                    {/** Descripcion */}
                                    <Label className="flex items-center gap-2 text-white">
                                        <Pencil size={19} />
                                        <span>Descripcion</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        autoFocus
                                        tabIndex={1}
                                        {...register('description')}
                                        placeholder="This work is the..."
                                        className="h-30 rounded-md border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
                                    <InputError message={errors.description?.message} />
                                </div>
                            </div>

                            <Label className="mb-3 flex items-center gap-2 text-white">
                                <File size={19} />
                                <span>Archivo MD</span>
                            </Label>

                            {/*** Archivo md */}
                            <label className="mb-8 flex h-20 cursor-pointer flex-row items-center justify-start gap-2 rounded-2xl border-4 border-dotted border-white/50 bg-white/30 ps-4 transition-transform duration-150 hover:scale-105">
                                {content?.length != 0 ? (
                                    <>
                                        <CheckCircle2 size={26} color="green" />
                                        <p className="text-green-200">Contenido Subido!</p>
                                    </>
                                ) : (
                                    <>
                                        <Paperclip size={26} />
                                        <p className="text-white/50">Contenido Mardown</p>
                                    </>
                                )}

                                <Input id="content" type="file" className="hidden" accept=".md" {...register('content')} />
                                <InputError message={errors.content?.message} />
                            </label>

                            <Label className="mb-3 flex items-center gap-2 text-white">
                                <Image size={19} />
                                <span>Imagenes</span>
                            </Label>

                            {/*  Imagenes de la obra  */}
                            <label className="flex h-20 cursor-pointer flex-row items-center justify-start gap-2 rounded-2xl border-4 border-dotted border-white/50 bg-white/30 ps-4 transition-transform duration-150 hover:scale-105">
                                {(container ?? 0) === 0 && (!images || images.length === 0) ? (
                                    <>
                                        <Paperclip size={26} />
                                        <p className="text-white/50">No hay imágenes</p>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={26} color="green" />
                                        <p className="text-green-200">
                                            {/* container ?? 0 */} imagenes guardadas
                                            {images && images.length > 0 && ` · ${images.length} nuevas por subir`}
                                        </p>
                                    </>
                                )}

                                <Input
                                    id="images"
                                    type="file"
                                    className="hidden"
                                    accept=".jpg, .jpeg, .png, .webp"
                                    disabled={galeries != undefined && galeries.length > 0}
                                    {...register('images')}
                                    multiple
                                />
                                <InputError message={errors.images?.message} />
                            </label>

                            {/* Lista de tags */}
                            <div className="flex h-8 w-full flex-row items-center justify-start">
                                <h3 className="mt-3 text-lg text-white">{`Tags Seleccionados (${list.length})`}</h3>
                                <Button
                                    type="button"
                                    className="mt-4 flex h-9 w-8 cursor-pointer items-center justify-center rounded-2xl font-bold text-white hover:bg-[#754C22]/10"
                                    tabIndex={4}
                                    onClick={() => setShowTags((prev) => !prev)}
                                >
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${showTags ? 'rotate-180' : ''}`} />
                                </Button>
                            </div>
                            <div
                                className={`scrollbar-gutter-stable mt-2 grid min-h-0 flex-1 grid-cols-2 gap-3 gap-x-4 overflow-y-auto p-3 pr-5 text-left lg:grid-cols-4 ${showTags ? '' : 'hidden'}`}
                            >
                                {list.map((p) => {
                                    const readable = p.replace(/-/g, ' ');
                                    const normalize = readable.charAt(0).toUpperCase() + readable.slice(1);

                                    return (
                                        <Label
                                            key={p}
                                            className="flex cursor-pointer flex-row items-center justify-center rounded-lg bg-amber-100 px-3 py-2 text-center text-[10px] text-black transition-transform duration-150 hover:scale-105"
                                            onClick={() => refreshTags(p)}
                                        >
                                            <Tag size={14} className="me-2 shrink-0" />
                                            {normalize}
                                        </Label>
                                    );
                                })}
                            </div>

                            {/* Artworks Selecionados */}
                            <div className="mt-4 flex h-8 w-full flex-row items-center justify-start">
                                <h3 className="mt-3 text-lg text-white"> {`Arworks Seleccionados (${folders.length})`}</h3>
                                <Button
                                    type="button"
                                    className="mt-4 flex h-9 w-8 cursor-pointer items-center justify-center rounded-2xl font-bold text-white hover:bg-[#754C22]/10"
                                    tabIndex={4}
                                    onClick={() => setShowFolders((prev) => !prev)}
                                >
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${showFolders ? 'rotate-180' : ''}`} />
                                </Button>
                            </div>
                            <div
                                className={`scrollbar-gutter-stable mt-2 grid min-h-0 flex-1 grid-cols-2 gap-3 gap-x-4 overflow-y-auto p-3 pr-5 text-left lg:grid-cols-4 ${showFolders ? '' : 'hidden'}`}
                            >
                                {folders.map((p, i) => {
                                    const readable = p.title.replace(/-/g, ' ');
                                    const normalize = readable.charAt(0).toUpperCase() + readable.slice(1);

                                    return (
                                        <Label
                                            key={i}
                                            className="flex cursor-pointer flex-row items-center justify-center rounded-lg bg-amber-100 px-3 py-2 text-center text-[10px] text-black transition-transform duration-150 hover:scale-105"
                                            onClick={() => refreshFolder(p)}
                                        >
                                            <Book size={14} className="me-2 shrink-0" />
                                            {normalize}
                                        </Label>
                                    );
                                })}
                            </div>

                            <a
                                type="button"
                                className={`mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl bg-blue-500 font-bold text-white transition-transform duration-150 hover:scale-105 hover:bg-blue-600 ${defaultValues == undefined ? 'hidden' : ''}`}
                                tabIndex={4}
                                href={route('post.show', post_id)}
                            >
                                Ver Post
                            </a>

                            <Button
                                type="button"
                                className={`mt-5 h-12 w-full cursor-pointer rounded-2xl bg-white font-bold text-[#754C22] transition-transform duration-150 hover:scale-105 hover:bg-white/90 ${defaultValues == undefined ? 'hidden' : ''}`}
                                tabIndex={4}
                                onClick={onToogle}
                            >
                                Gestionar Imagenes
                            </Button>
                            <Button
                                type="submit"
                                className="mt-5 h-12 w-full cursor-pointer rounded-2xl bg-[#e2d255] font-bold text-[#885200] transition-transform duration-150 hover:scale-105"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {defaultValues == undefined ? 'Crear Post' : 'Actualizar Post'}
                            </Button>
                        </form>
                    </div>
                </div>
                {defaultValues == undefined ? (
                    <></>
                ) : (
                    <div
                        className={`fixed top-20 right-0 z-10 flex h-full w-full flex-col overflow-hidden bg-[#e5c385] p-4 transition-opacity duration-300 lg:w-120 ${isSidebar ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                    >
                        <div className="flex h-10 w-full flex-row items-start justify-start gap-4">
                            <button
                                className="flex h-10 w-full cursor-pointer flex-row items-start justify-start gap-4"
                                type="button"
                                onClick={() => setisSidebar(false)}
                            >
                                X
                            </button>

                            <a
                                className="_btn_secondary flex items-center justify-center transition-transform duration-150 ease-in-out hover:scale-110"
                                href={route('artwork.create')}
                            >
                                Agregar
                            </a>
                        </div>

                        <h2 className="title text-center text-2xl font-bold">Gestion de Imagenes</h2>
                        <h3>Total de Imagenes: {Object.values(container ?? {}).flat().length}</h3>

                        <select
                            name="artworks"
                            id="artworks"
                            value={artwork?.id ?? ''}
                            onChange={(e) => changeArtwork(Number(e.target.value))}
                            className="text- w-full cursor-pointer rounded-xl bg-white/30 p-2 outline-none focus:bg-white/20"
                        >
                            {galeries?.map((gal) => (
                                <option key={gal.id} value={gal.id} className="bg-white text-black">
                                    {gal.title}
                                </option>
                            ))}
                        </select>
                        <a
                            className="mt-4 flex h-10 w-auto cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-400 px-4 py-2 text-lg text-white transition-colors hover:bg-green-500"
                            href={route('artwork.edit', artwork?.id)}
                        >
                            <Image size={20} className="text-white" />
                            Agregar
                        </a>

                        <Button
                            className="mt-4 flex h-10 w-auto cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-800 px-4 py-2 text-lg text-white transition-colors hover:bg-amber-900"
                            onClick={onExpand}
                        >
                            <Settings size={20} className="text-white" />
                            Expandir Slot
                        </Button>

                        <div className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-lg border-2 border-white/20 bg-black/10 p-3">
                            <div className="flex flex-col items-center justify-center gap-4">
                                {artwork && container?.[artwork?.code] ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {container[artwork?.code].map((img) => (
                                            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-black/20">
                                                <img
                                                    src={`/storage/IMG/${artwork.code}/${img.name}`}
                                                    alt={img.alt ?? ''}
                                                    className="h-full w-full cursor-pointer object-cover transition-transform duration-200 group-hover:scale-110"
                                                    onClick={() => setPicture(img.id)}
                                                />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                                                    <p className="truncate text-[10px] font-medium text-white">{img.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-white/50">Esta obra no tiene imágenes catalogadas</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/** Modal de Tags */}
                <Dialog open={modaltags} onClose={() => setModalTags(false)} className="relative z-50">
                    {/* Fondo oscuro */}
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                    {/* Contenedor centrado */}
                    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                        <DialogPanel className="max-h-[100vh] w-full max-w-4xl rounded-2xl bg-white p-6">
                            <DialogTitle className="text-lg font-bold">Add Tag Values</DialogTitle>
                            {/** Mapeado de Tags Disposinbles y actuales */}
                            <label className="h-10 w-full">
                                <Input
                                    type="text"
                                    autoFocus
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    tabIndex={1}
                                    placeholder="Type tags name..."
                                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 transition-colors duration-150 outline-none placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                />
                            </label>
                            <Button
                                type="button"
                                className="mt-2 h-6 w-25 cursor-pointer rounded-2xl bg-[#e2d255] text-sm font-bold text-[#885200] transition-transform duration-150 hover:scale-105"
                                tabIndex={4}
                                onClick={() => addTag(tag)}
                            >
                                Add Tag
                            </Button>
                            <p className="mt-2 text-sm text-gray-600">Crea y/o seleciona los generós de la obra del post</p>

                            <div className="scrollbar-gutter-stable mt-2 grid min-h-0 flex-1 grid-cols-2 gap-3 gap-x-4 overflow-y-auto p-3 pr-5 text-left lg:grid-cols-4">
                                {tags.map((p, i) => {
                                    let check = list.includes(p);

                                    return (
                                        <Label
                                            key={i}
                                            onClick={() => refreshTags(p)}
                                            className={`flex cursor-pointer flex-row items-center justify-start rounded-lg p-2 text-center text-sm transition-transform duration-150 hover:scale-105 hover:bg-amber-200 ${check ? 'bg-[#b39e00] text-white' : 'bg-amber-100 text-black'} `}
                                        >
                                            <Tags size={16} className="me-3" /> {p}
                                        </Label>
                                    );
                                })}
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Modal para elegir obra */}
                <Dialog open={modalartwork} onClose={() => setModalArtwork(false)} className="relative z-50">
                    {/* Fondo oscuro */}
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                    {/* Contenedor centrado */}
                    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                        <DialogPanel className="max-h-[100vh] w-full max-w-4xl rounded-2xl bg-white p-6">
                            <DialogTitle className="text-lg font-bold">Add Artwork</DialogTitle>
                            {/** Mapeado de Tags Disposinbles y actuales */}
                            <label className="h-10 w-full">
                                <Input
                                    type="text"
                                    autoFocus
                                    value={galery}
                                    onChange={(e) => setGalery(e.target.value)}
                                    tabIndex={1}
                                    placeholder="Type work name..."
                                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 transition-colors duration-150 outline-none placeholder:text-gray-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                                />
                            </label>
                            <Button
                                type="button"
                                className="mt-2 h-6 w-35 cursor-pointer rounded-2xl bg-[#e2d255] text-sm font-bold text-[#885200] transition-transform duration-150 hover:scale-105"
                                tabIndex={4}
                                onClick={() => addArtwork(galery)}
                            >
                                Add Artwork
                            </Button>
                            <p className="mt-2 text-sm text-gray-600">Crea y/o seleciona la galeria del post</p>

                            <div className="scrollbar-gutter-stable mt-2 grid min-h-0 flex-1 grid-cols-2 gap-3 gap-x-4 overflow-y-auto p-3 pr-5 text-left lg:grid-cols-4">
                                {artworks.map((p, i) => {
                                    let check = folders.some((f) => f.id === p.id);

                                    return (
                                        <Label
                                            key={i}
                                            onClick={() => refreshFolder(p)}
                                            className={`flex cursor-pointer flex-row items-center justify-start rounded-2xl p-2 text-center text-sm transition-transform duration-150 hover:scale-105 hover:bg-amber-200 ${check ? 'bg-[#b39e00] text-white' : 'bg-amber-100 text-black'} `}
                                        >
                                            <Folder size={16} className="me-3" /> {p.title}
                                        </Label>
                                    );
                                })}
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Modal para elegir obra */}
                <Dialog open={modalreplace} onClose={() => setModalReplace(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                        <DialogPanel className="max-h-[90vh] w-full max-w-4xl rounded-2xl bg-white p-6">
                            <DialogTitle className="text-lg font-bold">Reemplazar imagen</DialogTitle>

                            <div className="scrollbar-gutter-stable grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
                                {avaliables.length === 0 ? (
                                    <p className="col-span-full text-center text-sm text-gray-500">
                                        No hay imágenes disponibles para reemplazar. Todas están en uso en este post.
                                    </p>
                                ) : (
                                    avaliables.map((img) => (
                                        <button
                                            key={img.id}
                                            type="button"
                                            onClick={() => handleReplaceConfirm(img)}
                                            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-black/10 transition-transform duration-150 hover:scale-105"
                                        >
                                            <img
                                                src={`/storage/IMG/${artwork?.code}/${img.name}`}
                                                alt={img.alt ?? ''}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                                                <p className="truncate text-[10px] font-medium text-white">{img.name}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Expandir Slot */}
                <Dialog open={modalslot} onClose={() => setModalSlot(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
                        <DialogPanel className="max-h-[90vh] w-full max-w-4xl rounded-2xl bg-white p-6">
                            <DialogTitle className="text-lg font-bold">Expandir Slot</DialogTitle>
                            <p className="mt-1 mb-4 text-sm text-gray-600">Selecciona una imagen y escribe la clave que usaste en el markdown</p>

                            <div className="scrollbar-gutter-stable grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
                                {avaliables.length === 0 ? (
                                    <p className="col-span-full text-center text-sm text-gray-500">
                                        No hay imágenes disponibles. Ve a la obra y agrega imágenes primero.
                                    </p>
                                ) : (
                                    avaliables.map((img) => (
                                        <button
                                            key={img.id}
                                            type="button"
                                            onClick={() => setSelectedSlotImage(img)}
                                            className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-black/10 transition-transform duration-150 hover:scale-105 ${
                                                selectedSlotImage?.id === img.id ? 'ring-4 ring-green-500' : ''
                                            }`}
                                        >
                                            <img
                                                src={`/storage/IMG/${artwork?.code}/${img.name}`}
                                                alt={img.alt ?? ''}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                                                <p className="truncate text-[10px] font-medium text-white">{img.name}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>

                            <input
                                type="text"
                                value={slotKey}
                                onChange={(e) => setSlotKey(e.target.value)}
                                placeholder="Clave usada en el markdown (ej: foto-5)"
                                className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            />

                            <Button
                                type="button"
                                disabled={!selectedSlotImage || slotKey.trim().length === 0}
                                onClick={handleExpandConfirm}
                                className="mt-4 h-12 w-full cursor-pointer rounded-2xl bg-green-400 font-bold text-white transition-transform duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Confirmar
                            </Button>
                        </DialogPanel>
                    </div>
                </Dialog>
            </>
        );
    },
);
export default PostForm;
