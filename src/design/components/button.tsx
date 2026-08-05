"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, type MotionProps, useReducedMotion } from "framer-motion"

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

/**
 * ButtonProps extends both standard HTML button attributes AND Framer Motion
 * animation props so callers can pass whileHover/whileTap/animate directly.
 * The `asChild` mode delegates to Radix Slot (no animation layer).
 */
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> &
  MotionProps & {
    asChild?: boolean
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion()

    if (asChild) {
      // Slot does not accept MotionProps — strip them out
      const { whileHover, whileTap, whileFocus, whileDrag, animate, initial, exit, transition, variants, ...htmlProps } = props
      void whileHover; void whileTap; void whileFocus; void whileDrag; void animate; void initial; void exit; void transition; void variants
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...htmlProps}
        />
      )
    }

    return (
      <motion.button
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
