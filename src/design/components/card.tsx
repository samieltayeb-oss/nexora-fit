"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type MotionProps, useReducedMotion } from "framer-motion"

/**
 * HTML div events that conflict with Framer Motion's event signatures.
 * We omit them from the HTML props before spreading onto motion.div.
 */
type ConflictingHTMLEvents =
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDragStart'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'

type SafeHTMLDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, ConflictingHTMLEvents>

/**
 * CardProps extends safe HTML div attributes AND Framer Motion props.
 * When `onClick` is provided, the card renders as a motion.div with
 * hover/tap animations — respecting prefers-reduced-motion.
 */
type CardProps = SafeHTMLDivProps & {
  /** Optional Framer Motion overrides for the interactive variant */
  motionProps?: MotionProps
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, onClick, motionProps, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion()
    const isInteractive = !!onClick

    if (isInteractive) {
      const animationProps: MotionProps = prefersReducedMotion
        ? {} // No animation for users who prefer reduced motion
        : {
            whileHover: { scale: 1.01 },
            whileTap: { scale: 0.98 },
            ...motionProps,
          }

      return (
        <motion.div
          ref={ref}
          onClick={onClick}
          className={cn(
            "rounded-xl border border-border-subtle bg-surface text-foreground shadow-sm backdrop-blur-xl cursor-pointer",
            className
          )}
          {...animationProps}
          {...props}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border-subtle bg-surface text-foreground shadow-sm backdrop-blur-xl",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-foreground/70", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
export type { CardProps }
