import React from 'react'
import { Tag } from 'lucide-react'
function LibrarySideBarLeft( { categories } : { categories:string[]}) {
    return (

        <aside className="hidden lg:flex flex-col shrink-0 w-64 gap-3 bg-[#2B1D12]  py-6" >
            <button className="capitalize  transition-transform duration-300 ease-in-out  tab-btn tab-shape hover:bg-[#A23E2E] text-[#EFE7D8] pl-6 pr-8 py-3  text-sm mb-1 flex justify-start items-center cursor-pointer"
            ><Tag size={16} className='me-2' />  Todos </button>
            {categories.map((c) => (
                <button
                    key={c}
                    className="capitalize transition-transform duration-300 ease-in-out  tab-btn tab-shape hover:bg-[#A23E2E] text-[#EFE7D8] px-7 py-3  text-sm  flex justify-start items-center cursor-pointer"
                >
                    <Tag size={16} className='me-2 ' /> {c}
                </button>
            ))}
        </aside>

    )
}

export default LibrarySideBarLeft