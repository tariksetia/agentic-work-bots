"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import { usePanelRef, type PanelImperativeHandle } from "react-resizable-panels"

import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"

type DesktopPanelContextValue = {
  open: boolean
  panelRef: RefObject<PanelImperativeHandle | null>
  setOpen: (open: boolean) => void
  toggle: () => void
}

const DesktopPanelContext = createContext<DesktopPanelContextValue | null>(null)

export function DesktopPanelProvider({ children }: { children: ReactNode }) {
  const panelRef = usePanelRef()
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => {
    const panel = panelRef.current

    if (!panel) {
      return
    }

    if (panel.isCollapsed() || panel.getSize().asPercentage <= 0) {
      panel.expand()

      if (panel.getSize().asPercentage < 1) {
        panel.resize("32%")
      }

      setOpen(true)
      return
    }

    panel.collapse()
    setOpen(false)
  }, [panelRef])

  const value = useMemo(
    () => ({ open, panelRef, setOpen, toggle }),
    [open, panelRef, toggle]
  )

  return (
    <DesktopPanelContext.Provider value={value}>
      {children}
    </DesktopPanelContext.Provider>
  )
}

export function useDesktopPanel() {
  const context = useContext(DesktopPanelContext)

  if (!context) {
    throw new Error("useDesktopPanel must be used within DesktopPanelProvider")
  }

  return context
}

export function DesktopPanel() {
  const { open, panelRef, setOpen } = useDesktopPanel()

  return (
    <>
      <ResizableHandle withHandle={open} />
      <ResizablePanel
        aria-label="Desktop"
        collapsedSize="0%"
        collapsible
        defaultSize="0%"
        id="desktop"
        maxSize="50%"
        minSize="32%"
        onResize={(size) => {
          setOpen(size.asPercentage > 0)
        }}
        panelRef={panelRef}
      />
    </>
  )
}
