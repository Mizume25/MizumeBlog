import '@/../css/HomeMain.module.css';
import {type PostDestacados} from '@/types';

//CONTENIDO GENERAL
function HomeContent({FirstPost, SecondPost, ThreePost} : {FirstPost:PostDestacados, SecondPost:PostDestacados, ThreePost:PostDestacados}) {
  return (
        <div className="p-0 m-0 bg-transparent flex flex-col gap-[5px]">

           
            <a href="#" className="no-underline block cursor-pointer group">
                <article
                    className="featured-post fondo-articulo1 min-h-[360px] flex flex-col justify-between p-[30px] rounded-[15px] shadow-[10px_4px_15px_rgba(255,255,255,0.1)]">

                    <div className="flex justify-end items-start mt-[-5px] mr-[10px]">
                        <div className="flex gap-[15px] flex-wrap justify-end">
                            <span
                                className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                Lectura de Abril 2025
                            </span>
                            <span
                                className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                Terror
                            </span>
                        </div>
                    </div>

                    <div className="relative self-start w-full mb-0 mt-auto">
                        <h2
                            className="text-white text-[2.2rem] font-bold ml-[20px] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                            SHIKI - Fuyumi Ono
                        </h2>

                        <span
                            className="absolute bottom-[55px] right-0 mr-[20px] font-light italic text-right [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                            El pueblo esta rodeado de muerte
                        </span>
                    </div>
                </article>
            </a>

            <a href="#" className="no-underline block cursor-pointer group">
                <article
                    className="featured-post fondo-articulo2 text-white min-h-[360px] flex flex-col justify-between p-[30px] rounded-[15px] shadow-[10px_4px_15px_rgba(255,255,255,0.1)] group">

                    <div className="flex justify-start items-start mt-[-5px] ml-[10px]">
                        <div className="flex gap-[15px] flex-wrap justify-start">
                            <span
                                className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                Lectura de Enero 2024
                            </span>
                            <span
                                className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                Ciencia Ficción
                            </span>
                        </div>
                    </div>

                    <div className="relative self-end w-full mb-0 mt-auto text-right">
                        <h2
                            className="text-white text-[2.2rem] font-bold mr-[20px] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                            Shin Sekai Yori
                        </h2>

                        <span
                            className="absolute bottom-[12px] left-0 ml-[20px] font-light italic text-left [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                            La Sinfonía Nº 9 "Del Nuevo Mundo" suena
                        </span>
                    </div>
                </article>
            </a>

            <a href="#" className="no-underline block cursor-pointer group">
                <article
                    className="featured-post fondo-articulo3 text-white min-h-[360px] flex flex-col justify-between p-[30px] rounded-[15px] shadow-[10px_4px_15px_rgba(255,255,255,0.1)]">

                    <div className="flex justify-end items-start mt-[-5px] mr-[10px]">
                        <div className="flex gap-[15px] flex-wrap justify-end">
                            <span
                                className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                Lectura de Abril 2025
                            </span>
                            <span
                                className="bg-[rgba(255,255,255,0.9)] text-[#333] px-[15px] py-[8px] rounded-[20px] text-[0.9rem] font-bold shadow-sm">
                                Terror
                            </span>
                        </div>
                    </div>

                    <div className="relative self-start w-full mb-0 mt-auto">
                        <h2
                            className="text-white text-[2.2rem] font-bold ml-[20px] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
                            SHIKI - Fuyumi Ono
                        </h2>

                        <span
                            className="absolute bottom-[10px] right-0 mr-[20px] font-light italic text-right [text-shadow:_2px_2px_4px_rgba(0,0,0,0.4),_0_0_10px_rgba(0,0,0,0.2)]">
                            El pueblo esta rodeado de muerte
                        </span>
                    </div>
                </article>
            </a>
      </div>
  )
}

export default HomeContent