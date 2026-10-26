"use client"

import { useEffect, useRef } from "react"

// Dots within this many SVG units of the cursor light up, strongest at the centre
const SPOTLIGHT = {
  radius: 60,
  dotWidth: 2.4,
  fadeMs: 300,
}

interface GlobeSpotlightProps {
  // id of the dots <path> to redraw under the cursor; it must not set its own stroke
  // attributes, so this <use> can draw it brighter and bigger
  dotsId: string
}

// A brighter, larger copy of the land dots, masked to a soft circle that follows the
// mouse. The copy is a <use> of the existing path, so no dot data is sent twice, and the
// cursor position is written straight to the DOM, so moving the mouse never re-renders.
const GlobeSpotlight = ({ dotsId }: GlobeSpotlightProps) => {
  const circleRef = useRef<SVGCircleElement>(null)
  const maskId = `${dotsId}-spotlight`

  useEffect(() => {
    const circle = circleRef.current
    const svg = circle?.ownerSVGElement
    if (!circle || !svg) return

    const handleMove = (event: PointerEvent) => {
      const matrix = svg.getScreenCTM()
      if (!matrix) return
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
      circle.setAttribute("cx", point.x.toFixed(1))
      circle.setAttribute("cy", point.y.toFixed(1))
      circle.style.opacity = "1"
    }
    const handleLeave = () => {
      circle.style.opacity = "0"
    }

    svg.addEventListener("pointermove", handleMove)
    svg.addEventListener("pointerleave", handleLeave)
    return () => {
      svg.removeEventListener("pointermove", handleMove)
      svg.removeEventListener("pointerleave", handleLeave)
    }
  }, [])

  return (
    <>
      <defs>
        <radialGradient id={`${maskId}-fade`}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id={maskId}>
          <circle
            ref={circleRef}
            r={SPOTLIGHT.radius}
            cx={-SPOTLIGHT.radius}
            cy={-SPOTLIGHT.radius}
            fill={`url(#${maskId}-fade)`}
            style={{ opacity: 0, transition: `opacity ${SPOTLIGHT.fadeMs}ms ease-out` }}
          />
        </mask>
      </defs>
      <use
        href={`#${dotsId}`}
        mask={`url(#${maskId})`}
        stroke="currentColor"
        strokeWidth={SPOTLIGHT.dotWidth}
        strokeLinecap="round"
      />
    </>
  )
}

export default GlobeSpotlight
