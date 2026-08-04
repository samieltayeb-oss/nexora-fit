"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/design/components/button"
import { EmptyState } from "@/design/components/empty-state"
import Link from "next/link"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <EmptyState
        icon={AlertCircle}
        title="We encountered an issue"
        description={
          error.message || "An unexpected error occurred while loading this page. Please try again."
        }
        action={
          <div className="flex gap-4">
            <Button onClick={() => reset()} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" /> Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Link>
            </Button>
          </div>
        }
      />
    </div>
  )
}
