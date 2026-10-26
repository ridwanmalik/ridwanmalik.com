"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import GlassCard from "@/components/shared/GlassCard"
import { useTypingLoop } from "@/lib/hooks"

// Local constants - a light-hearted "what I'm up to" line, typed out like the resume name
const STATUS = "Playing with code"

// Seconds, same rhythm as the name on the resume sheet
const TYPING = {
  typeChar: 0.08,
  deleteChar: 0.04,
  holdFull: 2.5,
  holdEmpty: 0.5,
}

interface StatusCardProps {
  // Placement; goes on the outer wrapper that runs the close animation, while the float
  // drift runs on the inner card (same split as MacWindow)
  className?: string
  floatDelay?: string
}

// Clicking the card dismisses it until the page reloads, like the mac windows' red button
const StatusCard = ({ className = "", floatDelay }: StatusCardProps) => {
  const reduceMotion = useReducedMotion()
  const [closed, setClosed] = useState(false)
  const typed = useTypingLoop(STATUS, !reduceMotion && !closed, TYPING)

  return (
    <AnimatePresence>
      {!closed && (
        <motion.div
          className={className}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}>
          <GlassCard className="shadow-2xl motion-safe:animate-float" style={{ animationDelay: floatDelay }}>
            <button type="button" tabIndex={-1} onClick={() => setClosed(true)} className="block px-3.5 py-2 text-left">
              <span className="flex items-center gap-2 text-[13px] text-custom-foreground whitespace-nowrap">
                <span className="relative flex w-1.5 h-1.5 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-[#28C840] motion-safe:animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-[#28C840]" />
                </span>
                {/* The full line sits invisibly underneath, so the card keeps its width while typing */}
                <span className="grid">
                  <span className="invisible col-start-1 row-start-1 pr-2">{STATUS}</span>
                  <span className="col-start-1 row-start-1">
                    {reduceMotion ? STATUS : typed}
                    <span className="inline-block w-[2px] h-[1em] ml-0.5 align-[-0.15em] bg-custom-accent motion-safe:animate-blink" />
                  </span>
                </span>
              </span>
            </button>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StatusCard
