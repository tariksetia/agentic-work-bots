import { amazonBedrock } from "@ai-sdk/amazon-bedrock"
import { chat, defaultStorage } from "@trigger.dev/sdk/ai"
import {
  stepCountIs,
  type InferUITools,
  type UIDataTypes,
  type UIMessage,
} from "ai"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import { computerTools, type ComputerTools } from "@/trigger/tools"

export type ChatMessageMetadata = {
  botId?: string
}

export type ChatMessage = UIMessage<
  ChatMessageMetadata,
  UIDataTypes,
  InferUITools<ComputerTools>
>

export const chatAgent = chat.withUIMessage<ChatMessage>().agent({
  id: "chat",
  storage: defaultStorage,
  // Group chats send the bot the user picked for this turn. A run boots
  // without client data when the session starts before the first message.
  clientDataSchema: z
    .object({
      botId: z.string().optional(),
    })
    .optional(),
  uiMessageStreamOptions: {
    onError: () => "Something went wrong.",
  },
  tools: async ({ chatId, clientData }) => {
    const { bot } = await getChatBot(chatId, clientData?.botId)

    if (!bot?.sandboxId) {
      return {}
    }

    return computerTools(bot.sandboxId)
  },
  onTurnStart: async ({ chatId, clientData }) => {
    const { bot, group } = await getChatBot(chatId, clientData?.botId)

    if (!bot) {
      throw new Error("Chat not found")
    }

    chat.prompt.set(baseInstructions(bot, group))
    // Saved with the reply, so the UI knows which bot wrote it after a reload.
    chat.setUIMessageStreamOptions({
      messageMetadata: () => ({ botId: bot.id }),
    })
  },
  run: async ({ messages, tools, signal, streamText }) => {
    const modelId = process.env.BEDROCK_MODEL_ID

    if (!modelId) {
      throw new Error("BEDROCK_MODEL_ID is not set")
    }

    return streamText({
      model: amazonBedrock(modelId),
      messages,
      tools,
      abortSignal: signal,
      stopWhen: stepCountIs(24),
    })
  },
})

async function getChatBot(chatId: string, botId?: string) {
  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
    with: {
      members: {
        orderBy: (members, { asc }) => [asc(members.botId)],
        with: {
          bot: true,
        },
      },
    },
  })

  const members = chat?.members ?? []
  // Only a member of this chat can answer, whatever the client sent.
  const bot =
    members.find((member) => member.botId === botId)?.bot ??
    members[0]?.bot ??
    null

  if (chat?.kind !== "group") {
    return { bot, group: null }
  }

  return {
    bot,
    group: {
      name: chat.name,
      others: members
        .filter((member) => member.bot.id !== bot?.id)
        .map((member) => member.bot.name),
    },
  }
}

function baseInstructions(
  bot: {
    name: string
    job: string
    instructions: string | null
    sandboxId: string | null
  },
  group: { name: string | null; others: string[] } | null
) {
  const parts = [
    [
      `You are ${bot.name}, an AI agent built on Bot Works.`,
      `Your job: ${bot.job}.`,
      "Your purpose is to do that job well for the person you are talking with. Stay focused on it, answer plainly, and say so when something is outside your job or you are unsure.",
    ].join(" "),
  ]

  if (group) {
    parts.push(
      [
        `You are in a group chat${group.name ? ` named ${group.name}` : ""} with ${group.others.join(", ")}.`,
        "The person picks which bot answers each message. Earlier assistant replies may have come from the other bots, so do not assume you wrote them.",
      ].join(" ")
    )
  }

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
