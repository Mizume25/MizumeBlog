/** OBJETO Zod */
import { z } from 'zod';

/**
 * Schema de Categoria
 */
export const categorySchema = z.enum(['literatura', 'animemanga', 'reflexiones']);

/**
 * Valores de las imagenes
 */
const MAX_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Schema de artwork
 */

const artworkSchema = z.object({
    id: z.number().nullable().optional(),
    title: z.string().min(2, 'Mínimo debe haber un nombre'),
    code: z.string().optional(),
});

/**
 * Schema para Post creado con zod
 */
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

/**
 * Schema para Artwork crado con zod
 */

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
    photos: z.array(PhotoSchema),
})

export type CreateArtworkSchemaOutput = z.output<typeof ArtworkSchema>;
export type CreateArtworktSchemaInput = z.input<typeof ArtworkSchema>;
