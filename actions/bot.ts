"use server"

import { auth } from "@clerk/nextjs/server"
import { and, eq, inArray } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"
import { redirect, RedirectType } from "next/navigation"

import { db } from "@/lib/db"
import { bots, chatMembers, chats, insertBotSchema } from "@/lib/db/schema"
import { createSandbox, deleteSandbox } from "@/lib/daytona"

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

  let sandboxId: string

  try {
    sandboxId = await createSandbox(botId)
  } catch {
    return {
      ok: false as const,
      error: "The sandbox could not be created.",
    }
  }

  try {
    await db.batch([
      db.insert(bots).values({
        id: botId,
        ...parsed.data,
        userId,
        sandboxId,
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
  } catch (error) {
    try {
      await deleteSandbox(sandboxId)
    } catch {
      // Keep the insert error.
    }

    throw error
  }

  revalidatePath("/", "layout")

  return { ok: true as const, id: botId, chatId }
}

export async function updateBot(botId: string, input: unknown) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { ok: false as const, error: "You need to be signed in." }
  }

  if (!botId) {
    return { ok: false as const, error: "That bot could not be found." }
  }

  const parsed = insertBotSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    }
  }

  const updated = await db
    .update(bots)
    .set({
      ...parsed.data,
      instructions: parsed.data.instructions || null,
    })
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    .returning({ id: bots.id })

  if (updated.length === 0) {
    return { ok: false as const, error: "That bot could not be found." }
  }

  revalidatePath("/", "layout")

  return { ok: true as const, id: botId }
}

export async function deleteBot(botId: string) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { ok: false as const, error: "You need to be signed in." }
  }

  if (!botId) {
    return { ok: false as const, error: "That bot could not be found." }
  }

  const owned = await db
    .select({ id: bots.id, sandboxId: bots.sandboxId })
    .from(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    .limit(1)

  if (owned.length === 0) {
    return { ok: false as const, error: "That bot could not be found." }
  }

  if (owned[0].sandboxId) {
    try {
      await deleteSandbox(owned[0].sandboxId)
    } catch {
      return {
        ok: false as const,
        error: "The sandbox could not be deleted.",
      }
    }
  }

  const memberships = await db
    .select({ chatId: chatMembers.chatId })
    .from(chatMembers)
    .innerJoin(chats, eq(chats.id, chatMembers.chatId))
    .where(
      and(
        eq(chatMembers.botId, botId),
        eq(chats.userId, userId),
        eq(chats.kind, "direct")
      )
    )

  const chatIds = memberships.map((membership) => membership.chatId)
  const deleteBotRow = db
    .delete(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))

  if (chatIds.length > 0) {
    await db.batch([
      db
        .delete(chats)
        .where(and(eq(chats.userId, userId), inArray(chats.id, chatIds))),
      deleteBotRow,
    ])
  } else {
    await deleteBotRow
  }

  revalidatePath("/", "layout")
  redirect("/", RedirectType.replace)
}
