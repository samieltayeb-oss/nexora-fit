"use client"

import * as React from "react"
import { WifiOff, CloudOff, CloudDrizzle, CloudLightning, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type SyncStatus = "online" | "offline" | "syncing" | "synced" | "pending" | "failed"

export function SyncStatusIndicator({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<SyncStatus>("online")

  React.useEffect(() => {
    function updateOnlineStatus() {
      setStatus(navigator.onLine ? "online" : "offline")
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Initial check
    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  if (status === "online") return null

  const getStatusContent = () => {
    switch (status) {
      case "offline":
        return { icon: WifiOff, text: "You're offline. App is running from cache.", color: "text-foreground/70" }
      case "syncing":
        return { icon: RefreshCw, text: "Syncing data...", color: "text-primary animate-spin" }
      case "pending":
        return { icon: CloudDrizzle, text: "Pending changes waiting for connection.", color: "text-warning" }
      case "failed":
        return { icon: AlertCircle, text: "Sync failed. Will retry.", color: "text-error" }
      case "synced":
        return { icon: CheckCircle2, text: "All data synced.", color: "text-success" }
      default:
        return { icon: CloudOff, text: "Status unknown", color: "text-foreground/50" }
    }
  }

  const { icon: Icon, text, color } = getStatusContent()

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-[3000]",
        "flex items-center gap-2 rounded-full px-4 py-2",
        "bg-surface-elevated/90 backdrop-blur-md border border-border shadow-lg",
        "animate-in slide-in-from-bottom-5 fade-in duration-300",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Icon className={cn("h-4 w-4", color)} />
      <span className="text-xs font-medium text-foreground tracking-wide">
        {text}
      </span>
    </div>
  )
}
