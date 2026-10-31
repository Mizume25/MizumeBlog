/**
 *  @fileoverview Archivos de componentes de post index 
 */

interface PostIndexMainProps {
    children: React.ReactNode
}

export const PostIndexMain = ({ children }: PostIndexMainProps) => {
    return (
        <div className="mx-auto grid w-full max-w-8xl grid-cols-1 gap-8 rounded-2xl bg-mizume-primary p-5 sm:p-6 md:grid-cols-1 xl:grid-cols-2">
            {children}
        </div>
    )
}