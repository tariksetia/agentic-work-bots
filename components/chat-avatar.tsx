import { Avatar, Style } from "@dicebear/core"
import definition from "@dicebear/styles/gaze.json" with { type: "json" }
import { cn } from "cn"
import Image from "next/image"

const style = new Style(definition)

export function ChatAvatar({
  seed,
  animated = false,
  className,
}: {
  seed: string
  animated?: boolean
  className?: string
}) {
  const avatar = new Avatar(style, {
    seed,
    size: 32,
    ...(animated ? { tags: ["animation"] } : {}),
  })

  return (
    <Image
      src={avatar.toDataUri()}
      alt=""
      width={32}
      height={32}
      unoptimized
      className={cn("size-8", className)}
    />
  )
}
