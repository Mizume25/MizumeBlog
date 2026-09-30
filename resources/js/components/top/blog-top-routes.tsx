import { WEB_ROUTE } from "@/types"

function BlogTopRoutes() {
    return (
        <nav className="hidden gap-6 justify-self-start text-sm font-medium lg:flex">
            {WEB_ROUTE.map((p, i) => (
                <a href={p.url} key={i} className="text-primary-foreground group relative text-sm font-bold tracking-wide uppercase">
                    {p.label}
                    <span className="absolute -bottom-1 left-0  w-0 bg-[#8c6c44] transition-all duration-300 group-hover:w-full" />
                </a>
            ))
            }
        </nav>
    )
}

export default BlogTopRoutes