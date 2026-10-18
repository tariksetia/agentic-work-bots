import { amazonBedrock } from "@ai-sdk/amazon-bedrock"
import { auth } from "@clerk/nextjs/server"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"

import { getChat } from "@/queries/chats"

export const maxDuration = 30

export async function POST(req: Request) {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { id, messages }: { id: string; messages: UIMessage[] } =
    await req.json()

  if (typeof id !== "string" || !Array.isArray(messages)) {
    return new Response("Bad request", { status: 400 })
  }

  const chat = await getChat(id)

  if (!chat) {
    return new Response("Not found", { status: 404 })
  }

  const instructions = [
    `You are ${chat.bot.name}. Your job is ${chat.bot.job}.`,
    chat.bot.instructions,
  ]
    .filter(Boolean)
    .join("\n\n")

  const result = streamText({
    model: amazonBedrock("us.deepseek.r1-v1:0"),
    instructions,
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
