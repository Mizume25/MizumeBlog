import {
    BlogTopHeader,
    BlogTopLogin,
    BlogTopTitle,
    BlogTopRoutes
} from '@/components/top'


export function BlogTopBar() {

    return (
        <BlogTopHeader>        
                <BlogTopRoutes />
                <BlogTopTitle />
                <BlogTopLogin />
        </BlogTopHeader >
    );
}

export default BlogTopBar;
