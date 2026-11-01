import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/animate-ui/components/radix/sidebar';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Nodo } from '@/types/custom/blog-show-types';
import { ArrowRight } from 'lucide-react';











export const SIDEBAR_DATA: Nodo[] = [
  {
    id: "introduccion",
    title: "1. Introducción",
    children: [
      {
        id: "palabras-destacadas",
        title: "1.1 Palabras destacadas",
        children: [
          {
            id: "ejemplo-parrafo-largo",
            title: "1.1.1 Ejemplo de párrafo largo",
            children: [
              {
                id: "encabezado-nivel-5",
                title: "1.1.1.1 Encabezado de nivel 5",
                children: [
                  {
                    id: "encabezado-nivel-6",
                    title: "1.1.1.1.1 Encabezado de nivel 6",
                    children: [
                      // Nivel 6 de anidación: solo existe si añades el "#" como raíz
                      { id: "hoja-nivel-6", title: "Hoja de nivel 6" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { id: "citas", title: "2. Citas" },
  {
    id: "listas",
    title: "3. Listas",
    children: [
      { id: "lista-sin-ordenar", title: "3.1 Lista sin ordenar" },
      { id: "lista-ordenada", title: "3.2 Lista ordenada" },
      { id: "lista-de-tareas", title: "3.3 Lista de tareas" },
    ],
  },
  {
    id: "tablas",
    title: "4. Tablas",
    children: [
      { id: "tabla-simple", title: "4.1 Tabla simple" },
      { id: "tabla-con-alineacion", title: "4.2 Tabla con alineación" },
      { id: "tabla-comparativa", title: "4.3 Tabla comparativa" },
    ],
  },
  {
    id: "codigo",
    title: "5. Código",
    children: [
      { id: "codigo-javascript", title: "5.1 Bloque de código JavaScript" },
      { id: "codigo-python", title: "5.2 Bloque de código Python" },
      { id: "codigo-bash", title: "5.3 Bloque de código Bash" },
    ],
  },
  {
    id: "mas-contenido",
    title: "6. Más contenido Lorem Ipsum",
    children: [
      { id: "seccion-a", title: "6.1 Sección A" },
      {
        id: "seccion-b",
        title: "6.2 Sección B",
        children: [
          { id: "puntos-clave-seccion-b", title: "Puntos clave de la sección B" },
        ],
      },
      { id: "seccion-c", title: "6.3 Sección C" },
    ],
  },
  { id: "enlaces-e-imagenes", title: "7. Enlaces e imágenes" },
  { id: "notas-finales", title: "8. Notas finales" },
];
