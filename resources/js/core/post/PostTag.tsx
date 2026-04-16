

function PostTag({ tags }: { tags: string[] }) {

   return (
      //Mapeamos tags
      <div className="flex justify-center gap-3 p-6 bg-[#2A1B12]">
         {/* He añadido un fondo oscuro temporal para que resalten los tags blancos como en la imagen */}
         {tags.map((p, i) => (
            <span
               key={i}
               className="bg-[#d9d9d9] text-black px-6 py-3 rounded-[20px] text-lg font-bold shadow-sm"
            >
               {p}
            </span>
         ))}
      </div>
   )
}

export default PostTag