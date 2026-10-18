import { amazonBedrock } from "@ai-sdk/amazon-bedrock"
import { chat, defaultStorage } from "@trigger.dev/sdk/ai"
import {
  stepCountIs,
  type InferUITools,
  type StopCondition,
  type ToolSet,
  type UIDataTypes,
  type UIMessage,
} from "ai"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema"
import {
  computerTools,
  groupTools,
  type ComputerTools,
  type GroupTools,
} from "@/trigger/tools"

export type ChatMessageMetadata = {
  botId?: string
}

export type ChatMessage = UIMessage<
  ChatMessageMetadata,
  UIDataTypes,
  InferUITools<ComputerTools & GroupTools>
>

export const chatAgent = chat.withUIMessage<ChatMessage>().agent({
  id: "chat",
  storage: defaultStorage,
  // Group chats send the bot the user picked for this turn, and after a
  // handoff the bot that passed the message on. A run boots without client
  // data when the session starts before the first message.
  clientDataSchema: z
    .object({
      botId: z.string().optional(),
      handoffFrom: z.string().optional(),
    })
    .optional(),
  // The client sends this after a handoff, so the target bot answers the same
  // message in a turn of its own.
  actionSchema: z.object({
    type: z.literal("handoff"),
  }),
  onAction: () => chat.turn(),
  uiMessageStreamOptions: {
    onError: () => "Something went wrong.",
  },
  tools: async ({ chatId, clientData }) => {
    const { bot, group } = await getChatBot(chatId, clientData)
    const tools: Partial<ComputerTools & GroupTools> = {}

    if (bot?.sandboxId) {
      Object.assign(tools, computerTools(bot.sandboxId))
    }

    if (group) {
      Object.assign(tools, groupTools(group.others, group.handoffFrom !== null))
    }

    return tools
  },
  onTurnStart: async ({ chatId, clientData }) => {
    const { bot, group } = await getChatBot(chatId, clientData)

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
      stopWhen: [stepCountIs(24), handedOff],
    })
  },
})

// A successful handoff ends the turn. A refused one lets the bot answer.
const handedOff: StopCondition<ToolSet> = ({ steps }) =>
  steps
    .at(-1)
    ?.toolResults.some(
      (result) =>
        result.toolName === "handoff" &&
        (result.output as { ok?: boolean } | undefined)?.ok === true
    ) ?? false

async function getChatBot(
  chatId: string,
  clientData?: { botId?: string; handoffFrom?: string }
) {
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
    members.find((member) => member.botId === clientData?.botId)?.bot ??
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
        .map((member) => ({
          id: member.bot.id,
          name: member.bot.name,
          job: member.bot.job,
        })),
      handoffFrom:
        members.find(
          (member) =>
            member.botId === clientData?.handoffFrom && member.botId !== bot?.id
        )?.bot.name ?? null,
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
  group: {
    name: string | null
    others: { id: string; name: string; job: string }[]
    handoffFrom: string | null
  } | null
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
        `You are in a group chat${group.name ? ` named ${group.name}` : ""} with one person and these other bots:`,
        ...group.others.map(
          (other) => `- ${other.name} (id ${other.id}), job: ${other.job}`
        ),
      ].join("\n"),
      [
        "The person picks which bot answers each message, and this time they picked you.",
        "Every assistant reply in the history was written by one of the bots, not necessarily by you, so do not claim earlier replies or tool results as your own.",
        "Each bot has its own private computer. Files, commands, and screens in another bot's tool results are on that bot's computer, not yours.",
        "Refer to the other bots by name when it helps the person.",
      ].join(" "),
      group.handoffFrom
        ? `${group.handoffFrom} handed the person's latest message to you because it fits your job better. Answer it yourself. You cannot hand it off again.`
        : [
            "If the latest message clearly fits another bot's job better than yours, call handoff with that bot's id and a short reason, after one sentence telling the person who you are handing it to.",
            "That bot then answers the same message. Do not answer it yourself as well.",
            "Do not hand off for small requests you can handle, and never hand off just because a bot is mentioned.",
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
