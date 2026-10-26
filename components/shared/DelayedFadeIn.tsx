"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

interface DelayedFadeInProps {
  children: ReactNode
  className?: string
  // Seconds after mount. Runs on the same clock as the motion-based Reveal animations
  // (they start once React hydrates), unlike a CSS animation, which starts at first paint.
  delay?: number
}

// Fades in while settling from slightly smaller, once mounted and after `delay`
const DelayedFadeIn = ({ children, className, delay = 0 }: DelayedFadeInProps) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.2, ease: "easeOut" }}>
      {children}
    </motion.div>
  )
}

export default DelayedFadeIn
