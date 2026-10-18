import {
  Daytona,
  DaytonaGoneError,
  DaytonaNotFoundError,
  SandboxState,
  type Sandbox,
} from "@daytona/sdk"

const desktops = new Set<string>()
const vncPort = 6080
const previewTtlSeconds = 60 * 60 * 24

// Next.js and Trigger.dev load .env.local into the process. The SDK then
// refuses DAYTONA_API_URL, because it cannot tell the file from the shell.
// Naming the Daytona Cloud endpoint here is what it accepts.
const apiUrl = "https://app.daytona.io/api"

function client() {
  return new Daytona({ apiUrl })
}

export async function createSandbox(botId: string) {
  const sandbox = await client().create({
    labels: { botId },
  })

  return sandbox.id
}

export async function deleteSandbox(sandboxId: string) {
  const daytona = client()

  try {
    const sandbox = await daytona.get(sandboxId)
    await daytona.delete(sandbox)
  } catch (error) {
    if (
      error instanceof DaytonaNotFoundError ||
      error instanceof DaytonaGoneError
    ) {
      return
    }

    throw error
  }
}

export async function withSandbox<T>(
  sandboxId: string,
  run: (sandbox: Sandbox) => Promise<T>
) {
  const sandbox = await openSandbox(sandboxId)
  return run(sandbox)
}

export async function withDesktop<T>(
  sandboxId: string,
  run: (sandbox: Sandbox) => Promise<T>
) {
  const sandbox = await openSandbox(sandboxId)
  await ensureDesktop(sandbox)
  return run(sandbox)
}

export async function getDesktopPreviewUrl(sandboxId: string) {
  return withDesktop(sandboxId, async (sandbox) => {
    const signed = await sandbox.getSignedPreviewUrl(vncPort, previewTtlSeconds)
    const url = new URL("/vnc.html", signed.url)

    url.searchParams.set("autoconnect", "1")
    url.searchParams.set("reconnect", "1")
    url.searchParams.set("resize", "scale")
    url.searchParams.set("shared", "1")
    url.searchParams.set("view_clip", "1")

    return url.toString()
  })
}

async function openSandbox(sandboxId: string) {
  const sandbox = await client().get(sandboxId)

  if (sandbox.state === SandboxState.STARTED) {
    return sandbox
  }

  if (
    sandbox.state === SandboxState.STOPPED ||
    sandbox.state === SandboxState.PAUSED ||
    sandbox.state === SandboxState.ARCHIVED ||
    sandbox.state === SandboxState.STARTING ||
    sandbox.state === SandboxState.RESUMING ||
    sandbox.state === SandboxState.RESTORING
  ) {
    desktops.delete(sandboxId)
    await sandbox.start(120)
    return sandbox
  }

  throw new Error("The computer is not running.")
}

async function ensureDesktop(sandbox: Sandbox) {
  if (desktops.has(sandbox.id)) {
    return
  }

  let running = false

  try {
    const status = await sandbox.computerUse.getProcessStatus("xfce4")
    running = status.running === true
  } catch {
    running = false
  }

  if (!running) {
    await sandbox.computerUse.start()
  }

  desktops.add(sandbox.id)
}
