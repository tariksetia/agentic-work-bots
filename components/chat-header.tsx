import { formatDistanceToNow } from "date-fns"
import { MonitorIcon } from "lucide-react"

import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"

export function ChatHeader({
  bot,
  lastMessageAt,
}: {
  bot: { name: string; avatar: string }
  lastMessageAt: Date
}) {
  return (
    <header className="flex items-center gap-3 border-b px-4 py-2.5">
      <ChatAvatar seed={bot.avatar} className="rounded-md" />
      <div className="grid min-w-0 flex-1 leading-tight">
        <span className="truncate text-sm font-medium">{bot.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {formatDistanceToNow(lastMessageAt)}
        </span>
      </div>
      <Button variant="outline" size="icon" type="button">
        <MonitorIcon />
        <span className="sr-only">Desktop</span>
      </Button>
    </header>
  )
}
