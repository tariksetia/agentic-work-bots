import "server-only"

import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"

export async function getChat(chatId: string) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return null
  }

  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
    with: {
      members: {
        orderBy: (members, { asc }) => [asc(members.botId)],
        with: {
          bot: true,
        },
      },
    },
  })

  if (!chat || chat.members.length === 0) {
    return null
  }

  const bots = chat.members.map(({ bot }) => ({
    id: bot.id,
    name: bot.name,
    avatar: bot.avatar,
    job: bot.job,
    instructions: bot.instructions,
  }))

  return {
    id: chat.id,
    kind: chat.kind,
    title: chat.kind === "group" && chat.name ? chat.name : bots[0].name,
    bots,
  }
}

export type Chat = NonNullable<Awaited<ReturnType<typeof getChat>>>
