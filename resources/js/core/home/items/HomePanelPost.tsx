import styles from '@/../css/HomeMain.module.css';
import { Post } from '@/types';

//GENERAR FECHA
const getMounth = (data: string): string => {
    let d = new Date(data);

    let name: string = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(d);
    return name;
}


//Paneles dinamicos del Home
function HomePanelPost({ post, left }: { post: Post, left: boolean }) {

    //Generamos un array
    const arr_Tags: string[] = post.genero.split(',').map(p => p.trim());

    //Dinamic Background


    let fecha = getMounth(post.fecha_publicacion);

    return (

        <>
            {left ? (
                <a href="#" className="no-underline block cursor-pointer group" data-id={post.id}>
                    <article style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${post?.ruta}')`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                        className="featured-post  min-h-[360px] flex flex-col justify-between p-[30px]  shadow-[10px_4px_15px_rgba(255,255,255,0.1)] group anime">

                        <div className="flex justify-end items-start mt-[-5px] mr-[10px]">
                            <div className="flex gap-[15px] flex-wrap justify-end">
                                {/* Iteramos tags*/}
                                {arr_Tags.map((p, index) => (
                                    <span className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm" key={index}>
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
                                {post.titulo}
                            </h2>

                            <span
                                className="absolute bottom-[55px] right-0 mr-[20px] font-light italic text-right [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                                {post?.web_title || `Lectura de ${post.autor}`}
                            </span>
                        </div>
                    </article>
                </a>
            ) : (
                <a href="#" className="no-underline block cursor-pointer group" data-id={post.id}>
                    <article style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${post?.ruta}')`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                        className= "featured-post text-white min-h-[360px] flex flex-col justify-between p-[30px] shadow-[10px_4px_15px_rgba(255,255,255,0.1)] group anime">

                        <div className="flex justify-start items-start mt-[-5px] ml-[10px]">
                            <div className="flex gap-[15px] flex-wrap justify-start">
                                {/* Iteramos tags*/}
                                {arr_Tags.map((p, index) => (
                                    <span className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm" key={index}>
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
                                {post.titulo}
                            </h2>

                            <span
                                className="absolute bottom-[30px] left-0 ml-[20px] font-light italic text-left [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                                {post?.web_title || `Lectura de ${post.autor}`}
                            </span>
                        </div>
                    </article>
                </a>
            )}
        </>

    )
}

export default HomePanelPost