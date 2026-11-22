import { BlogLayout } from "@/layouts/app"
import { Route } from "@/types"

function RequestRole() {

  const routes : Route []  = [
    {
        label:"Forms",
        url: route("forms.request"),
    }
  ]

  return (
    <BlogLayout routes={routes}>

    </BlogLayout>
  )
}

export default RequestRole