/*** @import Imports de Inerficies de Formularios y objetos submit */
import { Label } from '@/components/ui/label';
/*** @import Variables de Estado  y de referencia */

/** @imports Interfaces y Diseño Web + Iconos */
import { ArtworkSchema } from '@/types';
import { Input } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBigLeft, Book, CheckCircle2, Folder, Paperclip, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';

const ImageForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        resolver: zodResolver(ArtworkSchema),
    });

    const images = watch('images');

    return (
        <>
            <div>
                <div>
                    <div className="mx-auto flex flex-row gap-4 rounded-lg p-4 shadow-lg sm:p-8 lg:min-w-150">
                        <form className="w-100 rounded-2xl bg-[#754C22] p-4">
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
                                        id="web_title"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        placeholder="Title work..."
                                        className="rounded-xl border-white/20 bg-white/30 p-2 text-gray-50 placeholder:text-white/40 focus:bg-white/20"
                                    />
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
                                        <p className="text-green-800">
                                        {`${images.length} Imagenes por subir`}
                                        </p>
                                    </>
                                )}
                                <Input id="images" type="file" className="hidden" accept=".jpg, .jpeg, .png, .webp" multiple {...register('images')} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImageForm;
