import { useCallback, useRef } from 'react';

type NumberInputWithProgressProps = {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
};

function NumberInputWithProgress({ value, onChange, min = -100, max = 100 }: NumberInputWithProgressProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const percent = ((value - min) / (max - min)) * 100;

    const updateFromClientX = useCallback(
        (clientX: number) => {
            const track = trackRef.current;
            if (!track) return;

            const rect = track.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
            const rawValue = min + ratio * (max - min);

            onChange(Math.round(rawValue));
        },
        [min, max, onChange],
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        // Solo actualiza mientras se mantiene presionado (buttons === 1)
        if (e.buttons !== 1) return;
        updateFromClientX(e.clientX);
    };

    return (
        <div className="mb-2 w-full">
            <input
                type="number"
                max={max}
                min={min}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="h-12 w-full [appearance:textfield] rounded-xl border border-white/10 bg-black/30 px-4 text-white transition-all duration-200 outline-none placeholder:text-white/30 focus:border-white/30 focus:bg-black/40 focus:ring-2 focus:ring-white/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0"
            />

            <div
                ref={trackRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                className="relative mt-3 h-1.5 w-full cursor-pointer rounded-full bg-gray-300 dark:bg-white/10"
            >
                <div
                    className="pointer-events-none absolute top-0 left-0 h-full rounded-full bg-gray-700 transition-[width] duration-75 dark:bg-white/60"
                    style={{ width: `${percent}%` }}
                />
                <div
                    className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 shadow-[0_0_6px_rgba(0,0,0,0.3)] transition-[left] duration-75 dark:bg-white dark:shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                    style={{ left: `${percent}%` }}
                />
            </div>
        </div>
    );
}

export default NumberInputWithProgress;