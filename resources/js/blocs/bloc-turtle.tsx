/**
 * @fileoverview Mensaje con la tortuga (estados vacíos, "aquí se cargará el contenido", errores...)
 */

import { TurtleService } from "@/custom/services"
import { cn } from "@/lib/utils"
import { TurtleStatus } from "@/types/custom"

interface BlocTurtleMessageProps {
    /** Texto que acompaña a la tortuga */
    text: React.ReactNode,
    /** Estado (imagen) de la tortuga */
    status?: TurtleStatus,
    /** col = tortuga encima del texto · row = texto a la izquierda y tortuga a la derecha */
    direction?: 'col' | 'row',
    /** Clases del contenedor */
    className?: string,
    /** Clases de la imagen (tamaño por defecto h-30 w-30) */
    imageClassName?: string,
    /** Clases del texto */
    textClassName?: string,
}

/**
 * Bloque reutilizable con la tortuga y un mensaje.
 * Ej.: `<BlocTurtleMessage status="smile" text={DATA.sidebar.empty} />`
 */
export const BlocTurtleMessage = ({
    text,
    status = 'smile',
    direction = 'col',
    className,
    imageClassName,
    textClassName,
}: BlocTurtleMessageProps) => {

    const image = (
        <img
            src={TurtleService.onPath(status)}
            alt={TurtleService.onName(status)}
            className={cn('h-30 w-30', imageClassName)}
        />
    )

    if (direction === 'row') {
        return (
            <div className={cn('flex flex-row items-center justify-center gap-5', className)}>
                <p className={textClassName}>{text}</p>
                {image}
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col items-center justify-center gap-4 p-6 text-center', className)}>
            {image}
            <p className={cn('text-sm opacity-80', textClassName)}>{text}</p>
        </div>
    )
}
