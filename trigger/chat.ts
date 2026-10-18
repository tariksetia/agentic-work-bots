import { amazonBedrock } from "@ai-sdk/amazon-bedrock"
import { chat, defaultStorage } from "@trigger.dev/sdk/ai"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"

export const chatAgent = chat.agent({
  id: "chat",
  storage: defaultStorage,
  uiMessageStreamOptions: {
    onError: () => "Something went wrong.",
  },
  run: async ({ chatId, messages, signal, streamText }) => {
    const instructions = await getChatInstructions(chatId)

    if (!instructions) {
      throw new Error("Chat not found")
    }

    return streamText({
      model: amazonBedrock("us.deepseek.r1-v1:0"),
      instructions,
      messages,
      abortSignal: signal,
    })
  },
})

async function getChatInstructions(chatId: string) {
  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
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

  if (!bot) {
    return null
  }

  return [`You are ${bot.name}. Your job is ${bot.job}.`, bot.instructions]
    .filter(Boolean)
    .join("\n\n")
}
