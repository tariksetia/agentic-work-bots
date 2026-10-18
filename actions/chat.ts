"use server"

import { auth } from "@clerk/nextjs/server"
import { auth as triggerAuth } from "@trigger.dev/sdk"
import {
  chat,
  defaultStorage,
  type ChatStartSessionParams,
} from "@trigger.dev/sdk/ai"

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
