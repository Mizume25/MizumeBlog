/** OBJETO Zod */
import { z } from 'zod';
import { IMAGE_TYPES, msg, zFiles, zList, zText, zTranslatable, zTranslatableWithDefault } from '@/lib/schema-messages';

/**
 * Schema de Categoria
 */
export const CategorySchema = z.enum(['literatura', 'animemanga']);
export const MediumSchema = z.enum(["libro", "poema", "novela_ligera", "novela", "anime", "manga", "pelicula"]);

/**
 * Valores de las imagenes
 */
const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Schema de artwork
 */
/*
const artworkSchema = z.object({
    id: z.number().nullable().optional(),
    title: z.string().min(2, 'Mínimo debe haber un nombre'),
    code: z.string().optional(),
});


export const PostSchema = z.object({
    works: z.array(artworkSchema).optional(),
    title: z.string().min(2, 'Necesitas un titulo minimo'),
    web_title: z.string().optional(),
    tags: z.array(z.string()).min(1, 'Selecciona al menos un género'),
    category: categorySchema,
    author: z.string().min(2, 'Necesitas Establecer a un autor'),
    publish_date: z.string().optional(),
    description: z.string().optional(),
    featured: z.boolean().default(false),
    cover: z
        .instanceof(FileList)
        .refine((files) => files.length === 0 || files[0]?.size <= MAX_SIZE, 'Máximo 5MB')
        .refine((files) => files.length === 0 || VALID_TYPES.includes(files[0]?.type), 'Formato no válido')
        .optional(),
    cover_card: z
        .instanceof(FileList)
        .refine((files) => files.length === 0 || files[0]?.size <= MAX_SIZE, 'Máximo 5MB')
        .refine((files) => files.length === 0 || VALID_TYPES.includes(files[0]?.type), 'Formato no válido')
        .optional(),
    content: z
        .instanceof(FileList)
        .optional()
        .refine((files) => !files || files.length === 0 || files[0].name.endsWith('.md'), {
            message: 'El archivo debe tener extensión .md',
        })
        .refine((files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024, {
            message: 'El archivo no puede superar 5MB',
        })
        .refine((files) => !files || files.length === 0 || ['text/markdown', '', 'text/plain'].includes(files[0].type), {
            message: 'Tipo de archivo no válido',
        }),
    images: z
        .instanceof(FileList)
        .refine((files) => Array.from(files).every((file) => file.size <= MAX_SIZE), 'Cada imagen debe pesar máximo 5MB')
        .refine((files) => Array.from(files).every((file) => VALID_TYPES.includes(file.type)), 'Formato inválido en una o más imágenes')
        .optional(),
});

export type CreatePostSchemaOutput = z.output<typeof PostSchema>;
export type CreatePostSchemaInput = z.input<typeof PostSchema>;


export const PhotoSchema = z.object({
    num: z.number().optional(),
    name: z.string().min(1, 'Debe tener un nombre'),
    alt: z.string().min(5,'Debe ser descriptivo'),
});

export const ArtworkSchema = z.object({
    title: z.string({ message: 'El titulo es obligatorio'}).min(3, 'Debe escribir un titulo'),
    images: z
        .instanceof(FileList)
        .refine((files) => Array.from(files).every((file) => file.size <= MAX_SIZE), 'Cada imagen debe pesar máximo 5MB')
        .refine((files) => Array.from(files).every((file) => VALID_TYPES.includes(file.type)), 'Formato inválido en una o más imágenes')
        .optional(),
    photos: z.array(PhotoSchema)
})

export type CreateArtworkSchemaOutput = z.output<typeof ArtworkSchema>;
export type CreateArtworktSchemaInput = z.input<typeof ArtworkSchema>;


*/


/**
 * Post. Límites = StorePostRequest. Los mensajes son genéricos (lib/schema-messages):
 * un campo nuevo se construye con zText / zList / zFiles, sin crear mensajes.
 */
/*
export const PostSchema = z.object({
    title: zText(2, 255),
    web_title: z.string().max(255, msg('max_chars', { n: 255 })).optional(),
    tags: zList(zText(2, 50), 1, 10),
    category: categorySchema,
    author: zText(2, 255),
    publish_date: z.string().optional(),
    description: z.string().optional(),
    featured: z.boolean().default(false),
    cover: zFiles({ maxMB: 5, types: IMAGE_TYPES }),
    cover_card: zFiles({ maxMB: 5, types: IMAGE_TYPES }),
    content: zFiles({ maxMB: 5, ext: 'md', types: ['text/markdown', 'text/plain', ''] }),
    images: zFiles({ maxMB: 5, types: IMAGE_TYPES }),
});

*/



export const WorkSchema = z.object({
    title: zTranslatableWithDefault(2, 255),
    abbreviation: z.string().max(50, msg('max_chars', { n: 50 })).optional(),
    category: CategorySchema,
    publish_date: z.string().optional(),
    sinopsi: zTranslatable(50),
    medium: MediumSchema,
    cover_url: zFiles({ maxMB: 5, types: IMAGE_TYPES }),
    tags: zList(zText(2, 50), 1, 10),
})


export type CreateWorkOutput = z.output<typeof WorkSchema>
export type CreateWorkInput = z.input<typeof WorkSchema>

