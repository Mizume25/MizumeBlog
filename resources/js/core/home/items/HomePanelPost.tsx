import styles from '@/../css/HomeMain.module.css';
import { Post } from '@/types';

//GENERAR FECHA
const getMounth = (data: string | undefined): string => {
    let d = new Date(data ?? "01-01-1999");

    let name: string = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(d);
    return name;
}


//Paneles dinamicos del Home
function HomePanelPost({ post, left }: { post: Post | undefined, left: boolean }) {

    //Generamos un array
    const arr_Tags: string[] | undefined = post?.genero.split(',').map(p => p.trim());

    //Dinamic Background


    let fecha : string = getMounth(post?.fecha_publicacion);

    return (

        <>
            {left ? (
                <a href="#" className="no-underline block cursor-pointer group" data-id={post?.id}>
                    <article style={{ '--bg-image': `url('${post?.ruta}')` } as React.CSSProperties}
    className={styles.featuredPost}>

                        <div className="flex justify-end items-start mt-[-5px] mr-[10px]">
                            <div className="flex gap-[15px] flex-wrap justify-end">
                                {/* Iteramos tags*/}
                                {arr_Tags?.map((p, index) => (
                                    <span className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm " key={index}>
                                        {p}
                                    </span>

                                ))}

                                <span
                                    className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                    {
                                        `Lectura de ${fecha}`
                                    }
                                </span>

                                {/*
                            <span
                                className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                Lectura de Abril 2025
                            </span>
                            <span
                                className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                Terror
                            </span>

                               */ }


                            </div>
                        </div>

                        <div className="relative self-start w-full mb-0 mt-auto">
                            <h2
                                className="text-white text-[2.2rem] font-bold ml-[20px] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                                {post?.titulo}
                            </h2>

                            <span
                                className="hidden lg:block absolute bottom-[55px] right-0 mr-[20px] font-light italic text-right [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                                {post?.web_title || `Lectura de ${post?.autor}`}
                            </span>
                        </div>
                    </article>
                </a>
            ) : (
                <a href="#" className="no-underline block cursor-pointer group" data-id={post?.id}>
                    <article style={{ '--bg-image': `url('${post?.ruta}')` } as React.CSSProperties}
    className={styles.featuredPost}>

                        <div className="flex justify-start items-start mt-[-5px] ml-[10px]">
                            <div className="flex gap-[15px] flex-wrap justify-start">
                                {/* Iteramos tags*/}
                                {arr_Tags?.map((p, index) => (
                                    <span className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm over:bg-[#4a4a4a]" key={index}>
                                        {p}
                                    </span>
                                ))}

                                <span
                                    className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                    {
                                        `Lectura de ${fecha}`
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="relative self-end w-full mb-0 mt-auto text-right">
                            <h2
                                className="text-white text-[2.2rem] font-bold mr-[20px] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                                {post?.titulo}
                            </h2>

                            <span
                                className="hidden lg:block absolute bottom-[30px] left-0 ml-[20px] font-light italic text-left [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                                {post?.web_title || `Lectura de ${post?.autor}`}
                            </span>
                        </div>
                    </article>
                </a>
            )}
        </>

    )
}

export default HomePanelPost