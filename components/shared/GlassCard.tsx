"use client"

import type { CSSProperties, MouseEvent, ReactNode } from "react"

// Same glass as the resume sheet: translucent navy, faint white sheen, blurred backdrop
const GLASS =
  "group pointer-events-auto overflow-hidden rounded-lg border border-white/10 bg-oxford-blue/60 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors duration-300 hover:border-white/20"

// Soft light that follows the mouse, like the resume sheet's spotlight
const SPOTLIGHT =
  "radial-gradient(circle 160px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(204, 214, 246, 0.12), transparent)"

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const GlassCard = ({ children, className = "", style }: GlassCardProps) => {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`)
  }

  return (
    <div onMouseMove={handleMouseMove} className={`${GLASS} ${className}`} style={style}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: SPOTLIGHT }}
      />
      {children}
    </div>
  )
}

export default GlassCard
