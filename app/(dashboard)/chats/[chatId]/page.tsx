import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import { Chat } from "@/components/chat"
import { ChatHeader } from "@/components/chat-header"
import { DesktopPanel, DesktopPanelProvider } from "@/components/desktop-panel"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { getChat } from "@/queries/chats"

export const maxDuration = 180

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  await auth.protect()

  const { chatId } = await params
  const chat = await getChat(chatId)

  if (!chat) {
    notFound()
  }

  return (
    <DesktopPanelProvider>
      <div className="flex h-svh min-h-0 flex-col">
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1"
        >
          <ResizablePanel
            className="flex min-h-0 flex-col"
            defaultSize="100%"
            id="chat"
            minSize="50%"
            style={{ overflow: "hidden" }}
          >
            <ChatHeader bot={chat.bot} />
            <Chat key={chat.id} chatId={chat.id} botName={chat.bot.name} />
          </ResizablePanel>
          <DesktopPanel botId={chat.bot.id} />
        </ResizablePanelGroup>
      </div>
    </DesktopPanelProvider>
  )
}
