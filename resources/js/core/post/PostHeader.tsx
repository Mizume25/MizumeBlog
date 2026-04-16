//HEADER POST
function PostHeader({ route, title }: { route: string | undefined, title: string }) {
  return (
    <>
      {/* Imagen de la obra */}
      <header
        className="w-full h-[35vh] bg-no-repeat bg-cover bg-[center_18%]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${route})`
        }}
      >
      </header>

      {/* Titulo de la obra */}
      <div className="relative z-10 flex justify-center -mt-10 px-4">
        <div className="w-full max-w-4xl bg-[#C8AD7F] py-4 rounded-xl shadow-lg border border-[#b39a6f] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide drop-shadow-md uppercase drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_10px_rgba(0,0,0,0.5)]">
            {title}
          </h1>
        </div>
      </div>
    </>
  )
}

export default PostHeader