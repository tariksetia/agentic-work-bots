<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

 
## Database
- Apply schema changes with `npm run db:push` (`drizzle-kit push`). Never generate or run Drizzle migrations, and do not add migration files or a `drizzle/` folder.

## Development
This is a development project. There is no backward compatibility and data is worthless. Prefer data loss, never backfill, migrate or preserve the existing rows, and never spend effort on keeping old data working. Every schema change means clean state.

## Railway
The production service is `bot-works` in the `bot-works` project. When adding env vars from `.env.local`, copy the new keys onto that service.

`TRIGGER_SECRET_KEY` is the exception. `.env.local` holds the Trigger.dev development key (`tr_dev_…`). The Railway deployment needs the production key (`tr_prod_…`), because a development key cannot access the production environment. Leave the Railway value in place. Do not copy `TRIGGER_SECRET_KEY` from `.env.local`.

## Git
- Never create branches, worktrees, or commits automatically. Only do so when the user explicitly asks for that specific action in the current request.
- Leave changes uncommitted in the working tree on the current branch and let the user decide when
and how to commit.
- every commint message must start with "bot-works: " and it must be succinct and articulate

## Forms

Derive the form schema from the Drizzle table with `createInsertSchema` from `drizzle-zod`, in `lib/db/schema.ts` next to the table. Extend a column with a callback, `(schema) => schema.trim().min(1)`, or pass a Zod schema to replace it, including its nullability. `.omit()` every column the client must not set (`id`, `userId`, `createdAt`, and anything else the server owns). Export `z.infer` of that schema and use it as the form value type. Do not hand-write a second Zod object for the same insert.

The server action lives in `actions/`, starts with `"use server"`, and exports only async functions. Call `await auth()` from `@clerk/nextjs/server` and require both `isAuthenticated` and `userId`. Never accept `userId` from the client. `safeParse` the insert schema, then insert with `userId` set on the server. Turn an empty optional string into `null`. Return `{ ok: false, error }` for auth and validation failures so the form can show the message. Do not throw for those. `revalidatePath` after a successful write.

The form is a client component. Validate with `useForm` and `zodResolver` on the same insert schema. Lay fields out with `FieldGroup` and `Field`, one `Controller` per field. Put `data-invalid={fieldState.invalid || undefined}` on `Field` and `aria-invalid` on the control. Render `FieldError` with `errors={[fieldState.error]}` only when the field is invalid. Show an action failure in a `FieldError` under the fields. Read a live value with `useWatch`. `form.watch()` makes the React Compiler skip the component.

Two to seven choices use Base UI `ToggleGroup`. Its `value` is always an array, and there is no `type="single"`. A toggle inside a form needs `type="button"` or it submits the form. Triggers and closes use `render={<Button />}`, not `asChild`. While a submit is in flight, disable the controls and show `Spinner` with `data-icon="inline-start"`. Buttons have no loading prop.

Keep `DialogFooter` a direct child of `DialogContent` and point the submit button at the form with the `form` attribute, so the footer still bleeds to the dialog edges. A dialog stays centered and is not full width. `DialogContent` is `w-full max-w-[calc(100%-2rem)]` plus `sm:max-w-sm`, and passing only `sm:max-w-lg` leaves the near-full-width cap in place. Override both: `w-[min(32rem,calc(100%-2rem))] max-w-lg sm:max-w-lg`.

Do not call `nanoid()` or any other random seed during render. The client component is server-rendered, so a seed in `defaultValues` mismatches hydration. Use a stable default and generate the seed when the dialog opens or the user asks for a new one.

## DiceBear

Use DiceBear 10. Documentation: https://www.dicebear.com/llms.txt

There are seven native cores with identical output, not one library with
wrappers. Use the one matching this project's language. Do not reach for the
JavaScript core when the project is written in something else:

    JavaScript  @dicebear/core + @dicebear/styles
    PHP         dicebear/core + dicebear/styles
    Python      dicebear-core + dicebear-styles
    Rust        dicebear-core + dicebear-styles
    Go          github.com/dicebear/dicebear-go/v10 + github.com/dicebear/styles/v10
    Dart        dicebear_core + dicebear_styles
    C#          DiceBear.Core + DiceBear.Styles

Every style page carries a loading snippet for all seven, for example
https://www.dicebear.com/styles/lorelei/index.md

HTTP API: https://api.dicebear.com/10.x/<style>/svg?seed=<seed> The seed is a
query parameter, not a path segment. Options are query parameters too; array
values are separated by commas.

Options named after a component end in Variant: eyesVariant, not eyes. This
holds in all seven cores and in the HTTP API. Look up the options of a style at
https://api.dicebear.com/10.x/<style>/options.json

Write these forms, not the ones on the left. The left column is pre-10 and the
API does not reject it, so an outdated call runs and silently does the wrong
thing:

    avatars.dicebear.com/api/<style>/<seed>.svg  ->  api.dicebear.com/10.x/<style>/svg?seed=<seed>
    api.dicebear.com/9.x/<style>/svg             ->  api.dicebear.com/10.x/<style>/svg
    npm install @dicebear/collection             ->  npm install @dicebear/styles
    npm install @dicebear/lorelei                ->  npm install @dicebear/styles
    createAvatar(lorelei, { seed })              ->  new Avatar(new Style(definition), { seed })
    { eyes: ['variant01'] }                      ->  { eyesVariant: ['variant01'] }
    ?radius=50                                   ->  ?borderRadius=50

Only JavaScript and the HTTP API have a pre-10 form. The other six cores were
released in 2026 and never had one, so any older-looking PHP, Python, Rust, Go,
Dart or C# API attributed to DiceBear is invented rather than outdated.

<!-- TRIGGER.DEV SKILLS START -->
## Trigger.dev agent skills

This project has Trigger.dev agent skills installed in `.agents/skills/`. Before writing or changing Trigger.dev code (background tasks, scheduled tasks, realtime, or chat.agent AI agents), load the most relevant skill: `trigger-authoring-chat-agent`, `trigger-authoring-tasks`, `trigger-chat-agent-advanced`, `trigger-cost-savings`, `trigger-getting-started`, `trigger-realtime-and-frontend`.
<!-- TRIGGER.DEV SKILLS END -->
