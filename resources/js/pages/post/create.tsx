import InputError from '@/components/input-error';
import AuthLayout from '@/layouts/auth-layout';
import { Input, Select, Button, Textarea, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { Label } from '@radix-ui/react-dropdown-menu';
import Switch from "react-switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, type CreatePostSchemaOutput, type CreatePostSchemaInput } from "@/types/schemas";
import { useState } from 'react';
import { OPTION_CATEGORY } from '@/types/constants';
import { LoaderCircle, Book, Computer, Tag, Calendar, User, Tags, Pencil, Image, ArrowBigLeft } from 'lucide-react'
import { SubmitHandler, Controller } from 'react-hook-form'
import { router } from '@inertiajs/react';




function create({ genders }: { genders: string[] }) {





    /**
     *  Formulario para crear un Post
     */
    const { register, handleSubmit, formState: { errors }, reset, control, getValues, setValue } =
        useForm<CreatePostSchemaInput, unknown, CreatePostSchemaOutput>({
            resolver: zodResolver(PostSchema),
        });


    const [tag, setTag] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, seterror] = useState<string | null>(null);




    /**
     * Función para Obtener Datos
     * @type CreatePostSchemaOutput  Tipado de Schema Post
    */
    const onSubmit: SubmitHandler<CreatePostSchemaOutput> = async (data) => {
        try {



            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("author", data.author);
            formData.append("category", data.category)
            tags.forEach((g) => formData.append("gender[]", g));
            formData.append("featured", data.featured ? "1" : "0");

            if (data.web_title) formData.append("web_title", data.web_title);
            if (data.description) formData.append("description", data.description);
            if (data.publish_date) formData.append("publish_date", data.publish_date);


            if (data.cover?.[0]) formData.append("cover", data.cover[0]);
            if (data.cover_card?.[0]) formData.append("cover_card", data.cover_card[0]);

            router.post(route('post.store'), formData);

            reset();

            setTags([]);



        } catch (error) {

        }




    }

    const [tags, setTags] = useState<string[]>([]);

    const refreshTags = (gender: string) => {

        const normalize = gender.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        setTags((prev) => {
            const current = prev.includes(normalize)
                ? prev.filter((g) => g !== normalize) : [...prev, normalize];

            setValue("gender", current);
            return current;
        });


    }




    const addGender = (gender: string | null) => {
        if (gender == null) return alert("El genero no puede ser nulo");
        if (gender.length == 0) return alert("El genero no puede ser vacío");
        const normalize = gender.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        refreshTags(gender);

        setTag("");

        console.log("Despues de addGender la variable quedo asi:", tag);
    }

    const onInvalid = (errors: any) => {
        console.log("", errors);
    }


    return (
        <AuthLayout title="MizumeBlog" description="Formulario Post">
            <Head title="Iniciar Session" />
            <div>


                <div className="mx-auto lg:min-w-150 rounded-lg bg-[#754C22] p-4 sm:p-8 shadow-lg border border-border/50">
                    <form onSubmit={handleSubmit(onSubmit, onInvalid)}  >
                        <div className='flex flex-row gap-2 justify-between text-center'>

                            <div className='flex flex-row'>
                                <a
                                    href={route('post.panel')}
                                    className='flex items-center gap-2 transition-transform hover:-translate-x-1.5 cursor-pointer duration-150 text-white/30'
                                >
                                    <ArrowBigLeft size={26} className='text-white' />
                                    Volver
                                </a>
                            </div>

                            <div className='flex justify-end flex-row gap-2'>
                                <Label className="text-white text-right mb-2 hidden lg:inline">Destacado</Label>
                                <Controller
                                    name="featured"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            lang='es'
                                            onColor='#b39e00'
                                            offColor='#454545'
                                            checked={field.value ?? false}
                                            onChange={field.onChange}
                                            checkedIcon={false}
                                            uncheckedIcon={false}
                                        />
                                    )}
                                />

                            </div>


                            <InputError message={errors.author?.message} />

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  lg:gap-10 text-left p-3">

                            {/**  Titulo de la obra  */}
                            <div className='flex flex-col gap-2'>
                                <Label className="text-white flex items-center gap-2">
                                    <Book size={20} />
                                    <span>Titulo Obra</span>

                                </Label>

                                <Input
                                    id="title"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    {...register("title")}
                                    placeholder="Work Title..."
                                    className="bg-white/30 border-white/20 text-gray-50 placeholder:text-white/40 focus:bg-white/20 p-2 rounded-md"
                                />
                                <InputError message={errors.title?.message} />

                            </div>

                            {/** Titulo Web */}
                            <div className='flex flex-col gap-2'>
                                <Label className="text-white flex items-center gap-2">
                                    <Computer size={19} />
                                    <span>Titulo Web</span>

                                </Label>
                                <Input
                                    id="web_title"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    {...register("web_title")}
                                    placeholder="Web title work..."
                                    className="bg-white/30 border-white/20 text-gray-50 placeholder:text-white/40 focus:bg-white/20 p-2 rounded-md"
                                />
                                <InputError message={errors.web_title?.message} />
                            </div>

                            {/** Genero */}
                            <div className='flex flex-col gap-2'>
                                <Label className="text-white flex items-center gap-2">
                                    <Tags size={19} />
                                    <span>Genero</span>

                                </Label>
                                <Button
                                    type="button"
                                    className="w-full bg-white text-[#754C22] hover:bg-white/90 font-bold h-12 cursor-pointer rounded-2xl transition-transform hover:scale-105 duration-150"
                                    tabIndex={4}
                                    onClick={() => setIsOpen(true)}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Genders
                                </Button>
                                <InputError message={errors.gender?.message} />
                            </div>

                            {/*** Autor de la Obra */}
                            <div className='flex flex-col gap-2'>
                                <Label className="text-white flex items-center gap-2">
                                    <User size={19} />
                                    <span>Autor</span>

                                </Label>
                                <Input
                                    id="author"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    {...register("author")}
                                    placeholder="Author name..."
                                    className="bg-white/30 border-white/20 text-gray-50 placeholder:text-white/40 focus:bg-white/20 p-2 rounded-md"
                                />
                                <InputError message={errors.author?.message} />
                            </div>

                            {/** Fecha Públicación */}
                            <div className='flex flex-col gap-2'>
                                <Label className="text-white flex items-center gap-2">
                                    <Calendar size={19} />
                                    <span>Fecha Públicación</span>

                                </Label>
                                <Input
                                    id="publish_date"
                                    type="date"
                                    autoFocus
                                    tabIndex={1}
                                    {...register("publish_date")}
                                    className="bg-white/30 border-white/20 text-gray-50 placeholder:text-white/40 focus:bg-white/20 p-2 rounded-md"
                                />
                                <InputError message={errors.publish_date?.message} />
                            </div>

                            {/*** Categorias */}
                            <div className='flex flex-col gap-2'>
                                <Label className="text-white flex items-center gap-2">
                                    <Tag size={19} />
                                    <span>Categorias</span>

                                </Label>
                                <Select
                                    id='category'
                                    {...register("category")}
                                    className="bg-white/30 p-2 rounded-md capitalize text-gray-50">

                                    {OPTION_CATEGORY.map((p) => (
                                        <option value={p} key={p} className='capitalize bg-white/30 text-black'>{p}</option>
                                    ))

                                    }

                                </Select>

                                <InputError message={errors.category?.message} />
                            </div>

                            {/*** Cover */}
                            <label className='h-50 flex flex-row items-center justify-center gap-2 bg-white/30 border-4 border-dotted border-white/50  rounded-2xl transition-transform hover:scale-105 duration-150 cursor-pointer'>

                                <p className='text-white/50'>Cover</p>
                                <Image className='text-white/50' />
                                <Input id='cover'  {...register("cover")} type='file' className="hidden" accept=".jpg, .jpeg, .png" />
                            </label>

                            {/*** Card */}
                            <label className='h-50 flex flex-row items-center justify-center gap-2 bg-white/30 border-4 border-dotted border-white/50  rounded-2xl transition-transform hover:scale-105 duration-150 cursor-pointer'>

                                <p className='text-white/50'>Card</p>
                                <Image className='text-white/50' />
                                <Input id='cover_card' {...register("cover_card")} type='file' className="hidden" accept=".jpg, .jpeg, .png" />
                            </label>
                        </div>

                        <div>
                            <div className='flex flex-col gap-2'>
                                <Label className="text-white flex items-center gap-2">
                                    <Pencil size={19} />
                                    <span>Descripcion</span>

                                </Label>
                                <Textarea
                                    id="description"
                                    autoFocus
                                    tabIndex={1}
                                    {...register("description")}
                                    placeholder="This work is the..."
                                    className="bg-white/30 border-white/20 text-gray-50 placeholder:text-white/40 focus:bg-white/20 p-2 rounded-md h-30"
                                />
                                <InputError message={errors.description?.message} />
                            </div>

                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-x-4 text-left p-3 pr-5 overflow-y-auto flex-1 min-h-0 mt-2 scrollbar-gutter-stable">
                            {tags.map((p) => (
                                <Label
                                    key={p}
                                    className="rounded-lg text-center flex flex-row items-center justify-center bg-amber-100 transition-transform hover:scale-105 duration-150 text-xs cursor-pointer px-3 py-2"
                                    onClick={() => refreshTags(p)}
                                >
                                    <Tags size={14} className='me-2 shrink-0' />
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </Label>
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full bg-[#e2d255] text-[#885200]  font-bold h-12 cursor-pointer rounded-2xl transition-transform hover:scale-105 duration-150"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Create Post
                        </Button>
                    </form>
                </div>


            </div>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                {/* Fondo oscuro */}
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                {/* Contenedor centrado */}
                <div className="fixed inset-0 flex items-center justify-center overflow-y-auto  p-4">
                    <DialogPanel className="w-full max-w-4xl max-h-[100vh] rounded-lg bg-white p-6">
                        <DialogTitle className="text-lg font-bold">
                            Add Genders Values
                        </DialogTitle>
                        <label className='w-full h-10'>
                            <Input
                                type="text"
                                autoFocus
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                tabIndex={1}
                                placeholder="Type gender name..."
                                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400
               rounded-md px-3 py-2 w-full
               focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
               transition-colors duration-150 outline-none"
                            />
                        </label>
                        <Button
                            type="button"
                            className="mt-2 w-25 bg-[#e2d255] text-[#885200]  font-bold h-6 cursor-pointer rounded-2xl transition-transform hover:scale-105 duration-150 text-sm"
                            tabIndex={4}
                            onClick={() => addGender(tag)}
                        >Add Tag</Button>
                        <p className="mt-2 text-sm text-gray-600">
                            Crea y/o seleciona los generós de la obra del post
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 gap-x-4 text-left p-3 pr-5 overflow-y-auto flex-1 min-h-0 mt-2 scrollbar-gutter-stable">
                            {genders.map((p, i) => {

                                let check = tags.includes(p);

                                return (
                                    <Label
                                        key={i}
                                        onClick={() => refreshTags(p)}
                                        className={`
                rounded-lg text-center p-2 flex flex-row items-center justify-start text-sm
                transition-transform hover:scale-105 duration-150 cursor-pointer
                ${check ? "bg-[#b39e00] text-white" : "bg-amber-100 text-black"}
            `}
                                    >
                                        <Tags size={16} className='me-3' /> {p}
                                    </Label>
                                );
                            })}
                        </div>



                    </DialogPanel>
                </div>
            </Dialog>

        </AuthLayout>
    );
}

export default create;