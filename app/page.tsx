import { auth } from "@clerk/nextjs/server"
import { PlusIcon } from "lucide-react"

import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default async function Page() {
  await auth.protect()

  return (
    <Empty className="min-h-[calc(100svh-3.5rem)]">
      <EmptyHeader>
        <ChatAvatar seed={crypto.randomUUID()} />
        <EmptyTitle className="text-base">Meet your first bot</EmptyTitle>
        <EmptyDescription className="text-wrap">
          Every bot gets its own personality, memory, and face. Spin one up and
          start the conversation.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="secondary" size="lg">
          <PlusIcon data-icon="inline-start" />
          Create a new bot
        </Button>
      </EmptyContent>
    </Empty>
  )
}
