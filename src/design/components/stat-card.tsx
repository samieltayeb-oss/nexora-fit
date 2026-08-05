import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "./card"
import { cn } from "@/lib/utils"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | React.ReactNode
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
  }
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-foreground/50">
              {title}
            </span>
            <span className="font-display text-3xl font-medium tracking-tight text-foreground">
              {value}
            </span>
          </div>
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>
          )}
        </div>
        
        {(subtitle || trend) && (
          <div className="mt-4 flex items-center space-x-2 text-sm">
            {trend && (
              <span
                className={cn(
                  "font-medium",
                  trend.value >= 0 ? "text-success" : "text-error"
                )}
              >
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>
            )}
            {subtitle && (
              <span className="text-foreground/70">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
