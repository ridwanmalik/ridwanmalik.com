"use client"

import { useEffect, useRef } from "react"
import { animate, useInView, useReducedMotion } from "motion/react"

interface CountUpProps {
  value: string
  delay?: number
}

const NUMBER_PATTERN = /-?\d+(?:\.\d+)?/

const CountUp = ({ value, delay = 0 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const match = value.match(NUMBER_PATTERN)
    if (!match || match.index === undefined) {
      element.textContent = value
      return
    }

    if (!inView && !reduceMotion) return

    const prefix = value.slice(0, match.index)
    const numericPart = match[0]
    const suffix = value.slice(match.index + numericPart.length)
    const target = Number(numericPart)
    const decimals = numericPart.includes(".") ? numericPart.split(".")[1].length : 0
    const format = (current: number) => (decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString())

    if (reduceMotion) {
      element.textContent = `${prefix}${numericPart}${suffix}`
      return
    }

    const controls = animate(0, target, {
      duration: 1.2,
      delay,
      ease: "easeOut",
      onUpdate: latest => {
        element.textContent = `${prefix}${format(latest)}${suffix}`
      },
      onComplete: () => {
        element.textContent = `${prefix}${numericPart}${suffix}`
      },
    })

    return () => controls.stop()
  }, [delay, inView, reduceMotion, value])

  return <span ref={ref}>{value}</span>
}

export default CountUp
