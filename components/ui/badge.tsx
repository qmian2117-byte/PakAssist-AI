import * as React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
        {
          "border-transparent bg-primary text-primary-foreground shadow-sm":
            variant === 'default',
          "border-transparent bg-secondary text-secondary-foreground":
            variant === 'secondary',
          "border-transparent bg-destructive text-destructive-foreground shadow-sm":
            variant === 'destructive',
          "text-foreground border-border": variant === 'outline',
          "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400":
            variant === 'success',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
