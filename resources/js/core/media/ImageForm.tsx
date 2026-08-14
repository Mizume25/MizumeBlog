/*** @import Imports de Inerficies de Formularios y objetos submit */
import { SubmitHandler } from 'react-hook-form';

/*** @import Variables de Estado  y de referencia */

/** @imports Interfaces y Diseño Web + Iconos */
import { Artwork, ArtworkPictures, type CreatePostSchemaInput, type CreatePostSchemaOutput } from '@/types';
import { ArrowBigLeft } from 'lucide-react';

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
}

/**
 * @interface  Funcion de reset
 */
export interface PostFormHandle {
    resetForm: () => void;
}

const ImageForm = () => {
    return (
        <>
            <div>
                <div className="border-border/50 mx-auto rounded-lg border bg-[#754C22] p-4 shadow-lg sm:p-8 lg:min-w-150">
                    <form>
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
                    </form>
                </div>
            </div>
        </>
    );
};

export default ImageForm;
