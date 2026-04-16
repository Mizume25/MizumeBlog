import { Post } from ".";
import { Title } from "@radix-ui/react-dialog";

export interface Rutas {
    id:number,
    titulo:string
}

//Nombres aleatorios
export const getName = async (max: number, omitId: number): Promise<Rutas[]> => {
  try {
    const response = await fetch("/data/Contenido.json");
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




