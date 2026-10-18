"use client"

import { MonitorIcon } from "lucide-react"

import { BotDialog, type BotDialogBot } from "@/components/bot-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import { useDesktopPanel } from "@/components/desktop-panel"
import { GroupChatAvatar } from "@/components/group-chat-avatar"
import { Button } from "@/components/ui/button"

export function ChatHeader({ bot }: { bot: BotDialogBot }) {
  const { open, toggle } = useDesktopPanel()

  return (
    <header className="flex items-center gap-3 border-b px-4 py-2.5">
      <BotDialog
        key={bot.id}
        bot={bot}
        trigger={
          <Button
            type="button"
            variant="ghost"
            aria-label={`Edit ${bot.name}`}
            className="-ml-2 h-auto w-fit max-w-full min-w-0 shrink justify-start gap-3 px-2 py-1 font-normal"
          >
            <ChatAvatar seed={bot.avatar} className="rounded-md" />
            <span className="truncate text-sm font-medium">{bot.name}</span>
          </Button>
        }
      />
      <Button
        variant="outline"
        size="icon"
        type="button"
        className="ml-auto"
        aria-controls="desktop"
        aria-expanded={open}
        aria-pressed={open}
        onClick={toggle}
      >
        <MonitorIcon />
        <span className="sr-only">Desktop</span>
      </Button>
    </header>
  )
}

export function GroupChatHeader({
  title,
  bots,
}: {
  title: string
  bots: { avatar: string }[]
}) {
  return (
    <header className="flex items-center gap-3 border-b px-4 py-2.5">
      <div className="flex h-9 min-w-0 items-center gap-3">
        <GroupChatAvatar seeds={bots.map((bot) => bot.avatar)} />
        <span className="truncate text-sm font-medium">{title}</span>
      </div>
    </header>
  )
}
