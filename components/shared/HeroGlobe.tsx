"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// The globe's code (with d3-geo) is its own chunk, fetched only when it's about to show
const InteractiveGlobe = dynamic(() => import("@/components/shared/InteractiveGlobe"), { ssr: false })

// Fallback for browsers without requestIdleCallback (Safari)
const IDLE_FALLBACK_MS = 300

// Loads the interactive globe last: only after the page has fully loaded and the browser is
// idle, so its code and dot data never compete with the hero text and photo. Until then it
// holds the same square space, so nothing shifts when it appears.
const HeroGlobe = ({ className }: { className?: string }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const whenIdle = () => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(() => setReady(true))
      else timeoutId = setTimeout(() => setReady(true), IDLE_FALLBACK_MS)
    }

    if (document.readyState === "complete") whenIdle()
    else window.addEventListener("load", whenIdle, { once: true })

    return () => {
      window.removeEventListener("load", whenIdle)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      clearTimeout(timeoutId)
    }
  }, [])

  return ready ? <InteractiveGlobe className={className} /> : <div className={`aspect-square ${className ?? ""}`} />
}

export default HeroGlobe
