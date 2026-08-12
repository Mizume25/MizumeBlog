// edit.tsx
import { useRef } from 'react';
import PostForm, { type PostFormHandle } from "@/core/post/PostForm";
import AuthLayout from '@/layouts/auth-layout';
import { Head, router, usePage } from '@inertiajs/react';
import type { CreatePostSchemaOutput } from "@/types/schemas";
import { useState } from 'react';
import BlogLayout from '@/layouts/app/blog-layout';
import { Post } from '@/types';
import { Container } from 'lucide-react';


interface EditProps {
    post: Post,
    tags: string [],
    container: number,
    pictures: string[]
}


export default function Edit({ post, tags , container, pictures }: EditProps) {


    const formRef = useRef<PostFormHandle>(null);
    const [processing, setProcessing] = useState(false);

    const handleUpdate = (data: CreatePostSchemaOutput) => {
        setProcessing(true);

        const formData = new FormData();
        formData.append("_method", "put");
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
         if (data.images && data.images.length > 0) {
            Array.from(data.images).forEach((file) => {
                formData.append('images[]', file);
            });
        }

        router.post(route('post.update', post.id), formData, {
            onSuccess: () => {
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };



    return (
        <BlogLayout>
            <AuthLayout title="MizumeBlog" description="Editar Post">
                <Head title="Editar Post" />
                <PostForm
                    ref={formRef}
                    tags={tags}
                    defaultValues={{
                        title: post.title,
                        author: post.author,
                        category: post.category,
                        tags: post.tags.split(',').map((g) => g.trim().toLowerCase()),
                        web_title: post.web_title,
                        description: post.description ?? undefined,
                        publish_date: post.publish_date ?? undefined,
                        featured: !!post.featured,
                        
                    }}
                    cover_url={post.cover} 
                    card_url={post.cover_card} 
                    onSubmit={handleUpdate}
                    submitLabel="Actualizar Post"
                    processing={processing}
                    container={container}
                    pictures={pictures}
                    id={post.id}
                />
            </AuthLayout>
        </BlogLayout>
    );
}