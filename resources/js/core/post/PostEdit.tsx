import { BackgroundOptions, BackgroundPositionKeyword } from "@/types";
import {MIN , MAX , DEFAULT_HEIGHT} from "@/pages/post/show";
interface PostEditProps {
    height: number,
    onChange: (n:number) => void,
    onPlus: () => void,
    onRest: () => void,
    onReset: () => void,
    onClose: () => void,
    onConfirm: () => void,
    onPosition: (ps: BackgroundPositionKeyword) => void,
}

function PostEdit({height, onChange, onClose, onConfirm, onPlus, onReset, onRest , onPosition} : PostEditProps) {
    return (
        <>
            <h3 className="mb-2 text-lg font-bold text-white">Posicion</h3>
            <p className="mb-4 text-sm text-gray-100">Configura las opciones del layout aquí.</p>

            <select
                className={`mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 text-black capitalize outline-none focus:bg-amber-200 disabled:bg-amber-200/20`}
                onChange={(e) => onPosition(e.target.value as BackgroundPositionKeyword)}
            >
                {BackgroundOptions.map((p, i) => (
                    <option key={i} value={p} className="bg-white text-black">
                        {p}
                    </option>
                ))}
            </select>
            <h3 className="mb-2 text-lg font-bold text-white">Altura</h3>
            <div className="mb-2 flex items-center gap-2">
                <input
                    type="number"
                    min={MIN}
                    max={MAX}
                    value={height}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full [appearance:textfield] rounded-xl border border-[#2a2f3a] bg-[#171a21] px-4 py-2.5 font-mono text-[15px] text-[#e8eaed] tabular-nums transition-colors duration-150 outline-none focus:border-[#5b8cff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8cff] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <div className="flex flex-none items-center gap-1">
                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2f3a] bg-[#171a21] text-lg leading-none text-[#e8eaed] transition-colors duration-150 hover:border-[#5b8cff] hover:text-[#5b8cff] active:scale-95"
                        aria-label="Disminuir"
                        onClick={(e) => onRest()}
                    >
                        −
                    </button>

                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2f3a] bg-[#171a21] text-xs text-[#8a90a0] transition-colors duration-150 hover:border-[#5b8cff] hover:text-[#5b8cff] active:scale-95"
                        aria-label="Restablecer"
                        title="Restablecer"
                        onClick={() => onReset()}
                    >
                        ↺
                    </button>

                    <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2f3a] bg-[#171a21] text-lg leading-none text-[#e8eaed] transition-colors duration-150 hover:border-[#5b8cff] hover:text-[#5b8cff] active:scale-95"
                        aria-label="Aumentar"
                        onClick={() => onPlus()}
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                onClick={onConfirm}
                className="bg-btn-success text-btn-success-foreground mb-2 w-full rounded-xl px-4 py-2 transition-colors not-disabled:cursor-pointer disabled:bg-white/60"
                disabled={!confirm}
            >
                Confirmar Cambio
            </button>

            <button
                onClick={onClose}
                className="bg-btn-info text-btn-info-foreground btn-hover-scale w-full rounded-xl px-4 py-2 transition-colors"
            >
                Cerrar Panel
            </button>
        </>
    );
}

export default PostEdit;
