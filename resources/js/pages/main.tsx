import {
  BlogLayout,
  BlogWidget,
} from '@/layouts/app'
import {
  MainProps,
  BlogMain,
  BlogSection,
  BlogWidgetWrap
} from '@/core/desktop/main-components'
import { useMainHook } from '@/hooks/custom/main-hook'
import { useLangStore } from '@/store/lang-store';
import { DATA_ENTITIES } from '@/core/desktop/utils-components';
import { DATA } from '@/constants/main-constants';
import { Route } from '@/types';
import { Head } from '@inertiajs/react';


/** Home lo añade el sidebar: aquí no hay circuito propio */
const routes: Route[] = []


/**
 * Home: obras destacadas por el admin.
 * El carrusel elige una obra; la ficha enlaza a su índice (works/{slug}) con sus posts destacados.
 */
function main({ works }: MainProps) {

  /** Variable de estado de lenguaje */
  const lang = useLangStore((l) => l.lang)

  /** Obra seleccionada (por id: sobrevive al cambio de idioma) */
  const { work, changeWork } = useMainHook(works)

  /** Contenido de la pagina */
  const CONTENT = DATA[lang]

  /** Contenido de entidades */
  const ENTITIES = DATA_ENTITIES[lang]

  return (
    <BlogLayout routes={routes}>
      <Head title={CONTENT.head} />
      <BlogWidgetWrap>
        <BlogWidget variant='post' content={CONTENT} />
        <BlogWidget variant='work' content={CONTENT} />
        <BlogWidget variant='author' content={CONTENT} />
      </BlogWidgetWrap>
      <BlogMain>
        <BlogSection variant='left' works={works} work={work} changeWork={changeWork} ENTITIES={ENTITIES} lang={lang} />
        <BlogSection variant='right' works={works} work={work} changeWork={changeWork} ENTITIES={ENTITIES} lang={lang} />
      </BlogMain>
    </BlogLayout>
  )
}

export default main
