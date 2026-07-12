import React from 'react'
import { Tag } from 'lucide-react'
import { SECTION } from '@/types/constants'
function LibrarySideBarLeft() {
    return (

        <aside className="hidden lg:flex flex-col shrink-0 w-64 gap-3 bg-[#2B1D12]  py-6" >
            {SECTION.map((c) => (
                <button
                    key={c.label}
                    className={`capitalize transition-transform duration-300 ease-in-out  tab-btn tab-shape 
                        hover:bg-[#A23E2E] text-[#EFE7D8] px-7 py-3  text-sm  flex justify-start items-center 
                        cursor-pointer ${c.active ? 'bg-[#A23E2E]' : '' }`}
                >
                    <Tag size={16} className='me-2 ' /> {c.label}
                </button>
            ))}
        </aside>

    )
}

export default LibrarySideBarLeft