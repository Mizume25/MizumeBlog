import { BackgroundPositionKeyword, Post , BackgroundOptions} from "@/types";


interface HomeEditionProps {
    mainPosts: Post[],
    position: BackgroundPositionKeyword | null,
    selectPost: number | null,
    confirmPosition: boolean,
    onConfirm: () => void,
    onPosition: (position: BackgroundPositionKeyword) => void,
    onPost: (id : number) => void,
    onClose: () => void,
}

function HomeEdition({mainPosts , position , selectPost , confirmPosition , onConfirm , onClose , onPosition , onPost} : HomeEditionProps) {
    return (
        <>
            <p className="mb-4 text-sm text-white dark:text-gray-100">Configura las opciones del layout aquí.</p>

            <select
                className="mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 text-black capitalize outline-none focus:bg-amber-200"
                value={selectPost ?? ''}
                onChange={(e) => onPost(Number(e.target.value))}
            >
                {mainPosts.map((p, i) => (
                    <option key={p.id} value={p.id} className="bg-white text-black">
                        {p.title}
                    </option>
                ))}
            </select>

            <h3 className="mb-2 text-lg font-bold text-white">Posicion</h3>
            <select
                className={`mb-5 w-full cursor-pointer rounded-xl bg-amber-100 p-2 text-black capitalize outline-none focus:bg-amber-200 disabled:bg-amber-200/20`}
                value={position ?? ''}
                onChange={(e) => onPosition(e.target.value as BackgroundPositionKeyword)}
            >
                {BackgroundOptions.map((p, i) => (
                    <option key={i} value={p} className="bg-white text-black">
                        {p}
                    </option>
                ))}
            </select>
            <button
                onClick={onConfirm}
                className="bg-btn-success text-btn-success-foreground mb-2 w-full rounded-xl px-4 py-2 transition-colors not-disabled:cursor-pointer disabled:bg-white/60"
                disabled={!confirmPosition}
            >
                Confirmar Posicion
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

export default HomeEdition;
