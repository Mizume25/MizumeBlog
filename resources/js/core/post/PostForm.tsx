/*** @import Imports de Inerficies de Formularios y objetos submit */
import FormField from '@/components/form-label';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Switch from 'react-switch';

/*** Servicios Api */
import { artworkApi } from '@/types/api';

/*** @import Estructuras de Estado  y de referencia */
import { ToastType, useToast } from '@/hooks/use-toast';
import { confirmDelete } from '@/types';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

/** @imports Interfaces y Diseño Web + Iconos */
import {
    Artwork,
    Artwork_Image,
    ArtworkPictures,
    OPTION_CATEGORY,
    PostSchema,
    type CreatePostSchemaInput,
    type CreatePostSchemaOutput,
} from '@/types';
import { Button, Input } from '@headlessui/react';

/** @imports Libreria de Iconos */
import ModalOperation from '@/components/modal-operation';
import { router } from '@inertiajs/react';
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
    Settings2,
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
    post_id?: number;
}

/**
 * @interface  Funcion de reset
 */
export interface PostFormHandle {
    resetForm: () => void;
}

/**
 * Funcion para notificar acciones api json
 */
function ApiToast({ toast }: { toast: { type: ToastType; message: string } | null }) {
    if (!toast) return null;

    return (
        <div
            className={`fixed top-5 right-5 z-[100] transition-all duration-500 ease-out ${
                toast ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0'
            }`}
        >
            <div
                className={`flex min-w-[260px] items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${
                    toast?.type === 'success'
                        ? 'bg-[#7ad35f] text-white'
                        : toast?.type === 'warning'
                          ? 'bg-[#e0a11a] text-white'
                          : 'bg-[#fc5353] text-white'
                }`}
            >
                <p className="text-sm font-medium">{toast?.message}</p>
            </div>
        </div>
    );
}

const PostForm = forwardRef<PostFormHandle, PostFormProps>(
    (
        { tags, defaultValues, onSubmit, submitLabel = false, processing = false, cover_url, card_url, container, artworks, galeries, post_id },
        ref,
    ) => {
        /**
         * HOOK FORMULARIO
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

        /**
         * Estructuras de fomularios
         */
        const cover = watch('cover');
        const cover_card = watch('cover_card');
        const content = watch('content');

        /**
         * HOOK PERSONALIZADOS
         */
        const { showToast, toast } = useToast();
        /**
         * Item individual para crear un etiqueta
         */
        const [tag, setTag] = useState<string>('');

        /**
         * Estructuras de control para abrir/cerrar un MODAL
         */

        /** Mostrar tags, artworks , replace*/
        const [modaltags, setModalTags] = useState(false);
        const [modalartwork, setModalArtwork] = useState(false);
        const [modalreplace, setModalReplace] = useState<boolean>(false);
        const [modalAdd, setModalAdd] = useState(false);

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
        const [folders, setFolders] = useState<Artwork[]>(galeries ?? []);

        /** Representacion de 1 solo artwork */
        const [artwork, setArtwork] = useState<Artwork | null>(galeries?.[0] ?? null);

        /** Representacion 1 sola imagen */
        const [picture, setPicture] = useState<number>(-1);

        /** Key Reactivo  */
        const [fileInputKey, setFileInputKey] = useState(0);

        /** Imagenes Disponibles a remplazar */
        const [avaliables, setavAvaliables] = useState<Artwork_Image[]>([]);

        /** Control de imagen y contenido */
        const [coverPreview, setCoverPreview] = useState<string | null>(null);
        const [coverCardPreview, setCoverCardPreview] = useState<string | null>(null);
        const [contentPreview, setContentPreview] = useState<string | null>(null);

        /** Imagen seleccionada para agregar/asociar */
        const [selectedForAdd, setSelectedForAdd] = useState<Artwork_Image | null>(null);

        /** Clave escrita para la nueva asociación */
        const [addKey, setAddKey] = useState('');

        /**
         * @global HOOKS UTILIZADOS
         */
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
         * FUNCION reactiva para poder abrir el modal de remplazo
         */
        useEffect(() => {
            if (artwork == undefined) return;
            if (picture === -1 || picture === undefined) return;
            setModalReplace(false);
            setavAvaliables([]);
        }, [picture]);

        /**
         * FUNCION de iniciar rempalzo
         */
        useEffect(() => {
            if (!artwork || picture === -1) return;
            handleOpenReplace();
        }, [picture]);

        /** VARIABLE IMPERATIVA */
        useImperativeHandle(ref, () => ({
            resetForm: () => {
                reset();
                setList(defaultValues?.tags ?? []);
                setFileInputKey((k) => k + 1);
            },
        }));

        /**
         * HELPERS - Funciones Generales de la pagina
         */

        /** Obtener Artwork del Array */
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
        const refreshFolder = (artwork: Artwork) => {
            setFolders((prev) => {
                const key = artwork.id ?? artwork.title;
                const exists = prev.some((a) => (a.id ?? a.title) === key);

                const current = exists ? prev.filter((a) => (a.id ?? a.title) !== key) : [...prev, artwork];

                const workIds = current.map((f) => f.id).filter((id): id is number => id != null);
                artworkApi
                    .syncWorks(post_id, workIds)
                    .then((data) => showToast('success', data.message))
                    .catch((err) => showToast('error', err.message));

                return current;
            });

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        };

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

        /** Abre y cierra sidebar */
        const onToogle = () => setisSidebar((prev) => !prev);

        /** Cambia de artwork */
        const changeArtwork = (id: number | undefined) => {
            if (id === undefined) return;
            let artwork = getArtwork(id);

            setArtwork(artwork);
        };

        /**
         * Funcion para Remplazar imagenes
         */
        const handleOpenReplace = async () => {
            const valids = await artworkApi.getAvailable(post_id, artwork?.id);
            setavAvaliables(valids);
            setModalReplace(true);
        };

        /**
         * Funcion para agregar imagenes
         */
        const handleOpenAdd = async () => {
            const valids = await artworkApi.getAvailable(post_id, artwork?.id);
            setavAvaliables(valids);
            setModalAdd(true);
        };

        /**
         * Funcion que remplaza imagenes
         * @param post_id id del Post
         * @param image_id id de la imagen que remplazo
         */
        const onReplaceImage = async (post_id: number | undefined, image_id: number | undefined) => {
            artworkApi
                .replaceImage(post_id, image_id, artwork?.id)
                .then((data) => showToast('success', data.message))
                .catch((err) => showToast('error', err.message));

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        };

        /**
         * Funcion para agregar imagen
         * @param post_id id del Post
         * @param key Clave que identifica la imagen
         */
        const onAddImage = async (post_id: number | undefined, key: string) => {
            artworkApi
                .associateImage(post_id, selectedForAdd?.id, key)
                .then((data) => showToast('success', data.message))
                .catch((err) => showToast('error', err.message));

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        };

        /**
         * Funcion para Eliminar Post
         * @returns
         */
        const onDelete = () => {
            if (post_id == null) return;
            confirmDelete('¿Borrar Post?', `Esta accion eliminara ${defaultValues?.title} permanentemente`, () =>
                router.delete(route('post.destroy', post_id)),
            );
        };

        return (
            <>
                {/** FORMULARIO HTML */}
                <div>
                    <ApiToast toast={toast} />
                    <div className="border-border/50 mx-auto rounded-lg border bg-[#754C22] p-4 shadow-lg sm:p-8 lg:min-w-150">
                        {/** HEAD - FORMULARIO */}
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
                                    {/** CAMPO - DESTACADO */}
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
                            {/** CAMPO - ARTWORKS */}
                            <div className="mb-3 flex h-20 w-full flex-col p-4">
                                <Button
                                    type="button"
                                    className="bg-btn-tertiary text-btn-tertiary-foreground btn-hover-scale h-full w-full cursor-pointer rounded-2xl font-bold"
                                    tabIndex={4}
                                    onClick={() => setModalArtwork(true)}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Artwork
                                </Button>
                            </div>
                            {/** FORMULARIO BODY */}
                            <div className="grid grid-cols-1 gap-6 p-3 text-left lg:grid-cols-2 lg:gap-10">
                                {/**  Titulo de la obra  */}
                                <div className="flex flex-col gap-2">
                                    <FormField
                                        type="input"
                                        label="Titulo Obra"
                                        icon={Book}
                                        id="title"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        error={errors.title?.message}
                                        {...register('title')}
                                        placeholder="Work Title..."
                                    />
                                </div>

                                {/** Titulo Web */}
                                <div className="flex flex-col gap-2">
                                    <FormField
                                        type="input"
                                        label="Web title"
                                        icon={Computer}
                                        id="web_title"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        {...register('web_title')}
                                        error={errors.web_title?.message}
                                        placeholder="Web Title ..."
                                    />
                                </div>

                                {/** Tags */}
                                <div className="flex flex-col gap-2">
                                    <Label className="flex items-center gap-2 text-white">
                                        <Tags size={19} />
                                        <span>Tags</span>
                                    </Label>
                                    <Button
                                        type="button"
                                        className="bg-btn-tertiary text-btn-tertiary-foreground btn-hover-scale h-12 w-full rounded-2xl font-bold"
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
                                    <FormField
                                        type="input"
                                        label="Autor"
                                        icon={User}
                                        id="author"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        {...register('author')}
                                        error={errors.author?.message}
                                        placeholder="Author name..."
                                    />
                                </div>

                                {/** Fecha Públicación */}
                                <div className="flex flex-col gap-2">
                                    <FormField
                                        type="date"
                                        label="Publish date"
                                        icon={Calendar}
                                        id="publish_date"
                                        autoFocus
                                        tabIndex={1}
                                        {...register('publish_date')}
                                        error={errors.publish_date?.message}
                                    />
                                </div>

                                {/*** Categorias */}
                                <div className="mb-5 flex flex-col gap-2">
                                    <FormField
                                        type="select"
                                        label="Categoria"
                                        icon={Tag}
                                        id="category"
                                        {...register('category')}
                                        options={OPTION_CATEGORY.map((p) => ({ value: p, label: p }))}
                                        error={errors.category?.message}
                                    />
                                </div>
                            </div>

                            {/*** CAMPO CARD */}
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

                                {/* CAMPO COVER */}
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

                            {/*** CAMPO DESCRIPCION */}
                            <div>
                                <div className="mb-6 flex flex-col gap-2">
                                    <FormField
                                        type="textarea"
                                        label="Description"
                                        icon={Pencil}
                                        id="description"
                                        {...register('description')}
                                        autoFocus
                                        tabIndex={1}
                                        
                                        error={errors.category?.message}
                                    />
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
                                {folders?.map((p, i) => {
                                    const readable = p.title.replace(/-/g, ' ');
                                    const normalize = readable.charAt(0).toUpperCase() + readable.slice(1);

                                    return (
                                        <a
                                            key={i}
                                            className="flex cursor-pointer flex-row items-center justify-center rounded-lg bg-amber-100 px-3 py-2 text-center text-[10px] text-black transition-transform duration-150 hover:scale-105"
                                            {...(p.id != null ? { href: route('artwork.edit', p.id) } : {})}
                                        >
                                            <Book size={14} className="me-2 shrink-0" />
                                            {normalize}
                                        </a>
                                    );
                                })}
                            </div>

                            <div className="h-8 w-full"></div>
                            {/* ACCIONES */}

                            {folders.length === 0 ? (
                                <></>
                            ) : (
                                <>
                                    {/* ACCION IMAGENES */}
                                    <Button
                                        type="button"
                                        className={`mt-5 h-12 w-full cursor-pointer rounded-2xl bg-white font-bold text-[#754C22] transition-transform duration-150 hover:scale-105 hover:bg-white/90 ${defaultValues == undefined ? 'hidden' : ''}`}
                                        tabIndex={4}
                                        onClick={onToogle}
                                    >
                                        Gestionar Imagenes
                                    </Button>
                                </>
                            )}

                            {/* ACCION UPDATE */}
                            <Button
                                type="submit"
                                className="mt-5 h-12 w-full rounded-2xl font-bold bg-btn-primary text-btn-primary-foreground btn-hover-scale"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {defaultValues == undefined ? 'Crear Post' : 'Actualizar Post'}
                            </Button>

                            {defaultValues !== undefined && post_id && (
                                <>
                                    {/* ACCION SHOW */}
                                    <a
                                        className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-blue-500 font-bold text-white transition-transform duration-150 hover:scale-105 hover:bg-blue-600"
                                        href={route('post.show', post_id)}
                                    >
                                        Ver Post
                                    </a>

                                    {/* ELIMINAR */}
                                    <Button
                                        className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl bg-red-500 font-bold text-white transition-transform duration-150 hover:scale-105 hover:bg-red-800"
                                        onClick={onDelete}
                                    >
                                        Eliminar
                                    </Button>
                                </>
                            )}
                        </form>
                    </div>
                </div>

                {/* SLOT SIDEBAR */}
                {defaultValues == undefined ? (
                    <></>
                ) : (
                    <div
                        className={`fixed top-20 right-0 z-10 flex h-full w-full flex-col overflow-hidden bg-[#e5c385] p-4 transition-opacity duration-300 lg:w-120 ${isSidebar ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                    >
                        <div className="flex h-10 w-full flex-row items-start justify-start gap-4">
                            {/* CERRAR SIDEBAR */}
                            <button
                                className="flex h-10 w-full cursor-pointer flex-row items-start justify-start gap-4"
                                type="button"
                                onClick={() => setisSidebar(false)}
                            >
                                X
                            </button>
                            {/* LINK A ARTWORK CREATE */}
                            <a
                                className="_btn_secondary flex items-center justify-center transition-transform duration-150 ease-in-out hover:scale-110"
                                href={route('artwork.create')}
                            >
                                Agregar
                            </a>
                        </div>

                        <h2 className="title text-center text-2xl font-bold">Gestion de Imagenes</h2>
                        <h3>Total de Imagenes: {Object.values(container ?? {}).flat().length}</h3>
                        {/* SELECT DE ARTWORKS */}
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

                        {/* LINK A CONTENEDOR DE IMAGENES RELACIONADO */}
                        <a
                            className="mt-4 flex h-10 w-auto cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-lg text-white transition-colors hover:bg-amber-800"
                            {...(artwork?.id != null ? { href: route('artwork.edit', artwork.id) } : {})}
                        >
                            <Settings2 size={20} className="text-white" />
                            Gestionar Contenedor
                        </a>
                        {/* BUTTON DE AGREGAR IMAGENES */}
                        <Button
                            className="mt-4 flex h-10 w-auto cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-400 px-4 py-2 text-lg text-white transition-colors hover:bg-green-500"
                            {...(artwork?.id != null ? { href: route('artwork.edit', artwork.id) } : {})}
                            onClick={handleOpenAdd}
                        >
                            <Image size={20} className="text-white" />
                            Agregar
                        </Button>
                        {/* CONTENEDOR DE IMAGENES */}
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
                {/** MODAL TAGS */}
                <ModalOperation isOpen={modaltags} onClose={() => setModalTags(false)} title="Añadir tags">
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
                </ModalOperation>

                {/** MODAL ARTWORK */}
                <ModalOperation isOpen={modalartwork} onClose={() => setModalArtwork(false)} title="Agregar un Artwork">
                    {/** Mapeado de Tags Disposinbles y actuales */}

                    <a
                        type="button"
                        className="mt-2 flex h-6 w-35 cursor-pointer flex-row items-center justify-center rounded-2xl bg-[#e2d255] text-sm font-bold text-[#885200] transition-transform duration-150 hover:scale-105"
                        tabIndex={4}
                        href={route('artwork.create')}
                    >
                        Crear Artwork
                    </a>
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
                </ModalOperation>

                {/** MODAL REMPLAZAR IMAGENES */}
                <ModalOperation isOpen={modalreplace} onClose={() => setModalReplace(false)} title="Remplazar Imagenes">
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
                                    onClick={() => onReplaceImage(post_id, img.id)}
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
                </ModalOperation>

                {/* Modal para agregar/asociar una imagen nueva */}
                <ModalOperation
                    isOpen={modalAdd}
                    onClose={() => {
                        setModalAdd(false);
                        setSelectedForAdd(null);
                        setAddKey('');
                    }}
                    title="Agregar Imagen"
                >
                    <p className="mt-1 mb-4 text-sm text-gray-600">Elige una imagen del catálogo y escribe la clave que usaste en el markdown</p>

                    <div className="scrollbar-gutter-stable grid max-h-[50vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
                        {avaliables.length === 0 ? (
                            <p className="col-span-full text-center text-sm text-gray-500">
                                No hay imágenes disponibles en esta obra. Ve a Artwork y sube algunas primero.
                            </p>
                        ) : (
                            avaliables.map((img) => (
                                <button
                                    key={img.id}
                                    type="button"
                                    onClick={() => setSelectedForAdd(img)}
                                    className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-black/10 transition-transform duration-150 hover:scale-105 ${
                                        selectedForAdd?.id === img.id ? 'ring-4 ring-green-500' : ''
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
                        value={addKey}
                        onChange={(e) => setAddKey(e.target.value)}
                        placeholder="Clave usada en el markdown (ej: foto-5)"
                        className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />

                    <Button
                        type="button"
                        disabled={!selectedForAdd || addKey.trim().length === 0}
                        onClick={() => selectedForAdd && onAddImage(post_id, addKey)}
                        className="mt-4 h-12 w-full cursor-pointer rounded-2xl bg-green-400 font-bold text-white transition-transform duration-150 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Agregar
                    </Button>
                </ModalOperation>
            </>
        );
    },
);
export default PostForm;
