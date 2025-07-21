import * as React from "react"
import { cn } from "./utils"

/**
 * Textarea component
 * -------------------------------------------------------------------
 * A styled `<textarea>` that matches the Tailwind / shadcn look-and-feel.
 *
 * Usage:
 *  <Textarea placeholder="Type your message…" />
 */
export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 " +
        "text-sm ring-offset-background placeholder:text-muted-foreground " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
      className,
    )}
    {...props}
  />
))

Textarea.displayName = "Textarea"
