

function PostTag({ tags }: { tags: string[] }) {

   return (
      //Mapeamos tags
      <div className="flex justify-center gap-2 sm:gap-3 px-3 py-3 sm:px-6 sm:py-6 bg-[#2A1B12]">
         {tags.map((p, i) => (
            <span
               key={i}
               className="bg-[#d9d9d9] text-black px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-[20px] text-sm sm:text-base lg:text-lg font-bold shadow-sm whitespace-nowrap"
            >
               {p}
            </span>
         ))}
      </div>
   )
}

export default PostTag