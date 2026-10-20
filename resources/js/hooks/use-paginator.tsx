import { useLangStore } from '@/store/lang-store'
import { TEXT } from '@/lib/i18n'


export const useT = () => TEXT[useLangStore((s) => s.lang)]