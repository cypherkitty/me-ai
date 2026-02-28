---
name: use-shadcn-svelte
description: Use shadcn-svelte components and Tailwind CSS v4 when building or modifying UI in me-ai. Use when adding new UI, refactoring existing components, replacing custom CSS, building forms/dialogs/tables, or adding icons. Ensures consistent use of shadcn-svelte, Tailwind utilities, lucide-svelte icons, and the project theme.
---

# Using shadcn-svelte in me-ai

## Setup (already done)

- Tailwind CSS v4 via `@tailwindcss/vite`
- shadcn-svelte v1 components in `src/lib/components/ui/`
- `$lib` alias → `src/lib/`
- `cn()` utility in `src/lib/utils.js`
- lucide-svelte for icons

## Adding new components

```bash
npx shadcn-svelte@latest add --yes <component-name>
```

Common: `button badge card input label select switch separator scroll-area table dialog sheet tooltip popover accordion tabs`

## Import patterns

```svelte
<script>
  import { Button }     from "$lib/components/ui/button/index.js";
  import { Badge }      from "$lib/components/ui/badge/index.js";
  import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card/index.js";
  import { Input }      from "$lib/components/ui/input/index.js";
  import { Label }      from "$lib/components/ui/label/index.js";
  import * as Select    from "$lib/components/ui/select/index.js";
  import { Switch }     from "$lib/components/ui/switch/index.js";
  import * as Dialog    from "$lib/components/ui/dialog/index.js";
  import { cn }         from "$lib/utils.js";
  import { Mail, Inbox, ChevronRight } from "lucide-svelte";
</script>
```

## Component recipes

### Form field

```svelte
<div class="space-y-1.5">
  <Label for="name">Name</Label>
  <Input id="name" bind:value={name} placeholder="Enter name..." />
</div>
```

### Select dropdown

```svelte
<Select.Root bind:value={selected}>
  <Select.Trigger class="w-full">
    <Select.Value placeholder="Choose..." />
  </Select.Trigger>
  <Select.Content>
    {#each options as opt}
      <Select.Item value={opt.value}>{opt.label}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
```

### Confirmation dialog

```svelte
<Dialog.Root bind:open={showDialog}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => showDialog = false}>Cancel</Button>
      <Button variant="destructive" onclick={handleConfirm}>Delete</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### Status badges

```svelte
<!-- Use cn() with Badge for dynamic status colors -->
<Badge variant="outline" class={cn(
  status === "completed"  && "text-success border-success/30 bg-success/10",
  status === "failed"     && "text-destructive border-destructive/30",
  status === "pending"    && "text-warning border-warning/30 bg-warning/10",
)}>
  {status}
</Badge>
```

## Style rules

- **No `<style>` blocks** — use only Tailwind utilities
- **Never override shadcn colors** — don't pass color classes (`text-red-*`, `bg-green-*`, etc.) to shadcn components; use the `variant` prop instead
- **Allowed on shadcn components**: layout/size only — `gap-*`, `p-*`, `h-*`, `w-*`, `flex`, `min-w-*`, `truncate`, `font-mono`, `text-xs`
- **Conditional classes**: use `cn()`, never string concatenation
- **Scrollable areas**: wrap in `<ScrollArea>` component
- **Tables**: use `Table.Root`, `Table.Header`, `Table.Row`, `Table.Head`, `Table.Body`, `Table.Cell`
- **Icons**: use `lucide-svelte`, size via `class="size-4"` or `size={16}`

## Theme colors for custom elements (NOT shadcn components)

`bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `bg-primary`, `bg-secondary`, `bg-destructive`, `text-foreground`, `text-muted-foreground`, `text-primary`, `border-border`

Custom colors (`success`, `warning`, `info`, `trace-bg`, `node-trigger`, `node-action`, `node-complete`) are defined in `src/app.css` and available as Tailwind utilities.
