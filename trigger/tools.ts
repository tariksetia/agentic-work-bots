import { tool } from "ai"
import path from "node:path"
import { z } from "zod"

import { withDesktop, withSandbox } from "@/lib/sandbox"

const textLimit = 20_000
const listLimit = 200

const button = z.enum(["left", "right", "middle"])
const modifier = z.enum(["ctrl", "alt", "shift", "cmd"])
const direction = z.enum(["up", "down", "left", "right"])

type Failure = { ok: false; error: string }

type ScreenShot = {
  ok: true
  image: string
  mediaType: "image/jpeg"
  width: number | null
  height: number | null
}

export function computerTools(sandboxId: string) {
  return {
    bash: tool({
      description:
        "Run a shell command on your Linux computer. stdout and stderr are combined. Use this for files, packages, and processes. Long-running servers must be backgrounded with output redirected, for example `python3 -m http.server 8000 > server.log 2>&1 &`.",
      inputSchema: z.object({
        command: z.string().min(1).describe("The shell command to run."),
        cwd: z
          .string()
          .min(1)
          .optional()
          .describe(
            "Working directory. Relative paths start at the home directory."
          ),
        timeout: z
          .number()
          .int()
          .min(1)
          .max(120)
          .optional()
          .describe(
            "Seconds to wait before the command is stopped. Defaults to 30."
          ),
      }),
      execute: async ({ command, cwd, timeout }) =>
        catchTool(async () => {
          const response = await withSandbox(sandboxId, (sandbox) =>
            sandbox.process.executeCommand(
              `bash -c ${shellQuote(command)} 2>&1`,
              cwd,
              undefined,
              timeout ?? 30
            )
          )

          return {
            ok: true as const,
            exitCode: response.exitCode,
            output: clip(response.result ?? ""),
          }
        }),
    }),
    readFile: tool({
      description:
        "Read a text file on your computer. Relative paths start at the home directory.",
      inputSchema: z.object({
        path: z.string().min(1).describe("File path to read."),
      }),
      execute: async ({ path: filePath }) =>
        catchTool(async () => {
          const buffer = await withSandbox(sandboxId, (sandbox) =>
            sandbox.fs.downloadFile(filePath)
          )

          if (buffer.includes(0)) {
            return {
              ok: true as const,
              path: filePath,
              binary: true as const,
              bytes: buffer.length,
            }
          }

          const text = buffer.toString("utf8")

          return {
            ok: true as const,
            path: filePath,
            binary: false as const,
            content: clip(text),
            truncated: text.length > textLimit,
          }
        }),
    }),
    writeFile: tool({
      description:
        "Write a text file on your computer, creating parent directories when needed. Relative paths start at the home directory.",
      inputSchema: z.object({
        path: z.string().min(1).describe("File path to write."),
        content: z.string().describe("Full file contents."),
      }),
      execute: async ({ path: filePath, content }) =>
        catchTool(async () => {
          await withSandbox(sandboxId, async (sandbox) => {
            const parent = path.posix.dirname(filePath)

            if (parent && parent !== "." && parent !== "/") {
              await sandbox.process.executeCommand(
                `mkdir -p ${shellQuote(parent)}`
              )
            }

            await sandbox.fs.uploadFile(Buffer.from(content), filePath)
          })

          return {
            ok: true as const,
            path: filePath,
            bytes: Buffer.byteLength(content),
          }
        }),
    }),
    listFiles: tool({
      description:
        "List a directory on your computer. Relative paths start at the home directory. Use . for the working directory.",
      inputSchema: z.object({
        path: z.string().min(1).describe("Directory path to list."),
      }),
      execute: async ({ path: directory }) =>
        catchTool(async () => {
          const files = await withSandbox(sandboxId, (sandbox) =>
            sandbox.fs.listFiles(directory)
          )
          const entries = files
            .map((file) => ({
              name: file.name,
              path: file.path ?? file.name,
              isDir: file.isDir,
              size: file.size,
            }))
            .sort(
              (a, b) =>
                Number(b.isDir) - Number(a.isDir) ||
                a.name.localeCompare(b.name)
            )

          return {
            ok: true as const,
            path: directory,
            entries: entries.slice(0, listLimit),
            truncated: entries.length > listLimit,
          }
        }),
    }),
    mouseClick: tool({
      description:
        "Click the desktop. Coordinates are pixels from the top left of the screen. Call viewScreen afterward to see the result.",
      inputSchema: z.object({
        x: z.number().int().describe("Horizontal pixel."),
        y: z.number().int().describe("Vertical pixel."),
        button: button.optional().describe("Mouse button. Defaults to left."),
        double: z.boolean().optional().describe("Double-click when true."),
      }),
      execute: async ({ x, y, button: mouseButton, double: doubleClick }) =>
        catchTool(async () => {
          const result = await withDesktop(sandboxId, (sandbox) =>
            sandbox.computerUse.mouse.click(x, y, mouseButton, doubleClick)
          )

          return { ok: true as const, x: result.x ?? x, y: result.y ?? y }
        }),
    }),
    mouseMove: tool({
      description:
        "Move the pointer. Coordinates are pixels from the top left of the screen.",
      inputSchema: z.object({
        x: z.number().int().describe("Horizontal pixel."),
        y: z.number().int().describe("Vertical pixel."),
      }),
      execute: async ({ x, y }) =>
        catchTool(async () => {
          const result = await withDesktop(sandboxId, (sandbox) =>
            sandbox.computerUse.mouse.move(x, y)
          )

          return { ok: true as const, x: result.x ?? x, y: result.y ?? y }
        }),
    }),
    mouseScroll: tool({
      description:
        "Scroll at a point on the desktop. One amount is about one wheel notch. Call viewScreen afterward if the screen should have changed.",
      inputSchema: z.object({
        x: z.number().int().describe("Horizontal pixel."),
        y: z.number().int().describe("Vertical pixel."),
        direction: direction.describe("Scroll direction."),
        amount: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .describe("Wheel notches. Defaults to 1."),
      }),
      execute: async ({ x, y, direction: scrollDirection, amount }) =>
        catchTool(async () => {
          await withDesktop(sandboxId, (sandbox) =>
            sandbox.computerUse.mouse.scroll(x, y, scrollDirection, amount)
          )

          return { ok: true as const, x, y, direction: scrollDirection }
        }),
    }),
    keyboardType: tool({
      description:
        "Type text into the focused desktop window. Newlines press Enter. Call viewScreen afterward when you need to see what changed.",
      inputSchema: z.object({
        text: z.string().min(1).describe("Text to type."),
      }),
      execute: async ({ text }) =>
        catchTool(async () => {
          await withDesktop(sandboxId, (sandbox) =>
            sandbox.computerUse.keyboard.type(text)
          )

          return { ok: true as const }
        }),
    }),
    keyboardPress: tool({
      description:
        "Press a key, optionally with modifiers. Keys include enter, escape, tab, backspace, delete, space, arrows, and letters. Modifiers are ctrl, alt, shift, and cmd.",
      inputSchema: z.object({
        key: z.string().min(1).describe("Key to press."),
        modifiers: z
          .array(modifier)
          .optional()
          .describe("Modifiers held during the key press."),
      }),
      execute: async ({ key, modifiers }) =>
        catchTool(async () => {
          await withDesktop(sandboxId, (sandbox) =>
            sandbox.computerUse.keyboard.press(key, modifiers)
          )

          return { ok: true as const, key }
        }),
    }),
    viewScreen: tool({
      description:
        "Look at the desktop yourself. Call this before the first click and after every action that can change the screen. The person you are talking with does not see this.",
      inputSchema: z.object({}),
      execute: () => takeScreenshot(sandboxId),
      toModelOutput: screenForModel,
    }),
    showScreen: tool({
      description:
        "Show the desktop to the person you are talking with. Call this only when they ask what is on the screen or ask to see it. Use viewScreen when you need to look yourself.",
      inputSchema: z.object({}),
      execute: () => takeScreenshot(sandboxId),
      toModelOutput: screenForModel,
    }),
  }
}

export type ComputerTools = ReturnType<typeof computerTools>

async function takeScreenshot(
  sandboxId: string
): Promise<ScreenShot | Failure> {
  return catchTool(async () => {
    return withDesktop(sandboxId, async (sandbox) => {
      const shot = await sandbox.computerUse.screenshot.takeCompressed({
        format: "jpeg",
        quality: 40,
        showCursor: true,
      })
      const image = shot.screenshot ? normalizeBase64(shot.screenshot) : ""

      if (!image) {
        throw new Error("The screenshot was empty.")
      }

      const display = await sandbox.computerUse.display
        .getInfo()
        .then((info) => info.displays?.[0])
        .catch(() => undefined)

      return {
        ok: true as const,
        image,
        mediaType: "image/jpeg" as const,
        width: display?.width ?? null,
        height: display?.height ?? null,
      }
    })
  })
}

function screenForModel({ output }: { output: ScreenShot | Failure }) {
  if (!output.ok) {
    return { type: "text" as const, value: output.error }
  }

  const size =
    output.width && output.height
      ? ` The desktop is ${output.width} by ${output.height} pixels, and click coordinates use that same space.`
      : " Click coordinates are pixels from the top left of this image."

  return {
    type: "content" as const,
    value: [
      { type: "text" as const, text: `Desktop screenshot.${size}` },
      {
        type: "file" as const,
        mediaType: output.mediaType,
        data: { type: "data" as const, data: output.image },
      },
    ],
  }
}

async function catchTool<T>(run: () => Promise<T>): Promise<T | Failure> {
  try {
    return await run()
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "The computer could not do that.",
    }
  }
}

function clip(text: string) {
  if (text.length <= textLimit) {
    return text
  }

  return `${text.slice(0, textLimit)}\n\n[truncated]`
}

function shellQuote(value: string) {
  return `'${value.replaceAll("'", `'\\''`)}'`
}

function normalizeBase64(value: string) {
  const marker = "base64,"

  if (value.startsWith("data:") && value.includes(marker)) {
    return value.slice(value.indexOf(marker) + marker.length)
  }

  return value
}
