import { cn } from "@/utils/cn"
import { AlertCircle } from "lucide-react"

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search terms or filters to find what you are looking for.",
  icon: Icon = AlertCircle,
  className,
}: {
  title?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/30",
        className
      )}
    >
      <div className="p-3 bg-muted rounded-full mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  )
}
