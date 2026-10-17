"use server"

import { auth } from "@clerk/nextjs/server"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { bots, chatMembers, chats, insertBotSchema } from "@/lib/db/schema"

export async function createBot(input: unknown) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { ok: false as const, error: "You need to be signed in." }
  }

  const parsed = insertBotSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    }
  }

  const botId = nanoid()
  const chatId = nanoid()

  await db.batch([
    db.insert(bots).values({
      id: botId,
      ...parsed.data,
      userId,
      instructions: parsed.data.instructions || null,
    }),
    db.insert(chats).values({
      id: chatId,
      userId,
      kind: "direct",
    }),
    db.insert(chatMembers).values({
      chatId,
      botId,
    }),
  ])

  revalidatePath("/")

  return { ok: true as const, id: botId, chatId }
}
