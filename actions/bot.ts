"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { bots, insertBotSchema } from "@/lib/db/schema"

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

  const [bot] = await db
    .insert(bots)
    .values({
      ...parsed.data,
      userId,
      instructions: parsed.data.instructions || null,
    })
    .returning({ id: bots.id })

  revalidatePath("/")

  return { ok: true as const, id: bot.id }
}
