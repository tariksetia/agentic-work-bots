"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ShuffleIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { unstable_rethrow } from "next/navigation"
import { useEffect, useRef, useState, type ReactElement } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { createBot, deleteBot, updateBot } from "@/actions/bot"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { type InsertBot, insertBotSchema } from "@/lib/db/schema"

const presets = [
  {
    id: "research",
    label: "Research assistant",
    name: "Ada",
    job: "Research assistant",
    instructions:
      "Answer briefly, cite sources, and ask before running anything destructive.",
  },
  {
    id: "reviewer",
    label: "Code reviewer",
    name: "Reed",
    job: "Code reviewer",
    instructions:
      "Point out bugs, risks, and missing tests. Be specific, and ask before changing anything.",
  },
  {
    id: "editor",
    label: "Writing editor",
    name: "Quinn",
    job: "Writing editor",
    instructions:
      "Edit for clarity and tone. Keep the writer's voice, and ask before rewriting the whole piece.",
  },
  {
    id: "tutor",
    label: "Tutor",
    name: "Sage",
    job: "Tutor",
    instructions:
      "Explain one idea at a time, check understanding, and ask before moving on.",
  },
] as const

const defaultPreset = presets[0]

function valuesFor(
  preset: (typeof presets)[number],
  avatar: string
): InsertBot {
  return {
    name: preset.name,
    job: preset.job,
    instructions: preset.instructions,
    avatar,
  }
}

export type BotDialogBot = {
  id: string
  name: string
  avatar: string
  job: string
  instructions: string | null
}

type PresetId = (typeof presets)[number]["id"]

function presetIdFor(bot: BotDialogBot) {
  const instructions = bot.instructions ?? ""

  return (
    presets.find(
      (preset) =>
        preset.name === bot.name &&
        preset.job === bot.job &&
        preset.instructions === instructions
    )?.id ?? null
  )
}

function valuesForBot(bot: BotDialogBot): InsertBot {
  return {
    name: bot.name,
    job: bot.job,
    instructions: bot.instructions ?? "",
    avatar: bot.avatar,
  }
}

export function BotDialog({
  bot,
  trigger,
  open: openProp,
  onOpenChange,
}: {
  bot?: BotDialogBot
  trigger?: ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
} = {}) {
  const editing = bot !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(0)
  const [presetId, setPresetId] = useState<PresetId | null>(
    bot ? presetIdFor(bot) : defaultPreset.id
  )
  const [formError, setFormError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen
  const wasOpen = useRef(false)

  const form = useForm<InsertBot>({
    resolver: zodResolver(insertBotSchema),
    defaultValues: bot ? valuesForBot(bot) : valuesFor(defaultPreset, "ada"),
  })

  const avatar = useWatch({ control: form.control, name: "avatar" })
  const isSubmitting = form.formState.isSubmitting
  const isBusy = isSubmitting || isDeleting

  function applyPreset(id: string) {
    const preset = presets.find((item) => item.id === id)
    if (!preset) return

    setPresetId(preset.id)
    form.setValue("name", preset.name, {
      shouldValidate: form.formState.isSubmitted,
    })
    form.setValue("job", preset.job, {
      shouldValidate: form.formState.isSubmitted,
    })
    form.setValue("instructions", preset.instructions, {
      shouldValidate: form.formState.isSubmitted,
    })
  }

  function handleOpenChange(next: boolean) {
    if (!next && (confirmOpen || isDeleting)) return
    if (!next) {
      setConfirmOpen(false)
      setDeleteError(null)
    }
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  function handleConfirmOpenChange(next: boolean) {
    if (isDeleting) return
    setConfirmOpen(next)
    if (!next) setDeleteError(null)
  }

  async function onDelete() {
    if (!bot) return

    setDeleteError(null)
    setIsDeleting(true)

    try {
      const result = await deleteBot(bot.id)
      if (!result.ok) {
        setDeleteError(result.error)
        setIsDeleting(false)
      }
    } catch (error) {
      unstable_rethrow(error)
      setDeleteError("Could not delete the bot.")
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (open && !wasOpen.current) {
      setFormError(null)
      if (bot) {
        setPresetId(presetIdFor(bot))
        form.reset(valuesForBot(bot))
      } else {
        setPresetId(defaultPreset.id)
        form.reset(valuesFor(defaultPreset, nanoid()))
      }
    }
    wasOpen.current = open
  }, [open, form, bot])

  async function onSubmit(values: InsertBot) {
    setFormError(null)

    try {
      const result = bot
        ? await updateBot(bot.id, values)
        : await createBot(values)
      if (!result.ok) {
        setFormError(result.error)
        return
      }
      handleOpenChange(false)
      // Remount so the refresh after a save cannot leave the exit animation open.
      setDialogKey((key) => key + 1)
    } catch {
      setFormError(
        bot ? "Could not update the bot." : "Could not create the bot."
      )
    }
  }

  const formId = editing ? "edit-bot" : "create-bot"

  return (
    <Dialog key={dialogKey} open={open} onOpenChange={handleOpenChange}>
      {isControlled ? null : trigger ? (
        <DialogTrigger render={trigger} />
      ) : (
        <DialogTrigger render={<Button variant="secondary" size="lg" />}>
          <PlusIcon data-icon="inline-start" />
          Create a new bot
        </DialogTrigger>
      )}
      <DialogContent className="w-[min(32rem,calc(100%-2rem))] max-w-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit bot" : "New bot"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Change its face, name, or the job it does."
              : "Give it a face, a name, and a job to do."}
          </DialogDescription>
        </DialogHeader>
        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <ToggleGroup
            aria-label="Bot presets"
            value={presetId ? [presetId] : []}
            onValueChange={(groupValue) => {
              const next = groupValue[0]
              if (next) applyPreset(next)
            }}
            spacing={2}
            variant="outline"
            size="sm"
            disabled={isBusy}
            className="flex-wrap"
          >
            {presets.map((preset) => (
              <ToggleGroupItem
                key={preset.id}
                value={preset.id}
                type="button"
                className="rounded-full"
              >
                {preset.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <FieldGroup>
            <Field orientation="horizontal">
              <ChatAvatar seed={avatar} className="size-10" />
              <FieldContent>
                <FieldLabel>Face</FieldLabel>
                <FieldDescription>
                  Shuffle until you find one you like.
                </FieldDescription>
              </FieldContent>
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                onClick={() =>
                  form.setValue("avatar", nanoid(), { shouldDirty: true })
                }
              >
                <ShuffleIcon data-icon="inline-start" />
                Shuffle
              </Button>
            </Field>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    disabled={isBusy}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="job"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={field.name}>Job</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    autoComplete="off"
                    disabled={isBusy}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="instructions"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={field.name}>
                    How it should work
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={3}
                    disabled={isBusy}
                    aria-invalid={fieldState.invalid}
                    className="min-h-24"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {formError ? <FieldError>{formError}</FieldError> : null}
        </form>
        <DialogFooter>
          {bot ? (
            <AlertDialog
              open={confirmOpen}
              onOpenChange={handleConfirmOpenChange}
            >
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="destructive"
                    className="sm:mr-auto"
                    disabled={isBusy}
                  />
                }
              >
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this bot?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes {bot.name} and its chat.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteError ? <FieldError>{deleteError}</FieldError> : null}
                <AlertDialogFooter>
                  <AlertDialogCancel type="button" disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={onDelete}
                  >
                    {isDeleting && <Spinner data-icon="inline-start" />}
                    Delete bot
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          <DialogClose
            render={
              <Button variant="outline" type="button" disabled={isBusy} />
            }
          >
            Cancel
          </DialogClose>
          <Button type="submit" form={formId} disabled={isBusy}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            {editing ? "Update bot" : "Create bot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
