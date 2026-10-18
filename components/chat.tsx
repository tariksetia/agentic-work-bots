"use client"

import { useChat } from "@ai-sdk/react"
import {
  useLoadTranscript,
  useTriggerChatTransport,
} from "@trigger.dev/sdk/chat/react"
import type { UIMessage } from "ai"
import { MessageSquareIcon } from "lucide-react"
import { useCallback, useState } from "react"

import {
  loadChatTranscript,
  mintChatAccessToken,
  startChatSession,
} from "@/actions/chat"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import { Spinner } from "@/components/ui/spinner"
import type { chatAgent } from "@/trigger/chat"

export function Chat({ chatId, botName }: { chatId: string; botName: string }) {
  const transport = useTriggerChatTransport<typeof chatAgent>({
    task: "chat",
    accessToken: ({ chatId }) => mintChatAccessToken(chatId),
    startSession: ({ chatId }) => startChatSession({ chatId }),
  })
  const transcript = useLoadTranscript(chatId, loadChatTranscript, {
    transport,
  })

  if (transcript.isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (transcript.error) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <p className="text-sm text-destructive">Something went wrong.</p>
      </div>
    )
  }

  return (
    <ChatSession
      botName={botName}
      chatId={chatId}
      initialMessages={transcript.messages}
      transport={transport}
    />
  )
}

function ChatSession({
  chatId,
  botName,
  initialMessages,
  transport,
}: {
  chatId: string
  botName: string
  initialMessages: UIMessage[]
  transport: ReturnType<typeof useTriggerChatTransport<typeof chatAgent>>
}) {
  const [input, setInput] = useState("")
  const {
    messages,
    sendMessage,
    status,
    stop: stopChat,
    error,
  } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
    resume: initialMessages.length > 0,
  })
  const stop = useCallback(() => {
    stopChat()
    void transport.stopGeneration(chatId)
  }, [chatId, stopChat, transport])

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) {
      return
    }

    sendMessage({ text: message.text })
    setInput("")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation>
        <ConversationContent
          className={messages.length === 0 ? "h-full" : undefined}
        >
          {messages.length === 0 ? (
            <ConversationEmptyState
              className="h-full"
              icon={<MessageSquareIcon className="size-6" />}
              title={`Message ${botName}`}
              description="Type a message below to begin chatting"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, index) => {
                    if (part.type !== "text") {
                      return null
                    }

                    return (
                      <MessageResponse key={`${message.id}-${index}`}>
                        {part.text}
                      </MessageResponse>
                    )
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="px-4 pb-4">
        {error ? (
          <p className="mb-2 text-sm text-destructive">Something went wrong.</p>
        ) : null}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={input}
            placeholder={`Message ${botName}`}
            onChange={(event) => setInput(event.currentTarget.value)}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={
                !input.trim() &&
                status !== "submitted" &&
                status !== "streaming"
              }
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
