import * as React from "react"
import { cn } from "./utils"

/**
 * Button component
 * -------------------------------------------------------------------
 * Variants:
 *  - default:      Primary action (solid)
 *  - secondary:    Neutral background
 *  - destructive:  Error / danger action (red)
 *  - outline:      Transparent with border
 *  - ghost:        Bare button for subtle actions
 *
 * Sizes:
 *  - sm: smaller padding / text
 *  - md: default
 *  - lg: larger padding / text
 *  - icon: square (w = h) for icon-only buttons
 *
 * Example:
 *  <Button>Save</Button>
 *  <Button variant="destructive" size="sm">Delete</Button>
 */
export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", type = "button", disabled, children, ...props }, ref) => {
    /* ------------------------------------------------------------
     * Variant styles
     * ---------------------------------------------------------- */
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    }

    /* ------------------------------------------------------------
     * Size styles
     * ---------------------------------------------------------- */
    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-sm",
      icon: "h-10 w-10",
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none " +
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none " +
            "disabled:opacity-50 ring-offset-background",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"
