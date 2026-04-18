
import React from "react";
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { LogOut } from "lucide-react";
import LogoutButton from "../auth/LogoutButton";
import PanelBTN from "../auth/PanelBTN";
// SideBar Left
function HomeSideBarLeft( {exist} : {exist:boolean} ) {
    const { auth } = usePage<SharedData>().props;

    return (
        <aside className="bg-[rgb(45,29,13)] p-[35px] rounded-[5px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hidden lg:block sticky top-6 ">

            <section className="mb-[30px]">

                <div className="mb-4">
                    <img src="IMG/Foto-Perfil.jpg" alt="Perfil" className="block mx-auto w-[134px] h-[144px] rounded-full border-[3px] border-[#C4A484] object-cover" />
                </div>
                <div className="text-center w-full text-white ">
                    <span>Hola, {auth.user?.name || "Bienvenido/a!"}</span>
                </div>
                <br />
                <h3
                    className="text-white font-bold pb-[10px] border-b-2 border-[#eee] mb-4 [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)] text-xl ">
                    Secciones
                </h3>

                <ul className="pl-0 text-center">
                     
                    {exist && (
                        <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mb-0 mt-[10px]">
                        <a href={route('profile.edit')} className="text-white no-underline">
                            🐢 Perfil Personal
                        </a>
                    </li>
                    )}
                    <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mb-0 mt-[10px]">
                        <a href="#" className="text-white no-underline">
                            🐢 Sobre Autores
                        </a>
                    </li>
                    <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]">
                        <a href="#" className="text-white no-underline">
                            🐢 Archivador
                        </a>
                    </li>
                    <li
                        className="group w-full p-[10px] rounded-[8px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#624a2e] hover:scale-[1.02] text-left mt-[10px]">
                        <a href="#" className="text-white no-underline">
                            🐢 Intereses
                        </a>
                    </li>
                </ul>
                <br />
                
                {auth.user &&  <LogoutButton />}
                <br />
                {auth.user?.role  == 'admin' && ( <PanelBTN />)}

            </section>

        </aside>
    )
}

export default React.memo(HomeSideBarLeft);