import { Link } from '@inertiajs/react';

const TopAuthBar = () => {
    return (
        <div className="w-full bg-[#f3e5ab] text-[#2c1e17] py-2 px-4 shadow-md sticky top-0 z-50">
            <div className="max-w-[1500px] mx-auto flex justify-between items-center text-sm font-medium">
                <p className="hidden md:block">
                  Hola, Si tienes cuenta puedes iniciar sesion y si gustas puedes registrate :3
                </p>
                <p className="md:hidden">¡Únete a MiZumeBlog!</p>
                
                <div className="flex gap-6 items-center">
                    <Link href={route('login')} className="hover:underline">
                        Iniciar Sesión
                    </Link>
                    <Link 
                        href={route('register')} 
                        className="bg-[#2c1e17] text-[#f3e5ab] px-3 py-1 rounded hover:bg-[#4a3728] transition-colors"
                    >
                        Registrarse
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopAuthBar