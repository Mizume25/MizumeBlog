import ImageForm from '@/core/media/ImageForm'
import BlogLayout from '@/layouts/app/blog-layout'
import AuthLayout from '@/layouts/auth-layout'
import { Head } from '@inertiajs/react'


function edit() {
  return (
     <BlogLayout>
            <AuthLayout title="MizumeBlog" description="Editar Imagenes">
                <Head title="Editar Imagenes" />
                     <ImageForm />
            </AuthLayout>
        </BlogLayout>
  )
}

export default edit