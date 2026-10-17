"use client"

import { UserButton } from "@clerk/nextjs"
import { PlusIcon, UsersIcon } from "lucide-react"
import { useState } from "react"

import { BotDialog } from "@/components/bot-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const [botOpen, setBotOpen] = useState(false)

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-end">
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
                <DropdownMenuItem>
                  <UsersIcon />
                  Create group chat
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>
      <BotDialog open={botOpen} onOpenChange={setBotOpen} />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<div />}
              className="items-stretch p-0 focus-within:ring-2"
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
                    },
                    userButtonBox__open: {
                      backgroundColor: "var(--sidebar-accent)",
                      color: "var(--sidebar-accent-foreground)",
                    },
                    userButtonAvatarBox: {
                      order: -1,
                      width: "1.5rem",
                      height: "1.5rem",
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
                    },
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
