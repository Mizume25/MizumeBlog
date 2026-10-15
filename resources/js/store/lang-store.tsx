import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = "en" | "es"

export interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'es',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'lang' }, 
  ),
);