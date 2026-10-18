import { cn } from "cn"

import { ChatAvatar } from "@/components/chat-avatar"

const visibleLimit = 3

// Each slot is positioned in percent of the square, so the avatar keeps the
// footprint of a single ChatAvatar at any size.
const layouts = {
  2: ["top-1/5 left-0 size-3/5", "top-1/5 left-2/5 size-3/5"],
  3: [
    "top-0 left-1/4 size-1/2",
    "top-1/2 left-0 size-1/2",
    "top-1/2 left-1/2 size-1/2",
  ],
  4: [
    "top-0 left-0 size-1/2",
    "top-0 left-1/2 size-1/2",
    "top-1/2 left-0 size-1/2",
    "top-1/2 left-1/2 size-1/2",
  ],
} as const

export function GroupChatAvatar({
  seeds,
  className,
}: {
  seeds: string[]
  className?: string
}) {
  if (seeds.length <= 1) {
    return <ChatAvatar seed={seeds[0] ?? ""} className={className} />
  }

  const visible = seeds.slice(0, visibleLimit)
  const rest = seeds.length - visible.length
  const slots = layouts[rest > 0 ? 4 : (visible.length as 2 | 3)]

  return (
    <div
      aria-hidden
      className={cn("@container relative size-8 shrink-0", className)}
    >
      {visible.map((seed, index) => (
        <ChatAvatar
          key={`${seed}-${index}`}
          seed={seed}
          className={cn("absolute", slots[index])}
        />
      ))}
      {rest > 0 ? (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-muted text-[28cqw] leading-none font-medium text-muted-foreground tabular-nums",
            slots[3]
          )}
        >
          +{rest}
        </span>
      ) : null}
    </div>
  )
}
