import { Tooltip as RechartsTooltip } from "recharts"
import { cn } from "./utils"

/* -----------------------------------------------------------------------------
 * ChartContainer
 * -------------------------------------------------------------------------- */
export const ChartContainer = ({ className, children, ...props }) => (
  <div className={cn("w-full", className)} {...props}>
    {children}
  </div>
)

/* -----------------------------------------------------------------------------
 * Tooltip wrapper (ChartTooltip)
 * -------------------------------------------------------------------------- */
export const ChartTooltip = (props) => (
  <RechartsTooltip
    cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "3 3" }}
    {...props}
  />
)

/* -----------------------------------------------------------------------------
 * TooltipContent
 * -------------------------------------------------------------------------- */
export const ChartTooltipContent = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border bg-card p-3 text-sm shadow-md">
      {label && <div className="mb-1 font-medium">{label}</div>}
      <ul className="space-y-0.5">
        {payload.map((entry) => (
          <li key={entry.dataKey} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ backgroundColor: entry.color || "hsl(var(--foreground))" }}
            />
            <span className="capitalize">{entry.name ?? entry.dataKey}:</span>
            <span className="font-medium tabular-nums">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
