import ImageFormEdit from '@/core/media/ImageFormEdit';
import BlogLayout from '@/layouts/app/blog-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Artwork, Artwork_Image } from '@/types';
import { Head } from '@inertiajs/react';

interface EditProps {
    artwork: Artwork,
    pictures: Artwork_Image [],
}

function edit( { artwork, pictures } : EditProps) {
    return (
        <BlogLayout>
            <AuthLayout title="MizumeBlog" description="Editar Imagenes">
                <Head title="Editar Imagenes" />
                <ImageFormEdit artwork={artwork} pictures={pictures} />
            </AuthLayout>
        </BlogLayout>
    );
}

export default edit;
