import AuthLayout from '@/layouts/auth-layout';
import { Head, router } from '@inertiajs/react';
import type { CreatePostSchemaOutput } from "@/types/schemas";
import PostForm, { PostFormHandle } from '@/core/post/PostForm';
import { useRef, useState } from 'react';
import BlogLayout from '@/layouts/app/blog-layout';

export default function Create({ tags }: { tags: string[] }) {

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
        formData.append("title", data.title);
        formData.append("author", data.author);
        formData.append("category", data.category);
        data.tags.forEach((g) => formData.append("tags[]", g));

        formData.append("featured", data.featured ? "1" : "0");

        if (data.web_title) formData.append("web_title", data.web_title);
        if (data.description) formData.append("description", data.description);
        if (data.publish_date) formData.append("publish_date", data.publish_date);
        if (data.cover?.[0]) formData.append("cover", data.cover[0]);
        if (data.cover_card?.[0]) formData.append("cover_card", data.cover_card[0]);
        if (data.content?.[0]) formData.append("content", data.content[0]);

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
                <PostForm ref={formRef} tags={tags} onSubmit={handleCreate} submitLabel="Create Post" />
            </AuthLayout>
        </BlogLayout>
    );
}