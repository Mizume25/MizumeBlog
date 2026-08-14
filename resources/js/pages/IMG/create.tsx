import ImageForm from '@/core/media/ImageForm'
import BlogLayout from '@/layouts/app/blog-layout'
import AuthLayout from '@/layouts/auth-layout'
import { Head } from '@inertiajs/react'

function create() {
  return (
    <BlogLayout>
            <AuthLayout title="MizumeBlog" description="Subir Imagenes">
                <Head title="Subir Imagenes" />
                <ImageForm />
            </AuthLayout>
      </BlogLayout>
  )
}

export default create