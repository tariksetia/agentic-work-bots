"use client"

import { useChat } from "@ai-sdk/react"
import { MessageSquareIcon } from "lucide-react"
import { useState } from "react"

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

export function ChatThread({
  chatId,
  botName,
}: {
  chatId: string
  botName: string
}) {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, stop, error } = useChat({
    id: chatId,
  })

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
