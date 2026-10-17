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
        limit: 1,
        orderBy: (members, { asc }) => [asc(members.botId)],
        with: {
          bot: true,
        },
      },
    },
  })

  const bot = chat?.members[0]?.bot

  if (!chat || !bot) {
    return null
  }

  return {
    id: chat.id,
    lastMessageAt: chat.lastMessageAt,
    bot: {
      name: bot.name,
      avatar: bot.avatar,
    },
  }
}

export type Chat = NonNullable<Awaited<ReturnType<typeof getChat>>>
