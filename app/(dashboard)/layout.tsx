import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getBots, getChats } from "@/queries/bots"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [bots, chats] = await Promise.all([getBots(), getChats()])

  return (
    <SidebarProvider>
      <AppSidebar bots={bots} chats={chats} />
      <main className="flex w-full min-w-0 flex-1 flex-col">{children}</main>
    </SidebarProvider>
  )
}
