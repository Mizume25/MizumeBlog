import { InfoNav } from "@/core/admin"
import BlogLayout from "@/layouts/app/blog-layout"
import { Post } from "@/types"
import { Head } from "@inertiajs/react"

interface ExampleProps {
    posts: Post[]
}

function example({ posts } : ExampleProps ) {
  return (
    <BlogLayout>
        <Head  title="Edicion de Imagenes"  />
        {/* Main */}
        <div className="min-h-screen bg-fourth-foreground">
            <InfoNav />
        </div>
    </BlogLayout>
  )
}

export default example