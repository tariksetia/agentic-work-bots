import "server-only"

import { auth } from "@clerk/nextjs/server"
import { asc, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { bots, chats } from "@/lib/db/schema"

export async function getBots() {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return []
  }

  return db
    .select({ id: bots.id, name: bots.name, avatar: bots.avatar })
    .from(bots)
    .where(eq(bots.userId, userId))
    .orderBy(asc(bots.createdAt))
}

export type BotListItem = Awaited<ReturnType<typeof getBots>>[number]

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
        orderBy: (members, { asc }) => [asc(members.botId)],
        with: {
          bot: true,
        },
      },
    },
  })

  return rows.flatMap((chat) => {
    const members = chat.members.map((member) => ({
      name: member.bot.name,
      avatar: member.bot.avatar,
    }))

    if (members.length === 0) {
      return []
    }

    return [
      {
        id: chat.id,
        kind: chat.kind,
        title: chat.kind === "group" && chat.name ? chat.name : members[0].name,
        lastMessagePreview: chat.lastMessagePreview,
        lastMessageAt: chat.lastMessageAt.toISOString(),
        bots: members,
      },
    ]
  })
}

export type ChatListItem = Awaited<ReturnType<typeof getChats>>[number]
