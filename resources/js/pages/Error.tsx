import { Link } from "@inertiajs/react";


/**
 * Ejemplo
 * @param status Estado de eror 
 * @returns 
 */
interface ErrorProps {
    status: number
}

const messages: Record<number, string> = {
    403: 'No tienes permiso para acceder a esto.',
    404: 'No encontramos lo que buscabas.',
    419: 'Tu sesión expiró, recarga la página.',
    429: 'Estás yendo demasiado rápido. Espera un momento.',
    500: 'Algo salió mal de nuestro lado.',
    503: 'Estamos en mantenimiento, vuelve pronto.',
};

export default function Error({ status }: ErrorProps) {
    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-[#522100] text-white font-bold text-center gap-4">
            <div className="flex items-center gap-4">
                <h1 className="text-6xl font-bold">{status}</h1>
                <img src="/IMG/Error-App.png" alt="Error de imagen" width={170} height={170} />
            </div>

            <p className="text-lg">{messages[status] ?? 'Ocurrió un error inesperado.'}</p>

            <Link
                href="/"
                className="mt-2 inline-block rounded-lg bg-amber-600 px-6 py-2 font-semibold hover:bg-amber-700 transition"
            >
                Volver al inicio
            </Link>
        </div>

    );
}