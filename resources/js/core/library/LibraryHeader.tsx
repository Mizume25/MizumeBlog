import { NavContentProps } from "@/pages/post/library"
import { Section, SECTION } from "@/types/constants"

function LibraryHeader( { onSection , section} : NavContentProps) {




    return (
        <>
            <div className="px-4 sm:px-8 pt-10 pb-6  bg-[#e5c385] ">
                <div className="flex items-baseline gap-4 flex-wrap">
                    <h2 className="font-display text-3xl sm:text-7xl font-bold tracking-tight text-[#61452f]">Archivador</h2>

                </div>
                <p className="mt-3 text-[#61452f] max-w-xl text-sm sm:text-base">
                    Cada categoría es un cajón. Cada post, una ficha. Busca por tema en el índice de la izquierda.
                </p>
            </div>

            <div className="lg:hidden flex gap-2 overflow-x-auto px-4 py-4  bg-[#2B1D12]">
                <select name="section" id="section" className=" capitalize w-full h-full bg-[#b59379] rounded-xl p-4" onChange={(e) => onSection(e.target.value as Section)}>
                    {SECTION.map((c) => (
                    <option key={c.label} value={c.label} className="rounded-xl capitalize tab-btn tab-shape hover:bg-[#A23E2E] text-left pl-6 pr-8 py-3 text-white text-sm mb-1 flex justify-between items-center cursor-pointer">
                        {c.label}
                    </option>
                ))}
                </select>
            </div>
        </>
    )
}

export default LibraryHeader