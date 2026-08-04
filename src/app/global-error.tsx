"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/design/components/button"
import { EmptyState } from "@/design/components/empty-state"
import Link from "next/link"

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
          <EmptyState
            icon={AlertCircle}
            title="Something went wrong!"
            description={
              error.message || "An unexpected error occurred. Please try again or return home."
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
      </body>
    </html>
  )
}
