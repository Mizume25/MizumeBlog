import { router } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


/**
 * Formato de date
 * @param iso 
 * @returns 
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}


export const CURRENT_YEAR = new Date().getFullYear();

export const PaginatedText = {
    es: { prev: 'Anterior', next: 'Siguiente', page: 'Página' },
    en: { prev: 'Previous', next: 'Next', page: 'Page' },
}

export const goBack = () => {
  if (window.history.length > 1) window.history.back();
  else router.visit(route('dashboard'));
};