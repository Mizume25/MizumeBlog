import { usePage } from '@inertiajs/react';
import { Post, SharedData } from '@/types';
import { netWork } from '../home/HomeSideBarRight';
import HomeProfile from '../home/HomeProfile';
import PostProfile from '../post/PostProfile';
import { NETWORKS } from '@/types/constants';


interface SideBarRightProps {
    posts: Post[];
    featuredTitle?: string;
    showProfile?: boolean;
    showFollow?: boolean;
    variant?: 'dark' | 'light';
    sticky?: string;
    className?: string;
    colSpan?: string; 
}

function SideBarRight({
    posts,
    featuredTitle = 'Post Destacados',
    showProfile = false,
    showFollow = false,
    variant = 'dark',
    sticky = 'lg:top-6',
    className,
    colSpan = '', 
}: SideBarRightProps) {
    const { auth } = usePage<SharedData>().props;
    const isDark = variant === 'dark';

    return (
        <aside className={`space-y-6 lg:sticky ${sticky} ${className} ${colSpan} h-fit hidden lg:block`}>

            {/* ── Perfil: opcional ── */}
            {showProfile && (
                <div className="bg-[#2A1B12] p-8 rounded-xl border border-white/10 shadow-xl text-center">
                    <a href={route('profile.edit')}>
                        {auth?.user?.avatar ? (
                            <img
                                src={auth.user.avatar}
                                alt="Perfil"
                                className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover"
                            />
                        ) : auth?.user ? (
                            <HomeProfile name={auth.user.name} />
                        ) : (
                            <img
                                src="/IMG/Foto-Perfil.jpg"
                                alt="Perfil"
                                className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover"
                            />
                        )}
                    </a>

                    {auth?.user ? (
                        <p className="text-white mt-2">Hola {auth.user.name}</p>
                    ) : (
                        <p className="text-white mt-2">Espero que te guste el post</p>
                    )}

                    <PostProfile />
                </div>
            )}

            {/* ── Post Destacados: siempre presente ── */}
            <div className={isDark
                ? "bg-[rgb(45,29,13)] p-8 rounded-xl border border-white/10 shadow-xl"
                : "bg-[#EDEDED] p-6 rounded-xl shadow-lg"
            }>
                <h3 className={isDark
                    ? "text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]"
                    : "text-[#2A1B12] text-lg font-semibold mb-5"
                }>
                    {featuredTitle}
                </h3>

                <ul className={`capitalize ${isDark} ? "pl-0" : "space-y-0`}>
                    {posts.map((post) => (
                        <li key={post.id} className={isDark
                            ? "group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]"
                            : "group"
                        }>
                            <a
                                href={route('post.show', post.id)}
                                className={isDark
                                    ? "text-white no-underline block"
                                    : "block py-3 outline-none text-[#34495E] text-base font-bold tracking-tight group-hover:text-[#1A2D42] transition-colors text-center"
                                }
                            >
                                {post.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── Sígueme: opcional ── */}
            {showFollow && (
                <section className="bg-[rgb(45,29,13)] p-8 rounded-xl border border-white/10 shadow-xl">
                    <h3 className="text-xl text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                        Sígueme
                    </h3>
                    <div className="flex flex-wrap gap-[10px]">
                        {NETWORKS.map((red) => (
                            <a
                                key={red.label}
                                href={red.url}
                                className="inline-block py-[8px] px-[15px] bg-[rgb(118,77,35)] text-white rounded-[5px] transition-colors duration-300 hover:bg-[rgb(129,106,84)] no-underline"
                            >
                                🐢 {red.label}
                            </a>
                        ))}
                    </div>
                </section>
            )}

        </aside>
    );
}

export default SideBarRight;