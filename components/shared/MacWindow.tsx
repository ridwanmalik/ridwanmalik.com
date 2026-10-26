"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Minus, Plus, X } from "lucide-react"
import GlassCard from "@/components/shared/GlassCard"

// macOS traffic lights: close, minimise, zoom
const LIGHTS = {
  close: { color: "#FF5F57", Icon: X },
  minimize: { color: "#FEBC2E", Icon: Minus },
  zoom: { color: "#28C840", Icon: Plus },
}

const ZOOM_SCALE = 1.08

// Side of the minimised tile, in px
const TILE = 56

// Seconds. Minimising: the contents fade, then the empty frame shrinks into its corner,
// then the icon fades in. Restoring runs the same steps backwards.
const STEP = {
  fade: 0.15,
  resize: 0.35,
}

interface MacWindowProps {
  children: ReactNode
  // Placement (absolute, top/right, width, breakpoints). Goes on the outer wrapper, which
  // also runs the close/zoom animation; the float drift runs on the inner box, so the
  // two transforms never fight over the same element.
  className?: string
  title?: string
  // What the window turns into when minimised (e.g. a terminal icon); click it to restore
  minimizedIcon: ReactNode
  minimizedLabel: string
  // The bottom corner the frame shrinks into
  minimizeTo: "left" | "right"
  // Nudges the minimised tile sideways from that corner, in px (positive = right)
  minimizedShift?: number
  // Offsets the float drift so the windows don't bob in sync
  floatDelay?: string
}

// A glass "app window" with working traffic lights: red closes it (until reload), yellow
// folds it into a small icon tile in one of its bottom corners (click the tile to bring it
// back), green toggles a small zoom. The hero cards are decorative (aria-hidden), so the
// buttons stay out of the tab order.
//
// The window's full size is measured, and the box keeps that size even while minimised,
// so the frame can shrink into a corner of the spot the window occupied.
const MacWindow = ({
  children,
  className = "",
  title,
  minimizedIcon,
  minimizedLabel,
  minimizeTo,
  minimizedShift = 0,
  floatDelay,
}: MacWindowProps) => {
  const reduceMotion = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)
  const [closed, setClosed] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    const box = boxRef.current
    const content = contentRef.current
    if (!box || !content) return
    const measure = () => setSize({ width: box.clientWidth, height: content.offsetHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    observer.observe(content)
    return () => observer.disconnect()
  }, [closed])

  const actions = {
    close: () => setClosed(true),
    minimize: () => setMinimized(true),
    zoom: () => setZoomed(z => !z),
  }

  // Each step waits for the one before it, in whichever direction we're going
  const timing = (duration: number, delay: number) => (reduceMotion ? { duration: 0 } : { duration, delay })
  const contentTiming = timing(STEP.fade, minimized ? 0 : STEP.fade + STEP.resize)
  const frameTiming = { ...timing(STEP.resize, STEP.fade), ease: "easeInOut" as const }
  const iconTiming = timing(STEP.fade, minimized ? STEP.fade + STEP.resize : 0)

  return (
    <AnimatePresence>
      {!closed && (
        <motion.div
          className={className}
          initial={false}
          animate={{ scale: zoomed ? ZOOM_SCALE : 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}>
          <div
            ref={boxRef}
            className="relative motion-safe:animate-float"
            style={{ height: size?.height, animationDelay: floatDelay }}>
            {/* Until measured, the frame sits in normal flow; then it's pinned to the corner
                it shrinks into, at its measured size */}
            <motion.div
              className={size ? `absolute bottom-0 ${minimizeTo === "left" ? "left-0" : "right-0"}` : "relative"}
              initial={false}
              animate={
                size
                  ? minimized
                    ? { width: TILE, height: TILE, x: minimizedShift }
                    : { width: size.width, height: size.height, x: 0 }
                  : undefined
              }
              transition={frameTiming}>
              <GlassCard className="h-full w-full shadow-2xl">
                <motion.div
                  ref={contentRef}
                  style={{ width: size?.width, pointerEvents: minimized ? "none" : undefined }}
                  initial={false}
                  animate={{ opacity: minimized ? 0 : 1 }}
                  transition={contentTiming}>
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
                  {children}
                </motion.div>
                <motion.button
                  type="button"
                  tabIndex={-1}
                  title={minimizedLabel}
                  onClick={() => setMinimized(false)}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ pointerEvents: minimized ? "auto" : "none" }}
                  initial={false}
                  animate={{ opacity: minimized ? 1 : 0 }}
                  transition={iconTiming}>
                  {minimizedIcon}
                </motion.button>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MacWindow
