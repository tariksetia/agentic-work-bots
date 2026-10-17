import { UserButton } from "@clerk/nextjs"

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
  return (
    <Sidebar>
      <SidebarHeader />
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
