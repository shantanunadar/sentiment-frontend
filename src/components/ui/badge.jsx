import * as React from "react"
import { cn } from "./utils"

/**
 * Badge component
 * -------------------------------------------------------------------
 * Variants:
 *  - default:   Solid background using primary color
 *  - secondary: Neutral background
 *  - destructive: Red background for errors/warnings
 *  - outline:   Transparent background with border
 *
 * Usage:
 *  <Badge>New</Badge>
 *  <Badge variant="destructive">Error</Badge>
 */
export const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const base = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors"

  const variantClasses = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    destructive: "bg-destructive text-destructive-foreground border-transparent",
    outline: "border-foreground text-foreground bg-transparent",
  }

  return <span ref={ref} className={cn(base, variantClasses[variant], className)} {...props} />
})

Badge.displayName = "Badge"
