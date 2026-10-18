"use client"

import { UserButton } from "@clerk/nextjs"
import { formatDistanceToNow } from "date-fns"
import { PlusIcon, SearchIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { BotDialog } from "@/components/bot-dialog"
import { GroupChatAvatar } from "@/components/group-chat-avatar"
import { GroupChatDialog } from "@/components/group-chat-dialog"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { BotListItem, ChatListItem } from "@/queries/bots"

export function AppSidebar({
  bots,
  chats,
}: {
  bots: BotListItem[]
  chats: ChatListItem[]
}) {
  const router = useRouter()
  const { chatId } = useParams<{ chatId?: string }>()
  const [botOpen, setBotOpen] = useState(false)
  const [groupOpen, setGroupOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() !== "k" ||
        !(event.metaKey || event.ctrlKey)
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      setSearchOpen((open) => !open)
    }

    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:min-w-0 group-data-[collapsible=icon]:overflow-hidden">
        <div className="flex justify-end group-data-[collapsible=icon]:justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" />}
            >
              <PlusIcon data-icon="inline-start" />
              <span className="sr-only">Create</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    window.setTimeout(() => setBotOpen(true), 0)
                  }}
                >
                  <PlusIcon />
                  Create new bot
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    window.setTimeout(() => setGroupOpen(true), 0)
                  }}
                >
                  <UsersIcon />
                  Create group chat
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          className="h-8 w-full max-w-full min-w-0 justify-start overflow-hidden rounded-lg border border-input bg-transparent px-2.5 py-1 text-base font-normal text-muted-foreground transition-colors outline-none group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:max-w-8! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:self-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0! hover:text-primary-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:group-data-[collapsible=icon]:bg-transparent dark:hover:bg-primary/80 dark:disabled:bg-input/80"
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon data-icon="inline-start" />
          <span className="group-data-[collapsible=icon]:hidden">Search</span>
          <Kbd className="ml-auto group-data-[collapsible=icon]:hidden">⌘K</Kbd>
        </Button>
      </SidebarHeader>
      <BotDialog open={botOpen} onOpenChange={setBotOpen} />
      <GroupChatDialog
        bots={bots}
        open={groupOpen}
        onOpenChange={setGroupOpen}
      />
      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Search chats"
        description="Search your chats"
        className="sm:max-w-lg"
      >
        <Command>
          <CommandInput placeholder="Search chats..." />
          <CommandList>
            <CommandEmpty>No chats found.</CommandEmpty>
            <CommandGroup>
              {chats.map((chat) => (
                <CommandItem
                  key={chat.id}
                  value={`${chat.title} ${chat.lastMessagePreview ?? ""}`}
                  onSelect={() => {
                    setSearchOpen(false)
                    router.push(`/chats/${chat.id}`)
                  }}
                >
                  <GroupChatAvatar
                    seeds={chat.bots.map((bot) => bot.avatar)}
                    className="shrink-0"
                  />
                  <div className="grid min-w-0 flex-1 leading-tight">
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {chat.title}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(chat.lastMessageAt)}
                      </span>
                    </span>
                    {chat.lastMessagePreview ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {chat.lastMessagePreview}
                      </span>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:gap-2">
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    size="lg"
                    isActive={chat.id === chatId}
                    className="h-auto group-data-[collapsible=icon]:justify-center"
                    tooltip={chat.title}
                    render={<Link href={`/chats/${chat.id}`} />}
                  >
                    <GroupChatAvatar
                      seeds={chat.bots.map((bot) => bot.avatar)}
                      className="shrink-0"
                    />
                    <div className="grid min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="flex min-w-0 items-baseline gap-2">
                        <span className="min-w-0 flex-1 truncate font-medium">
                          {chat.title}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDistanceToNow(chat.lastMessageAt)}
                        </span>
                      </span>
                      {chat.lastMessagePreview ? (
                        <span className="truncate text-xs text-muted-foreground">
                          {chat.lastMessagePreview}
                        </span>
                      ) : null}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<div />}
              className="items-stretch p-0 group-data-[collapsible=icon]:justify-center focus-within:ring-2"
            >
              <UserButton
                showName
                appearance={{
                  elements: {
                    rootBox: {
                      display: "flex",
                      width: "100%",
                      height: "100%",
                    },
                    userButtonTrigger: {
                      width: "100%",
                      height: "100%",
                      padding: 0,
                      borderRadius: 0,
                      backgroundColor: "transparent",
                      color: "inherit",
                      justifyContent: "flex-start",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      "&:focus-visible": {
                        outline: "none",
                        boxShadow: "none",
                      },
                    },
                    userButtonBox: {
                      width: "100%",
                      height: "100%",
                      minWidth: 0,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "0.5rem",
                      padding: "0.5rem",
                      "[data-collapsible=icon] &": {
                        padding: "0",
                        justifyContent: "center",
                        gap: "0",
                      },
                    },
                    userButtonBox__open: {
                      backgroundColor: "var(--sidebar-accent)",
                      color: "var(--sidebar-accent-foreground)",
                    },
                    userButtonAvatarBox: {
                      order: -1,
                      width: "1.5rem",
                      height: "1.5rem",
                      "[data-collapsible=icon] &": {
                        width: "1.25rem",
                        height: "1.25rem",
                      },
                    },
                    userButtonOuterIdentifier: {
                      padding: 0,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      lineHeight: "1.25rem",
                      color: "inherit",
                      "[data-collapsible=icon] &": {
                        display: "none",
                      },
                    },
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
