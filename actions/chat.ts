"use server"

import { auth } from "@clerk/nextjs/server"
import { auth as triggerAuth } from "@trigger.dev/sdk"
import {
  chat,
  defaultStorage,
  type ChatStartSessionParams,
} from "@trigger.dev/sdk/ai"
import { and, eq, inArray } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import {
  bots,
  chatMembers,
  chats,
  insertGroupChatSchema,
} from "@/lib/db/schema"
import { getChat } from "@/queries/chats"
import type { chatAgent } from "@/trigger/chat"

const startSession = chat.createStartSessionAction<typeof chatAgent>("chat")
const readTranscript = chat.createLoadTranscriptAction(defaultStorage)

async function requireOwnedChat(chatId: string) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    throw new Error("Unauthorized")
  }

  const owned = await getChat(chatId)

  if (!owned) {
    throw new Error("Not found")
  }
}

export async function startChatSession(
  params: ChatStartSessionParams<typeof chatAgent>
) {
  await requireOwnedChat(params.chatId)
  return startSession(params)
}

export async function mintChatAccessToken(chatId: string) {
  await requireOwnedChat(chatId)

  return triggerAuth.createPublicToken({
    scopes: {
      read: { sessions: chatId },
      write: { sessions: chatId },
    },
    expirationTime: "1h",
  })
}

export async function loadChatTranscript(params: {
  chatId: string
  limit?: number
  before?: string
}) {
  await requireOwnedChat(params.chatId)
  return readTranscript(params)
}

export async function createGroupChat(input: unknown) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return { ok: false as const, error: "You need to be signed in." }
  }

  const parsed = insertGroupChatSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    }
  }

  const botIds = [...new Set(parsed.data.botIds)]
  const owned = await db
    .select({ id: bots.id })
    .from(bots)
    .where(and(eq(bots.userId, userId), inArray(bots.id, botIds)))

  if (owned.length !== botIds.length) {
    return {
      ok: false as const,
      error: "Some of those bots could not be found.",
    }
  }

  const chatId = nanoid()

  await db.batch([
    db.insert(chats).values({
      id: chatId,
      userId,
      kind: "group",
      name: parsed.data.name,
    }),
    db.insert(chatMembers).values(botIds.map((botId) => ({ chatId, botId }))),
  ])

  revalidatePath("/", "layout")

  return { ok: true as const, chatId }
}
