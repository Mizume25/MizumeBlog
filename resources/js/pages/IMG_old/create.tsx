import ImageForm from '@/core/media/ImageForm'
import BlogLayout from '@/layouts/app/blog-layout'
import AuthLayout from '@/layouts/auth-layout'
import { Post } from '@/types'
import { Head } from '@inertiajs/react'

function create({ posts } : {posts: Post[]}) {
  return (
    <BlogLayout>
            <AuthLayout title="MizumeBlog" description="Subir Imagenes">
                <Head title="Subir Imagenes" />
                <ImageForm posts={posts} />
            </AuthLayout>
      </BlogLayout>
  )
}

export default create