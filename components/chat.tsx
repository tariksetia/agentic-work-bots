"use client"

import { useChat } from "@ai-sdk/react"
import {
  useLoadTranscript,
  useTriggerChatTransport,
} from "@trigger.dev/sdk/chat/react"
import { getStaticToolName, isToolUIPart } from "ai"
import { MessageSquareIcon } from "lucide-react"
import { useCallback, useState, type ReactNode } from "react"

import {
  loadChatTranscript,
  mintChatAccessToken,
  startChatSession,
} from "@/actions/chat"
import { CodeBlock } from "@/components/ai-elements/code-block"
import { Image } from "@/components/ai-elements/image"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import { Terminal, TerminalContent } from "@/components/ai-elements/terminal"
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from "@/components/ai-elements/tool"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import { ChatAvatar } from "@/components/chat-avatar"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { ChatMessage, chatAgent } from "@/trigger/chat"

const emptyBytes = new Uint8Array()

type ChatPart = ChatMessage["parts"][number]
type ChatToolPart = Extract<ChatPart, { type: `tool-${string}` }>
type ChatBot = { id: string; name: string; avatar: string }

export function Chat({
  chatId,
  title,
  bots,
}: {
  chatId: string
  title: string
  bots: ChatBot[]
}) {
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
      bots={bots}
      chatId={chatId}
      title={title}
      initialMessages={transcript.messages as ChatMessage[]}
      transport={transport}
    />
  )
}

function ChatSession({
  chatId,
  title,
  bots,
  initialMessages,
  transport,
}: {
  chatId: string
  title: string
  bots: ChatBot[]
  initialMessages: ChatMessage[]
  transport: ReturnType<typeof useTriggerChatTransport<typeof chatAgent>>
}) {
  const [input, setInput] = useState("")
  const [botId, setBotId] = useState(bots[0].id)
  const bot = bots.find((item) => item.id === botId) ?? bots[0]
  const {
    messages,
    sendMessage,
    status,
    stop: stopChat,
    error,
  } = useChat<ChatMessage>({
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

    sendMessage({ text: message.text }, { metadata: { botId: bot.id } })
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
              title={`Message ${title}`}
              description="Type a message below to begin chatting"
            />
          ) : (
            messages.map((message) => {
              if (!message.parts.some(isVisiblePart)) {
                return null
              }

              const author =
                bots.length > 1 && message.role === "assistant"
                  ? bots.find((item) => item.id === message.metadata?.botId)
                  : undefined
              const content = (
                <MessageContent
                  className={cn(hasVisibleTool(message) && "w-full")}
                >
                  {message.parts.map((part, index) => (
                    <ChatPartView
                      key={partKey(message.id, part, index)}
                      part={part}
                    />
                  ))}
                </MessageContent>
              )

              if (!author) {
                return (
                  <Message from={message.role} key={message.id}>
                    {content}
                  </Message>
                )
              }

              return (
                <Message
                  from={message.role}
                  key={message.id}
                  className="flex-row items-start gap-3"
                >
                  <ChatAvatar
                    seed={author.avatar}
                    className="shrink-0 rounded-md"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {author.name}
                    </span>
                    {content}
                  </div>
                </Message>
              )
            })
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
            placeholder={`Message ${bot.name}`}
            onChange={(event) => setInput(event.currentTarget.value)}
          />
          <PromptInputFooter
            className={bots.length > 1 ? undefined : "justify-end"}
          >
            {bots.length > 1 ? (
              <PromptInputTools>
                <PromptInputSelect
                  items={bots.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  value={bot.id}
                  onValueChange={(value) => {
                    if (typeof value === "string") {
                      setBotId(value)
                    }
                  }}
                >
                  <PromptInputSelectTrigger aria-label="Bot">
                    <PromptInputSelectValue />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {bots.map((item) => (
                      <PromptInputSelectItem key={item.id} value={item.id}>
                        {item.name}
                      </PromptInputSelectItem>
                    ))}
                  </PromptInputSelectContent>
                </PromptInputSelect>
              </PromptInputTools>
            ) : null}
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

function ChatPartView({ part }: { part: ChatPart }) {
  if (part.type === "text") {
    if (!part.text) {
      return null
    }

    return <MessageResponse>{part.text}</MessageResponse>
  }

  if (!isToolUIPart(part) || part.type === "dynamic-tool") {
    return null
  }

  return <ChatTool part={part} />
}

function ChatTool({ part }: { part: ChatToolPart }) {
  const name = getStaticToolName(part)

  if (name === "viewScreen") {
    return null
  }

  const body = toolBody(part)

  return (
    <Tool className="mb-0 w-full" defaultOpen={name === "showScreen"}>
      <ToolHeader state={part.state} title={toolTitle(part)} type={part.type} />
      {body ? <ToolContent>{body}</ToolContent> : null}
    </Tool>
  )
}

function toolBody(part: ChatToolPart): ReactNode {
  if (part.state === "output-error") {
    return <ToolOutput errorText={part.errorText} output={undefined} />
  }

  if (part.state !== "output-available") {
    if (part.type !== "tool-bash") {
      return null
    }

    const command = textField(part.input, "command")

    return (
      <Terminal isStreaming output={command ? `$ ${command}` : ""}>
        <TerminalContent />
      </Terminal>
    )
  }

  if (!part.output.ok) {
    return <ToolOutput errorText={part.output.error} output={undefined} />
  }

  switch (part.type) {
    case "tool-bash": {
      const text = commandOutput(part.input, part.output.output)
      const output =
        part.output.exitCode !== 0 && !part.output.output.trim()
          ? `${text}\nexit ${part.output.exitCode}`
          : text

      return (
        <Terminal output={output}>
          <TerminalContent />
        </Terminal>
      )
    }
    case "tool-readFile":
      if (part.output.binary) {
        return (
          <p className="text-sm text-muted-foreground">
            Binary file, {part.output.bytes} bytes.
          </p>
        )
      }

      return <CodeBlock code={part.output.content} language="markdown" />
    case "tool-writeFile":
      return (
        <p className="text-sm text-muted-foreground">
          Wrote {part.output.bytes} bytes.
        </p>
      )
    case "tool-listFiles":
      if (part.output.entries.length === 0) {
        return <p className="text-sm text-muted-foreground">Empty directory.</p>
      }

      return (
        <ul className="flex flex-col gap-1 font-mono text-xs">
          {part.output.entries.map((entry) => (
            <li key={entry.path}>
              {entry.isDir ? `${entry.name}/` : entry.name}
            </li>
          ))}
          {part.output.truncated ? (
            <li className="text-muted-foreground">And more.</li>
          ) : null}
        </ul>
      )
    case "tool-showScreen":
      return (
        <Image
          alt="Desktop"
          base64={part.output.image}
          className="max-h-96 w-full object-contain"
          mediaType={part.output.mediaType}
          uint8Array={emptyBytes}
        />
      )
    default:
      return null
  }
}

function toolTitle(part: ChatToolPart) {
  switch (part.type) {
    case "tool-bash":
      return clipTitle(textField(part.input, "command") || "Bash")
    case "tool-readFile":
    case "tool-writeFile":
    case "tool-listFiles":
      return clipTitle(textField(part.input, "path") || label(part.type))
    case "tool-mouseClick":
      return pointTitle("Click", part.input)
    case "tool-mouseMove":
      return pointTitle("Move", part.input)
    case "tool-mouseScroll":
      return scrollTitle(part.input)
    case "tool-keyboardType":
      return clipTitle(textField(part.input, "text") || "Type")
    case "tool-keyboardPress":
      return clipTitle(textField(part.input, "key") || "Press key")
    case "tool-showScreen":
      return "Screen"
    default:
      return label(part.type)
  }
}

function label(type: ChatToolPart["type"]) {
  switch (type) {
    case "tool-bash":
      return "Bash"
    case "tool-readFile":
      return "Read file"
    case "tool-writeFile":
      return "Write file"
    case "tool-listFiles":
      return "List files"
    case "tool-mouseClick":
      return "Click"
    case "tool-mouseMove":
      return "Move"
    case "tool-mouseScroll":
      return "Scroll"
    case "tool-keyboardType":
      return "Type"
    case "tool-keyboardPress":
      return "Press key"
    case "tool-showScreen":
      return "Screen"
    default:
      return "Tool"
  }
}

function pointTitle(
  verb: string,
  input: { x?: number; y?: number } | undefined
) {
  if (typeof input?.x !== "number" || typeof input.y !== "number") {
    return verb
  }

  return `${verb} ${input.x}, ${input.y}`
}

function scrollTitle(input: { direction?: string } | undefined) {
  if (!input?.direction) {
    return "Scroll"
  }

  return `Scroll ${input.direction}`
}

function commandOutput(input: unknown, output: string) {
  const command = textField(input, "command")
  const body = output.trim()

  if (!command) {
    return body
  }

  return body ? `$ ${command}\n${body}` : `$ ${command}`
}

function textField(value: unknown, key: string) {
  if (!value || typeof value !== "object" || !(key in value)) {
    return ""
  }

  const field = (value as Record<string, unknown>)[key]
  return typeof field === "string" ? field : ""
}

function clipTitle(value: string) {
  if (value.length <= 80) {
    return value
  }

  return `${value.slice(0, 77)}...`
}

function isVisiblePart(part: ChatPart) {
  if (part.type === "text") {
    return part.text.length > 0
  }

  const name = staticToolName(part)
  return name !== null && name !== "viewScreen"
}

function hasVisibleTool(message: ChatMessage) {
  return message.parts.some((part) => {
    const name = staticToolName(part)
    return name !== null && name !== "viewScreen"
  })
}

function staticToolName(part: ChatPart) {
  if (!isToolUIPart(part) || part.type === "dynamic-tool") {
    return null
  }

  return getStaticToolName(part)
}

function partKey(messageId: string, part: ChatPart, index: number) {
  if (isToolUIPart(part)) {
    return part.toolCallId
  }

  return `${messageId}-${index}`
}
