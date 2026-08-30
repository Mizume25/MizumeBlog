import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import {
    defineConfig
} from 'vite';
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    define: {
        PACKAGE_VERSION: JSON.stringify('3.2.1'),
    },
    optimizeDeps: {
        include: ['@headlessui/react', 'katex', 'rehype-katex', 'remark-math', 'rehype-mathjax'],
        esbuildOptions: {
            define: {
                PACKAGE_VERSION: JSON.stringify('3.2.1'),
            },
        },
    },
    server: {
	cors: true,
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        origin: 'http://localhost:5173',
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            clientPort: 5173,
        },
    },
});
