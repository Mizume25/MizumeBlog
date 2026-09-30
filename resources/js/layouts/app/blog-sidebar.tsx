import { SidebarMenu, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "lucide-react"

function BlogSidebar() {
  return (
    <SidebarProvider className="lg:hidden">
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem>Item 1</SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  )
}

export default BlogSidebar