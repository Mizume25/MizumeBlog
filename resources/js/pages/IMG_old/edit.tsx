import ImageFormEdit from '@/core/media/ImageFormEdit';
import BlogLayout from '@/layouts/app/blog-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Artwork, Artwork_Image, Post } from '@/types';
import { Head } from '@inertiajs/react';

interface EditProps {
    artwork: Artwork,
    pictures: Artwork_Image [],
    posts: Post[]
}

function edit( { artwork, pictures, posts } : EditProps) {
    return (
        <BlogLayout>
            <AuthLayout title="MizumeBlog" description="Editar Imagenes">
                <Head title="Editar Imagenes" />
                <ImageFormEdit artwork={artwork} pictures={pictures} posts={posts}/>
            </AuthLayout>
        </BlogLayout>
    );
}

export default edit;
