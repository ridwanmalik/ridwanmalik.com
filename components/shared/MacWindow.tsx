"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Minus, Plus, X } from "lucide-react"
import GlassCard from "@/components/shared/GlassCard"

// macOS traffic lights: close, minimise, zoom
const LIGHTS = {
  close: { color: "#FF5F57", Icon: X },
  minimize: { color: "#FEBC2E", Icon: Minus },
  zoom: { color: "#28C840", Icon: Plus },
}

const ZOOM_SCALE = 1.08

interface MacWindowProps {
  children: ReactNode
  // Placement (absolute, top/right, width, breakpoints). Goes on the outer wrapper, which
  // also runs the close/zoom animation; the float drift runs on the inner card, so the
  // two transforms never fight over the same element.
  className?: string
  title?: string
  // Offsets the float drift so the windows don't bob in sync
  floatDelay?: string
}

// A glass "app window" with working traffic lights: red closes it (until reload), yellow
// collapses it to the title bar, green restores a minimised window or toggles a small zoom.
// The hero cards are decorative (aria-hidden), so the buttons stay out of the tab order.
const MacWindow = ({ children, className = "", title, floatDelay }: MacWindowProps) => {
  const [closed, setClosed] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const handleZoom = () => {
    if (minimized) setMinimized(false)
    else setZoomed(z => !z)
  }

  const actions = { close: () => setClosed(true), minimize: () => setMinimized(m => !m), zoom: handleZoom }

  return (
    <AnimatePresence>
      {!closed && (
        <motion.div
          className={className}
          initial={false}
          animate={{ scale: zoomed ? ZOOM_SCALE : 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}>
          <GlassCard className="shadow-2xl motion-safe:animate-float" style={{ animationDelay: floatDelay }}>
            <div className="relative flex items-center h-8 px-3 border-b border-white/10">
              <div className="group/lights relative z-10 flex gap-1.5">
                {(Object.keys(LIGHTS) as (keyof typeof LIGHTS)[]).map(action => {
                  const { color, Icon } = LIGHTS[action]
                  return (
                    <button
                      key={action}
                      type="button"
                      tabIndex={-1}
                      onClick={actions[action]}
                      className="flex items-center justify-center w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color }}>
                      <Icon
                        className="w-2 h-2 text-black/60 opacity-0 transition-opacity group-hover/lights:opacity-100"
                        strokeWidth={3}
                      />
                    </button>
                  )
                })}
              </div>
              {title && (
                <span className="absolute inset-x-0 text-center font-mono text-[11px] text-custom-secondary">
                  {title}
                </span>
              )}
            </div>
            <motion.div
              initial={false}
              animate={{ height: minimized ? 0 : "auto" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden">
              {children}
            </motion.div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MacWindow
