import styles from '@/../css/HomeMain.module.css';
import { useEffect, useState } from 'react';
import { Formato } from '@/types';
import { formatDefault , type Post} from '@/types'

/**
 * Obtener fecha formateada
 * @param data string Fecha de publicacion
 * @returns fecha publicacion
 */
const getMounth = (data: string | undefined): string => {
    let d = new Date(data ?? "01-01-1999");

    let name: string = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(d);
    return name;
}




function HomePanelPost({ post, left }: { post: Post, left: boolean }) {

    


    /** Ruta Portada */
    const ruta: string = `/IMG/Portada/${post.cover}`

    /** Categorias Badge */
    const badges: string[] = post?.tags.split(',').map((p) => p.trim());



    /**Formato Imagenes */
    const [format, setFormat] = useState<Formato | null>(formatDefault);



    let date: string = getMounth(post?.publish_date);

    /**
     * Formato de Imagen
     */
    useEffect(() => setFormat(post.config ?? null) , [post.id]);




    return (

        <>
            {left ? (
                <a href={route('post.show', post.id)} className=" capitalize no-underline block cursor-pointer group" data-id={post.id}>
                    <article style={{
                        '--bg-image': `url('${ruta}')`,
                        '--bg-format': `${format?.home_config}`
                    } as React.CSSProperties}
                        className={styles.featuredPost}>

                        <div className="flex justify-end items-start mt-[-5px] mr-[10px]">
                            <div className="hidden lg:flex gap-[15px] flex-wrap justify-end">
                                {/* Iteramos tags*/}
                                {badges.map((p, index) => (
                                    <span className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm" key={index}>
                                        {p}
                                    </span>

                                ))}

                                <span
                                    className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                    {
                                        `Lectura de ${date}`
                                    }
                                </span>


                            </div>
                        </div>

                        <div className="relative self-start w-full mb-0 mt-auto">
                            <h2 className="text-white text-[1.1rem] sm:text-[1.5rem] md:text-[2.1rem] lg:text-[2.2rem] font-bold ml-[20px] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                                {post.title}
                            </h2>

                            <span
                                className="hidden lg:block absolute bottom-[55px] right-0 mr-[20px] font-blood italic text-right text-white [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                                {post.web_title}
                            </span>
                        </div>
                    </article>
                </a>
            ) : (
                <a href={route('post.show', post.id)} className="capitalize no-underline block cursor-pointer group" data-id={post.id}>
                    <article style={{
                        '--bg-image': `url('${ruta}')`,
                        '--bg-format': `${format?.home_config}`
                    } as React.CSSProperties}
                        className={styles.featuredPost}>

                        <div className="flex justify-start items-start mt-[-5px] ml-[10px]">
                            <div className="hidden lg:flex gap-[15px] flex-wrap justify-start">
                                {/* Iteramos tags*/}
                                {badges?.map((p, index) => (
                                    <span className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm over:bg-[#4a4a4a]" key={index}>
                                        {p}
                                    </span>
                                ))}

                                <span
                                    className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                    {
                                        `Lectura de ${date}`
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="relative self-end w-full mb-0 mt-auto text-right">
                            <h2 className="text-white text-[1.1rem] sm:text-[1.5rem] md:text-[2.1rem] lg:text-[2.2rem] font-bold ml-[20px] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                                {post.title}
                            </h2>

                            <span
                                className="hidden lg:block absolute bottom-[30px] left-0 ml-[20px] font-light italic text-left text-white  [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                                {post.web_title}
                            </span>
                        </div>
                    </article>
                </a>
            )}
        </>

    )
}

export default HomePanelPost