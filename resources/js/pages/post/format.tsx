// resources/js/Pages/Admin/PostsImageConfig.tsx
import { Head, router } from '@inertiajs/react';
import { LibraryFormat } from '@/core/auth/LibraryFormat';
import { Post, Config } from '@/types';

type PageProps = {
    posts: Post[];
};

export default function PostsImageConfigPage({ posts }: PageProps) {
    const handleChange = (postId: Post['id'], config: Config) => {
        router.patch(route('post.image-config.update', postId), config, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Configurar imágenes" />
            <div className="min-h-screen bg-[#efe3cc] py-8 px-4">
                <LibraryFormat posts={posts} onChange={handleChange} />
            </div>
        </>
    );
}