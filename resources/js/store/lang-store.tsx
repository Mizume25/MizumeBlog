import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setZodLocale } from '@/lib/schema-messages';

export type Lang = "en" | "es"

export interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

/** Cookie que lee el middleware SetLocale del servidor */
const writeLangCookie = (lang: Lang) => {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
};

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'es',
      setLang: (lang) => {
        writeLangCookie(lang);
        setZodLocale(lang);
        set({ lang });

        // Las páginas precargadas (prefetch) están en el idioma anterior: se descartan antes de recargar
        router.flushAll();
        router.reload();
      },
    }),
    {
      name: 'lang',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        writeLangCookie(state.lang);
        setZodLocale(state.lang);
      },
    },
  ),
);
