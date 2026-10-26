"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"

interface StaggerGroupProps {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  // Play when scrolled into view instead of on mount (for sections below the fold)
  inView?: boolean
}

const IN_VIEW = { whileInView: "show", viewport: { once: true, margin: "-80px" } } as const

const StaggerGroup = ({ children, className, stagger = 0.1, delay = 0, inView = false }: StaggerGroupProps) => (
  <motion.div
    className={className}
    initial="hidden"
    {...(inView ? IN_VIEW : { animate: "show" })}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: stagger, delayChildren: delay } },
    }}>
    {children}
  </motion.div>
)

interface StaggerItemProps {
  children: ReactNode
  className?: string
  from?: "up" | "down"
}

const ITEM_OFFSETS = { up: 24, down: -24 } as const

const StaggerItem = ({ children, className, from = "up" }: StaggerItemProps) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: ITEM_OFFSETS[from] },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    }}>
    {children}
  </motion.div>
)

export { StaggerGroup, StaggerItem }
