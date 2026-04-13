
interface BTN {
    onButtonClick: (id: string) => void;
}

//Boton
function HomeButton({btnId} : {btnId:string}) {



  return (
     <button id={btnId}
        className="lg:hidden fixed top-6 left-6 z-50 bg-[#754C22] p-3 rounded-lg shadow-lg border border-white/20 active:scale-95 transition-all cursor-pointer">
        <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
        </div>
    </button>
  )
}

export default HomeButton