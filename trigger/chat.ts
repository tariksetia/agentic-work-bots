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
  onTurnStart: async ({ chatId }) => {
    const instructions = await getChatInstructions(chatId)

    if (!instructions) {
      throw new Error("Chat not found")
    }

    chat.prompt.set(instructions)
  },
  run: async ({ messages, signal, streamText }) => {
    return streamText({
      model: amazonBedrock("us.deepseek.r1-v1:0"),
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

  return baseInstructions(bot)
}

function baseInstructions(bot: {
  name: string
  job: string
  instructions: string | null
  sandboxId: string | null
}) {
  const parts = [
    [
      `You are ${bot.name}, an AI agent built on Bot Works.`,
      `Your job: ${bot.job}.`,
      "Your purpose is to do that job well for the person you are talking with. Stay focused on it, answer plainly, and say so when something is outside your job or you are unsure.",
    ].join(" "),
  ]

  if (bot.sandboxId) {
    parts.push(
      [
        "You live in your own private Daytona sandbox, an isolated Linux computer that belongs only to you.",
        "It was created from Daytona's default snapshot, with 1 vCPU, 1 GiB of memory, and 3 GiB of disk.",
        "Python is its main language runtime, and Node.js is installed too.",
        "It has its own filesystem and network, and what is stored on it stays with you between conversations.",
      ].join(" ")
    )
  }

  if (bot.instructions) {
    parts.push(
      `The person who created you left these notes on how you should work:\n\n${bot.instructions}`
    )
  }

  return parts.join("\n\n")
}
