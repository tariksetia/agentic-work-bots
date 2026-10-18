import { amazonBedrock } from "@ai-sdk/amazon-bedrock"
import {
  chat,
  defaultStorage,
  type InferChatUIMessageFromTools,
} from "@trigger.dev/sdk/ai"
import { stepCountIs } from "ai"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { computerTools, type ComputerTools } from "@/trigger/tools"

export type ChatMessage = InferChatUIMessageFromTools<ComputerTools>

export const chatAgent = chat.withUIMessage<ChatMessage>().agent({
  id: "chat",
  storage: defaultStorage,
  uiMessageStreamOptions: {
    onError: () => "Something went wrong.",
  },
  tools: async ({ chatId }) => {
    const bot = await getChatBot(chatId)

    if (!bot?.sandboxId) {
      return {}
    }

    return computerTools(bot.sandboxId)
  },
  onTurnStart: async ({ chatId }) => {
    const bot = await getChatBot(chatId)

    if (!bot) {
      throw new Error("Chat not found")
    }

    chat.prompt.set(baseInstructions(bot))
  },
  run: async ({ messages, tools, signal, streamText }) => {
    return streamText({
      model: amazonBedrock("us.anthropic.claude-sonnet-5-5"),
      messages,
      tools,
      abortSignal: signal,
      stopWhen: stepCountIs(24),
    })
  },
})

async function getChatBot(chatId: string) {
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

  return chat?.members[0]?.bot ?? null
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
        "The desktop is XFCE at 1024 by 768 pixels, with the origin at the top left.",
      ].join(" "),
      [
        "Use bash, readFile, writeFile, and listFiles for the shell and filesystem.",
        "Use the mouse and keyboard tools for the desktop.",
        "viewScreen is how you look at the desktop. Call it before the first click and after every action that can change the screen. The person you are talking with does not see viewScreen.",
        "showScreen is how you show the desktop to that person. Call it only when they ask what is on the screen or ask to see it.",
        "Do not claim you clicked, typed, read, or saw something unless a tool result says so.",
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
