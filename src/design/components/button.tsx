"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-background shadow hover:bg-primary-hover",
        destructive: "bg-error text-foreground shadow-sm hover:bg-error/90",
        outline: "border border-border bg-transparent shadow-sm hover:bg-surface hover:text-foreground",
        secondary: "bg-surface text-foreground shadow-sm hover:bg-surface-elevated border border-border-subtle",
        ghost: "hover:bg-surface hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(props as React.ComponentProps<typeof motion.button>)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
