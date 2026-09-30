/** @interface BlogTopHeader */
interface BlogTopHeader {
    children: React.ReactNode;
}
function BlogTopHeader({ children }: BlogTopHeader) {
    return (
        <div className="bg-primary sticky top-0 z-30 w-full px-4 py-3 shadow-md">
            <div className="flex mx-auto max-w-7xl items-center justify-end max-lg:flex lg:grid lg:grid-cols-3">
                {children}
            </div>
        </div>
    )
}

export default BlogTopHeader;