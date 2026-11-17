import { BlocSectionPage } from "@/blocs/bloc-manage-info"
import { PageProgress, PostSections, PostSidebar } from "@/core/desktop/work-show-components"
import usePostSections from "@/hooks/custom/use-post-sections"
import WorkShowLayout, { useWorkShowSlots } from "@/layouts/app/work-show-layout"
import { useLangStore } from "@/store/lang-store"
import { DATA_WORK_SHOW } from "@/constants/work-show-constants"
import { WorkShowPostProps } from "@/types/custom/work-show-types"
import { Head, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { useEffect, useState } from "react"
import Switch from "react-switch"
import MDEditor from "@uiw/react-md-editor"
import { EDITOR_COMMANDS } from "@/core/post/md-commands"
import MarkdownRenderer from "@/core/post/MarkdownRenderer"
import { Button } from "@/components/animate-ui/components/buttons/button"
import { Save } from "lucide-react"

/**
 * works/show/post: lectura del post por secciones.
 * Aporta al layout el índice (aside), la barra de progreso y el selector de secciones.
 */
function WorkShowPost({ post, build }: WorkShowPostProps) {

  const lang = useLangStore((l) => l.lang)

  const DATA = DATA_WORK_SHOW[lang]

  const { section, setSection, direction, onIndex, totalSections, body, content, setContent } = usePostSections(build)



  const { auth } = usePage<SharedData>().props;

  /** Solo el autor del post puede editar (se calcula, no es estado); invitados → false */
  const isOwner = auth.user?.id === post.user.id;

  /** Modo edición: solo tiene efecto si isOwner */
  const [edit, setEdit] = useState(false);

  // Inertia reutiliza la página al pasar de un post a otro: se sale del modo edición
  useEffect(() => setEdit(false), [post.id]);

  useWorkShowSlots({
    aside: <PostSidebar DATA={DATA} index={edit ? undefined : build.index} onIndex={onIndex} />,
    top: totalSections > 0 && <PageProgress section={section} total={totalSections} />,
    headerExtra: (
      <BlocSectionPage
        variant='numbers'
        className="flex min-w-0 flex-1 h-20 items-center justify-center rounded-2xl bg-mizume-fourthary py-2 px-4 @2xl:shrink-0 @2xl:min-w-56"
        lang={lang}
        key={post.id}
        sections={{ min: 1, max: totalSections }}
        value={section + 1}
        onChange={(n) => setSection(n - 1)}
        edit={edit}
      />
    ),
    headerAction: isOwner && (
      <label className="flex min-h-15 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-mizume-fourthary p-4">

        <span className="hidden @md:inline text-mizume-fourthary-foreground">Edit</span>
        <Switch checked={edit} onChange={setEdit} onColor="#a79101" offColor="#454545" checkedIcon={false} uncheckedIcon={false} />


        <Button variant={`default`} className="w-10 h-10 rounded-md bg-btn-success text-btn-success-foreground hover:bg-btn-success-foreground disabled:bg-btn-success/50 " disabled={!edit} >
          <Save className="text-btn-success-foreground hover:text-btn-success" size={20} />
        </Button>
      </label>
    ),
  }, [build, section, lang, edit, isOwner])

  return (
    <>
      <Head title={post.title} />
      {edit ? (
        <MDEditor value={content} onChange={(val) => setContent(val ?? '')} data-color-mode="dark" height="auto" preview="edit"
          components={{ preview: (source) => <MarkdownRenderer content={source} /> }}
          commands={EDITOR_COMMANDS}
        />
      ) : (
        <PostSections postId={post.id} body={body} section={section} direction={direction} />
      )

      }

    </>
  )
}

WorkShowPost.layout = WorkShowLayout

export default WorkShowPost
