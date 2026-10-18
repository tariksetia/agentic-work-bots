"use server"

import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { bots } from "@/lib/db/schema"
import { getDesktopPreviewUrl } from "@/lib/daytona"

export async function getDesktopPreview(botId: string) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { ok: false as const, error: "You need to be signed in." }
  }

  if (!botId) {
    return { ok: false as const, error: "That bot could not be found." }
  }

  const owned = await db
    .select({ sandboxId: bots.sandboxId })
    .from(bots)
    .where(and(eq(bots.id, botId), eq(bots.userId, userId)))
    .limit(1)

  const sandboxId = owned[0]?.sandboxId

  if (!sandboxId) {
    return { ok: false as const, error: "This bot has no computer." }
  }

  try {
    const url = await getDesktopPreviewUrl(sandboxId)
    return { ok: true as const, url }
  } catch {
    return {
      ok: false as const,
      error: "The desktop could not be opened.",
    }
  }
}
