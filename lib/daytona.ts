import "server-only"

import {
  Daytona,
  DaytonaGoneError,
  DaytonaNotFoundError,
} from "@daytona/sdk"

function client() {
  return new Daytona()
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
