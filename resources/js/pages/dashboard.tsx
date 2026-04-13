import { Head } from '@inertiajs/react';
import HomeHeader from '@/core/home/items/HomeHeader';
import HomeSideBarLeft from '@/core/home/items/HomeSideBarLeft';
import HomeSideBarRight from '@/core/home/items/HomeSideBarRight';
import {type Post} from '@/types';
//Variable de estado 



//Contenido del Home
export default function Dashboard() {
    return (
        <>
            {/* Head de el Home*/}
            <Head title='Home'></Head>
            <main className="container mx-auto max-w-[1300px] p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-8 items-start">

                {/*Header Layout*/}
                <HomeHeader />

                {/*SideBar izquierdo*/}
                <HomeSideBarLeft />


                {/*Contenido Body*/}
               


                {/*SideBar derecho*/}
                <HomeSideBarRight />

            </main>
        </>
    );
}
