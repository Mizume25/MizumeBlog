import Swal from 'sweetalert2';


export interface Formato {
    id?:number,
    home_config?:string,
    article_config?:string,
    card_config?:string,
}


// Creamos una versión personalizada de SweetAlert2 con tus colores
const MySwal = Swal.mixin({
    customClass: {
        confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-md mx-2 hover:bg-red-700 transition-colors',
        cancelButton: 'px-4 py-2 bg-[#4a3728] text-white rounded-md mx-2 hover:bg-[#5a4738] transition-colors',
        popup: 'rounded-xl border border-[#4a3728]/50 shadow-2xl'
    },
    buttonsStyling: false, // Desactivamos el estilo por defecto para usar Tailwind
    background: '#1a1a1a',
    color: '#fff',
});

/**
 * Función reutilizable para confirmar eliminaciones
 */
export const confirmDelete = (title : string, text : string, onConfirm: () => void) => {
    MySwal.fire({
        title: title || '¿Estás seguro?',
        text: text || 'Esta acción no se puede deshacer.',
        icon: 'warning',
        iconColor: '#ef4444',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm(); // Ejecuta la función que le pases (el borrado)
        }
    });
};



export interface Rutas {
    id:number,
    titulo:string
}



//Nombres aleatorios
export const getName = async (max: number, omitId: number): Promise<Rutas[]> => {
  try {
    const response = await fetch('/backups/posts.json');
    if (!response.ok) throw new Error('Error al cargar JSON');
    
    const datos = await response.json();

    const titulosAleatorios: Rutas[] = datos
      .filter((p: any) => p.id !== omitId && p.publicado == true)
      .sort(() => Math.random() - 0.5)
      .slice(0, max)
      .map((p: any) => ({
          id: p.id,
          titulo:p.titulo
      }));

    return titulosAleatorios; 
  } catch (error) {
    console.error(error);
    return []; 
  }
};


//Formato de las imagenes de los post
export const getFormatoPost = async (id:number): Promise<Formato | null> => {
    try {
        
    
    const answer = await fetch('/data/Formato.json');
        if (!answer.ok) throw new Error('Error al cargar JSON');

    const data = await answer.json();

    const formatPost : Formato = data
    .find((p : any) => p.id == id);
    
    return formatPost ?? null;
    

    } catch (error) {
        console.error(error);
        return null; 
    }
};

export const getRoutePortada  = (categoria:string | undefined, portada:string |undefined): string => {
    return `/IMG/Portada/${categoria}/${portada}`
}

export const getRouteCard  = (categoria:string | undefined, card:string |undefined): string => {
    return `/IMG/Cards/${categoria}/${card}`
}


