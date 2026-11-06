import { useState } from 'react'
import type { AnimationEvent, CSSProperties } from 'react'
import { TurtleService } from '@/custom/services'
import styles from '../../../css/AnimateCSS.module.css'

interface LoadingProps {
    text: string
    className?: string
    textStyles?: string
}

export default function Loading({ className = '', text, textStyles = '' }: LoadingProps) {
    const [cycle, setCycle] = useState(0)
    const chars = [...text]

    // Solo reinicia cuando termina la animación del contenedor, no la de las letras
    const handleEnd = (e: AnimationEvent<HTMLSpanElement>) => {
        if (e.target === e.currentTarget) setCycle((c) => c + 1)
    }

    return (
        <div className={className}>
            <img
                src={TurtleService.onPath('load')}
                alt={TurtleService.onName('load')}
                className="h-30 w-30"
            />
            <span role="status" aria-label={text} className={textStyles}>
                <span
                    key={cycle}
                    aria-hidden="true"
                    className={styles.loading}
                    style={{ '--n': chars.length } as CSSProperties}
                    onAnimationEnd={handleEnd}
                >
                    {chars.map((char, i) => (
                        <span
                            key={i}
                            className={styles.char}
                            style={{ '--i': i } as CSSProperties}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </span>
            </span>
        </div>
    )
}