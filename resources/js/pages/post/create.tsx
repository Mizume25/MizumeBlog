import PostForm, { PostFormHandle } from '@/core/post/PostForm';
import BlogLayout from '@/layouts/app/blog-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Artwork } from '@/types';
import type { CreatePostSchemaOutput } from '@/types/schemas';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface CreateProps {
    tags: string[];
    artworks: Artwork[];
}

export default function Create({ tags, artworks }: CreateProps) {
    /**
     * Variable de Refrencia
     */
    const formRef = useRef<PostFormHandle>(null);

    /**
     * procesamiento
     */
    const [processing, setProcessing] = useState(false);

    const handleCreate = (data: CreatePostSchemaOutput) => {
        /** Form Data */
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('author', data.author);
        formData.append('category', data.category);
        data.tags.forEach((g) => formData.append('tags[]', g));

        formData.append('featured', data.featured ? '1' : '0');

        if (data.web_title) formData.append('web_title', data.web_title);
        if (data.description) formData.append('description', data.description);
        if (data.publish_date) formData.append('publish_date', data.publish_date);
        if (data.cover?.[0]) formData.append('cover', data.cover[0]);
        if (data.cover_card?.[0]) formData.append('cover_card', data.cover_card[0]);
        if (data.content?.[0]) formData.append('content', data.content[0]);
        if (data.images && data.images.length > 0) {
            Array.from(data.images).forEach((file) => {
                formData.append('images[]', file);
            });
        }

        if (data.works && data.works.length > 0) {
            data.works.forEach((work, i) => {
                if (work.id !== null && work.id !== undefined) {
                    formData.append(`works[${i}][id]`, String(work.id));
                }
                formData.append(`works[${i}][title]`, work.title);
            });
        }

        /**
         * Emviamos informació
         */
        router.post(route('post.store'), formData, {
            onSuccess: () => {
                formRef.current?.resetForm();
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <BlogLayout>
            <AuthLayout title="MizumeBlog" description="Formulario Post">
                <Head title="Crear Post" />
                <PostForm ref={formRef} tags={tags} onSubmit={handleCreate} submitLabel="Create Post" artworks={artworks} />
            </AuthLayout>
        </BlogLayout>
    );
}
