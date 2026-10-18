"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { createGroupChat } from "@/actions/chat"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { type InsertGroupChat, insertGroupChatSchema } from "@/lib/db/schema"
import type { BotListItem } from "@/queries/bots"

const emptyValues: InsertGroupChat = { name: "", botIds: [] }

export function GroupChatDialog({
  bots,
  open,
  onOpenChange,
}: {
  bots: BotListItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [dialogKey, setDialogKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const wasOpen = useRef(false)

  const form = useForm<InsertGroupChat>({
    resolver: zodResolver(insertGroupChatSchema),
    defaultValues: emptyValues,
  })

  const isSubmitting = form.formState.isSubmitting

  useEffect(() => {
    if (open && !wasOpen.current) {
      setFormError(null)
      form.reset(emptyValues)
    }
    wasOpen.current = open
  }, [open, form])

  async function onSubmit(values: InsertGroupChat) {
    setFormError(null)

    try {
      const result = await createGroupChat(values)
      if (!result.ok) {
        setFormError(result.error)
        return
      }
      onOpenChange(false)
      // Remount so the refresh after a save cannot leave the exit animation open.
      setDialogKey((key) => key + 1)
      router.push(`/chats/${result.chatId}`)
    } catch {
      setFormError("Could not create the group.")
    }
  }

  return (
    <Dialog key={dialogKey} open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New group chat</DialogTitle>
          <DialogDescription>
            Name the group and pick which bots are in it.
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-group-chat"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Weekend plans"
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
              name="botIds"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid || undefined}>
                  <FieldLegend variant="label">Bots</FieldLegend>
                  {bots.length === 0 ? (
                    <FieldDescription>Create a bot first.</FieldDescription>
                  ) : (
                    <FieldGroup data-slot="checkbox-group">
                      {bots.map((bot) => {
                        const id = `group-bot-${bot.id}`

                        return (
                          <Field
                            key={bot.id}
                            orientation="horizontal"
                            data-invalid={fieldState.invalid || undefined}
                          >
                            <Checkbox
                              id={id}
                              name={field.name}
                              checked={field.value.includes(bot.id)}
                              disabled={isSubmitting}
                              aria-invalid={fieldState.invalid}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked
                                    ? [...field.value, bot.id]
                                    : field.value.filter(
                                        (botId) => botId !== bot.id
                                      )
                                )
                              }
                            />
                            <FieldLabel
                              htmlFor={id}
                              className="items-center font-normal"
                            >
                              <ChatAvatar
                                seed={bot.avatar}
                                className="size-6"
                              />
                              {bot.name}
                            </FieldLabel>
                          </Field>
                        )
                      })}
                    </FieldGroup>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
          </FieldGroup>
          {formError ? <FieldError>{formError}</FieldError> : null}
        </form>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" type="button" disabled={isSubmitting} />
            }
          >
            Cancel
          </DialogClose>
          <Button
            type="submit"
            form="create-group-chat"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner data-icon="inline-start" />}
            Create group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
