import { router } from '@inertiajs/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        set({ lang });
        
        router.reload();
      },
    }),
    {
      name: 'lang',
      onRehydrateStorage: () => (state) => {
        if (state) writeLangCookie(state.lang);
      },
    },
  ),
);
