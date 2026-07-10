import { Post } from '@/types';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { PostSchema } from '@/types/schemas';

function edit({ post }: { post: Post }) {


    return (
        <main className="min-h-screen flex items-start justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <p className="inline-block bg-[#FFF9F0] px-4 py-2 rounded-2xl shadow-sm border border-[#8B5A2B]/10 text-[11px] uppercase tracking-widest text-[#8B5A2B]/60 mb-6">
                    Panel · Posts · <span className="text-[#3B2314] font-bold">Editar</span>
                </p>      
            </div >
        </main >
    );
}

export default edit;