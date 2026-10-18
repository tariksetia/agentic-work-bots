"use client"

import { XIcon } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react"
import { createPortal } from "react-dom"
import { usePanelRef, type PanelImperativeHandle } from "react-resizable-panels"

import { getDesktopPreview } from "@/actions/desktop"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { Spinner } from "@/components/ui/spinner"

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

export function DesktopPanel({ botId }: { botId: string }) {
  const { open, panelRef, setOpen } = useDesktopPanel()

  return (
    <>
      <ResizableHandle withHandle={open} />
      <ResizablePanel
        aria-label="Desktop"
        className="relative min-h-0 overflow-hidden"
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
      >
        <DesktopPreview active={open} botId={botId} />
      </ResizablePanel>
    </>
  )
}

type FrameBox = {
  top: number
  left: number
  width: number
  height: number
}

const emptyBox: FrameBox = { top: 0, left: 0, width: 0, height: 0 }

function dockedStyle(box: FrameBox, zIndex: number): CSSProperties {
  return {
    position: "fixed",
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
    zIndex,
  }
}

const fullscreenStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100dvh",
  zIndex: 60,
}

function setFrameInteractive(frame: HTMLIFrameElement, interactive: boolean) {
  frame.inert = !interactive
  frame.tabIndex = interactive ? 0 : -1
  frame.style.pointerEvents = interactive ? "auto" : "none"

  if (interactive) {
    frame.focus()
  }
}

function DesktopPreview({ active, botId }: { active: boolean; botId: string }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)
  const panelSlotRef = useRef<HTMLDivElement | null>(null)
  const previewUrlRef = useRef<string | null>(null)
  const fullscreenRef = useRef(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [loadedBotId, setLoadedBotId] = useState(botId)
  const [panelBox, setPanelBox] = useState<FrameBox>(emptyBox)
  const [portalReady, setPortalReady] = useState(false)

  if (loadedBotId !== botId) {
    setLoadedBotId(botId)
    setPreviewUrl(null)
    setError(null)
    setLoading(false)
    setFullscreen(false)
  }

  fullscreenRef.current = fullscreen
  previewUrlRef.current = previewUrl

  const setPanelSlot = useCallback((node: HTMLDivElement | null) => {
    panelSlotRef.current = node
  }, [])

  const setHost = useCallback((node: HTMLDivElement | null) => {
    hostRef.current = node

    const frame = frameRef.current
    const url = previewUrlRef.current

    if (!node || !frame || !url || frame.parentElement === node) {
      return
    }

    node.appendChild(frame)

    if (!frame.src) {
      frame.src = url
    }
  }, [])

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useLayoutEffect(() => {
    const panel = panelSlotRef.current

    if (!panel) {
      return
    }

    const update = () => {
      const rect = panel.getBoundingClientRect()
      setPanelBox((current) => {
        if (
          current.top === rect.top &&
          current.left === rect.left &&
          current.width === rect.width &&
          current.height === rect.height
        ) {
          return current
        }

        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }
      })
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(panel)

    if (panel.parentElement) {
      observer.observe(panel.parentElement)
    }

    window.addEventListener("resize", update)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [active])

  useLayoutEffect(() => {
    const frame = frameRef.current

    if (!frame) {
      return
    }

    setFrameInteractive(frame, fullscreen)
  }, [fullscreen, previewUrl])

  useEffect(() => {
    if (!active || previewUrl) {
      return
    }

    let cancelled = false

    setLoading(true)
    setError(null)

    getDesktopPreview(botId)
      .then((result) => {
        if (cancelled) {
          return
        }

        setLoading(false)

        if (!result.ok) {
          setError(result.error)
          return
        }

        setPreviewUrl(result.url)
      })
      .catch(() => {
        if (cancelled) {
          return
        }

        setLoading(false)
        setError("The desktop could not be opened.")
      })

    return () => {
      cancelled = true
    }
  }, [active, attempt, botId, previewUrl])

  useEffect(() => {
    if (!previewUrl) {
      return
    }

    const iframe = document.createElement("iframe")
    iframe.title = "Desktop"
    iframe.allow = "clipboard-read; clipboard-write"
    iframe.referrerPolicy = "no-referrer"
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.border = "0"
    iframe.style.display = "block"
    iframe.style.background = "#000"
    frameRef.current = iframe
    setFrameInteractive(iframe, fullscreenRef.current)

    const host = hostRef.current

    if (host) {
      host.appendChild(iframe)
      iframe.src = previewUrl
    }

    return () => {
      iframe.remove()

      if (frameRef.current === iframe) {
        frameRef.current = null
      }
    }
  }, [previewUrl])

  function keepDesktopOpen(
    next: boolean,
    details: {
      reason: string
      event: Event
      cancel: () => void
    }
  ) {
    if (next) {
      setFullscreen(true)
      return
    }

    const clicked =
      details.reason === "close-press" &&
      details.event instanceof MouseEvent &&
      details.event.detail > 0

    if (!clicked) {
      details.cancel()
      return
    }

    setFullscreen(false)
  }

  function shieldDesktopInput(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target

    if (
      target instanceof Element &&
      target.closest("[data-slot='dialog-close']")
    ) {
      event.preventDefault()
    }

    event.stopPropagation()
    frameRef.current?.focus()
  }

  return (
    <div className="relative h-full min-h-0">
      <div ref={setPanelSlot} className="absolute inset-0" />
      {loading && !previewUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Spinner />
        </div>
      )}
      {error && !previewUrl && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </Button>
        </div>
      )}
      {fullscreen && (
        <div className="absolute inset-0 flex items-center justify-center bg-background p-6 text-center text-sm text-muted-foreground">
          Desktop is open
        </div>
      )}
      <Dialog
        disablePointerDismissal
        modal={false}
        open={fullscreen}
        onOpenChange={keepDesktopOpen}
      >
        <DialogContent
          showCloseButton={false}
          initialFocus={false}
          finalFocus={false}
          onKeyDownCapture={shieldDesktopInput}
          className="pointer-events-none top-0 left-0 h-svh w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none bg-transparent p-0 ring-0 sm:max-w-none"
        >
          <DialogTitle className="sr-only">Desktop</DialogTitle>
          <DialogDescription className="sr-only">
            The bot&apos;s computer. Pointer and keyboard input stays in the
            desktop.
          </DialogDescription>
        </DialogContent>
        {portalReady &&
          previewUrl &&
          createPortal(
            <>
              <div
                ref={setHost}
                className="overflow-hidden bg-black"
                style={fullscreen ? fullscreenStyle : dockedStyle(panelBox, 20)}
              />
              {!fullscreen && panelBox.width > 1 && (
                <button
                  type="button"
                  aria-label="Open desktop"
                  className="cursor-zoom-in"
                  style={dockedStyle(panelBox, 21)}
                  onClick={() => setFullscreen(true)}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
                  >
                    <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
                      Click to expand
                    </span>
                  </span>
                </button>
              )}
              {fullscreen && (
                <DialogClose
                  onKeyDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  render={
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="fixed top-3 right-3 z-[70]"
                    />
                  }
                >
                  <XIcon />
                  <span className="sr-only">Close</span>
                </DialogClose>
              )}
            </>,
            document.body
          )}
      </Dialog>
    </div>
  )
}
