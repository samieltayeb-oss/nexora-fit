'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export function NumberCounter({ 
  value, 
  decimals = 0,
  prefix = '', 
  suffix = '',
  className = '' 
}: { 
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string 
}) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 })
  const display = useTransform(spring, (current) => 
    `${prefix}${current.toFixed(decimals)}${suffix}`
  )

  const [currentText, setCurrentText] = useState(`${prefix}${value.toFixed(decimals)}${suffix}`)

  useEffect(() => {
    spring.set(value)
    const unsubscribe = display.on('change', (latest) => setCurrentText(latest))
    return () => unsubscribe()
  }, [value, spring, display])

  return <motion.span className={className}>{currentText}</motion.span>
}
