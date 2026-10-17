import "server-only"

import { auth } from "@clerk/nextjs/server"
import { desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"

export async function getChats() {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return []
  }

  const rows = await db.query.chats.findMany({
    where: eq(chats.userId, userId),
    orderBy: [desc(chats.lastMessageAt)],
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

  return rows.flatMap((chat) => {
    const bot = chat.members[0]?.bot

    if (!bot) {
      return []
    }

    return [
      {
        id: chat.id,
        lastMessagePreview: chat.lastMessagePreview,
        lastMessageAt: chat.lastMessageAt.toISOString(),
        bot: {
          name: bot.name,
          avatar: bot.avatar,
        },
      },
    ]
  })
}

export type ChatListItem = Awaited<ReturnType<typeof getChats>>[number]
