import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import { ChatHeader } from "@/components/chat-header"
import { ChatThread } from "@/components/chat-thread"
import { getChat } from "@/queries/chats"

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
    <div className="flex h-svh min-h-0 flex-col">
      <ChatHeader bot={chat.bot} />
      <ChatThread key={chat.id} chatId={chat.id} botName={chat.bot.name} />
    </div>
  )
}
