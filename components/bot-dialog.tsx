"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ShuffleIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { createBot } from "@/actions/bot"
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

export function BotDialog({
  open: openProp,
  onOpenChange,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [presetId, setPresetId] = useState<(typeof presets)[number]["id"]>(
    defaultPreset.id
  )
  const [formError, setFormError] = useState<string | null>(null)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen
  const wasOpen = useRef(false)

  const form = useForm<InsertBot>({
    resolver: zodResolver(insertBotSchema),
    defaultValues: valuesFor(defaultPreset, "ada"),
  })

  const avatar = useWatch({ control: form.control, name: "avatar" })
  const isSubmitting = form.formState.isSubmitting

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
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (open && !wasOpen.current) {
      setFormError(null)
      setPresetId(defaultPreset.id)
      form.reset(valuesFor(defaultPreset, nanoid()))
    }
    wasOpen.current = open
  }, [open, form])

  async function onSubmit(values: InsertBot) {
    setFormError(null)

    try {
      const result = await createBot(values)
      if (!result.ok) {
        setFormError(result.error)
        return
      }
      handleOpenChange(false)
    } catch {
      setFormError("Could not create the bot.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {isControlled ? null : (
        <DialogTrigger render={<Button variant="secondary" size="lg" />}>
          <PlusIcon data-icon="inline-start" />
          Create a new bot
        </DialogTrigger>
      )}
      <DialogContent className="w-[min(32rem,calc(100%-2rem))] max-w-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New bot</DialogTitle>
          <DialogDescription>
            Give it a face, a name, and a job to do.
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-bot"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <ToggleGroup
            aria-label="Bot presets"
            value={[presetId]}
            onValueChange={(groupValue) => {
              const next = groupValue[0]
              if (next) applyPreset(next)
            }}
            spacing={2}
            variant="outline"
            size="sm"
            disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
          <DialogClose render={<Button variant="outline" type="button" />}>
            Cancel
          </DialogClose>
          <Button type="submit" form="create-bot" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            Create bot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
