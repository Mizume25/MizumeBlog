import { Post } from ".";
import { Title } from "@radix-ui/react-dialog";

export interface RandPost {
    nombre:string
    ruta?:string
}

export const getPosts = async (max: number, omitId?: number): Promise<RandPost[]> => {
  try {
    const response = await fetch("/data/Contenido.json");

    if (!response.ok) {
      throw new Error("No se ha podido cargar el archivo");
    }

    const data: Post[] = await response.json();

    const filtered = omitId
      ? data.filter(post => post.id !== omitId)
      : data;

    const sections: RandPost[] = filtered
      .sort(() => Math.random() - 0.5)
      .slice(0, max)
      .map(p => ({
        nombre: p.titulo, 
        ruta: p?.ruta
      }));

    return sections; 

  } catch (e) {
    console.error("Error cargando posts:", e);
    return [];
  }
};


// utils.ts o donde tengas getPosts
