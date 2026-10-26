"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

// React 19's set-state-in-effect rule rejects the `useEffect(() => setX(true), [])`
// pattern, so both hooks below read their value through useSyncExternalStore: the
// server snapshot is the SSR value and the client snapshot is the real one.

const subscribeNever = () => () => {}

// False while rendering on the server, true once hydrated — portals need this,
// since document does not exist during SSR.
export const useIsMounted = () =>
  useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )

const HOVER_QUERY = "(hover: hover)"

const subscribeHover = (onChange: () => void) => {
  const query = window.matchMedia(HOVER_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

// True when the device supports real hover (desktop); false on touch screens.
// Assumes hover on the server so the desktop markup renders first.
export const useCanHover = () =>
  useSyncExternalStore(
    subscribeHover,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => true,
  )

// Seconds for each step of the typing loop
export interface TypingTiming {
  typeChar: number
  deleteChar: number
  holdFull: number
  holdEmpty: number
}

// Types `text` out, holds, backspaces, holds empty, and repeats while `active`. Each step
// schedules the next: setState only runs inside the timeout, never synchronously in the
// effect. Returns the part of the text typed so far.
export const useTypingLoop = (text: string, active: boolean, timing: TypingTiming) => {
  const [count, setCount] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const { typeChar, deleteChar, holdFull, holdEmpty } = timing

  useEffect(() => {
    if (!active) return

    let wait = typeChar
    let next = () => setCount(c => c + 1)
    if (!deleting && count === text.length) {
      wait = holdFull
      next = () => setDeleting(true)
    } else if (deleting && count === 0) {
      wait = holdEmpty
      next = () => setDeleting(false)
    } else if (deleting) {
      wait = deleteChar
      next = () => setCount(c => c - 1)
    } else if (count === 0) {
      wait = holdEmpty
    }

    const id = setTimeout(next, wait * 1000)
    return () => clearTimeout(id)
  }, [active, count, deleting, text.length, typeChar, deleteChar, holdFull, holdEmpty])

  return text.slice(0, count)
}
