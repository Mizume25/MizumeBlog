import { z } from 'zod';
import { Post, Category } from '@/types';

/**
 * Schema de Categoria
 */
export const categorySchema = z.enum(["literatura", "animemanga", "reflexiones"]);

/**
 * Valores de las imagenes
 */
const MAX_SIZE = 5 * 1024 * 1024;
const TIPOS_VALIDOS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];






/**
 * Schema para Post creado con zod
 */
export const PostSchema = z.object({
    title: z.string().min(2, 'Necesitas un titulo minimo'),
    web_title: z.string().optional(),
    tags: z.array(z.string()).min(1, "Selecciona al menos un género"),
    category: categorySchema,
    author: z.string().min(2, "Necesitas Establecer a un autor"),
    publish_date: z.string().optional(),
    description: z.string().optional(),
    featured: z.boolean().default(false),
    cover: z
        .instanceof(FileList)
        .refine((files) => files.length === 0 || files[0]?.size <= MAX_SIZE, "Máximo 5MB")
        .refine((files) => files.length === 0 || TIPOS_VALIDOS.includes(files[0]?.type), "Formato no válido")
        .optional(),
    cover_card: z
        .instanceof(FileList)
        .refine((files) => files.length === 0 || files[0]?.size <= MAX_SIZE, "Máximo 5MB")
        .refine((files) => files.length === 0 || TIPOS_VALIDOS.includes(files[0]?.type), "Formato no válido")
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


});


export type CreatePostSchemaOutput = z.output<typeof PostSchema>;
export type CreatePostSchemaInput = z.input<typeof PostSchema>;
