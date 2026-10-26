"use client"

import { useEffect, useRef, useState } from "react"
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { MapPin, X } from "lucide-react"
import type { LonLat } from "@/lib/globe-config"
import {
  GLOBE_COUNTRIES_URL,
  GLOBE_DOTS_SCALE,
  GLOBE_DOTS_URL,
  GLOBE_HOME,
  GLOBE_INITIAL_CENTER,
  GLOBE_ROUTES,
} from "@/lib/globe-config"

type Vec3 = [number, number, number]

// Drawing space: everything is laid out in a 400×400 box and scaled to the canvas size
const SIZE = 400
const RADIUS = 190
const CENTER = SIZE / 2

// Accent colour (custom-accent #7CFAD6) as an rgb triple for rgba()
const RGB = "124, 250, 214"

// Resting brightness of the whole globe; dots under the cursor go above it
const REST = 0.4

const DOT = {
  land: { radius: 0.65, alpha: 0.85 * REST },
  home: { radius: 0.8, alpha: REST },
  lit: { radius: 1.2, alpha: 1 },
}

// Dots within this many units of the cursor light up, strongest at the centre
const SPOTLIGHT_RADIUS = 60

const DRAG = {
  degreesPerUnit: 0.3,
  tiltLimit: 70,
  // Momentum after letting go: velocity is multiplied by this every frame
  friction: 0.92,
}

// Seconds. Pulses travel out from home along each route, and each city pings, staggered.
const ROUTE = { period: 3, stagger: 0.6, length: 0.2, samples: 64 }
const PING_PERIOD = 2.5
const HOME_PULSE_PERIOD = 3

const rgba = (alpha: number) => `rgba(${RGB}, ${alpha})`

const toVec = ([lon, lat]: LonLat): Vec3 => {
  const l = (lon * Math.PI) / 180
  const p = (lat * Math.PI) / 180
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)]
}

const toLonLat = ([x, y, z]: Vec3): LonLat => {
  const length = Math.hypot(x, y, z)
  return [(Math.atan2(y, x) * 180) / Math.PI, (Math.asin(z / length) * 180) / Math.PI]
}

// Samples a route as `count` + 1 points from its first stop to its last.
// Two stops: the plain great-circle arc. With waypoints: a Catmull-Rom spline through all
// the stops in 3D, pushed back onto the sphere, so the line bends smoothly through each
// waypoint instead of turning a corner there (as chained great circles would).
const sampleRoute = (stops: LonLat[], count: number): LonLat[] => {
  if (stops.length === 2) {
    const interpolate = geoInterpolate(stops[0], stops[1])
    return Array.from({ length: count + 1 }, (_, k) => interpolate(k / count) as LonLat)
  }

  const v = stops.map(toVec)
  const padded = [v[0], ...v, v[v.length - 1]]
  const lengths = stops.slice(1).map((stop, i) => geoDistance(stops[i], stop))
  const total = lengths.reduce((sum, length) => sum + length, 0)
  const points: LonLat[] = [stops[0]]

  lengths.forEach((length, i) => {
    const [p0, p1, p2, p3] = padded.slice(i, i + 4)
    // Points spread in proportion to each segment's length, so the pulse keeps an even pace
    const steps = Math.max(4, Math.round((count * length) / total))
    for (let k = 1; k <= steps; k++) {
      const t = k / steps
      const t2 = t * t
      const t3 = t2 * t
      const at = (axis: 0 | 1 | 2) =>
        0.5 *
        (2 * p1[axis] +
          (p2[axis] - p0[axis]) * t +
          (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2 +
          (3 * p1[axis] - p0[axis] - 3 * p2[axis] + p3[axis]) * t3)
      points.push(toLonLat([at(0), at(1), at(2)]))
    }
  })
  return points
}

// Unpacks the Int16Array from /globe-dots (layout documented in lib/globe-config.ts)
const decodeDots = (buffer: ArrayBuffer) => {
  const data = new Int16Array(buffer)
  const read = (from: number, count: number): LonLat[] =>
    Array.from({ length: count }, (_, i) => [
      data[from + i * 2] / GLOBE_DOTS_SCALE,
      data[from + i * 2 + 1] / GLOBE_DOTS_SCALE,
    ])
  const landCount = data[0]
  const homeCount = data[1]
  return { land: read(2, landCount), homeLand: read(2 + landCount * 2, homeCount) }
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

const home = GLOBE_HOME.coords
const routeList = GLOBE_ROUTES
const initialCenter = GLOBE_INITIAL_CENTER

// Fetched and decoded once, then shared by every canvas (the inline globe and the expanded one)
let dotsPromise: Promise<ReturnType<typeof decodeDots>> | null = null
const loadDots = () => {
  dotsPromise ??= fetch(GLOBE_DOTS_URL)
    .then(response => response.arrayBuffer())
    .then(decodeDots)
  return dotsPromise
}

// Each dot's country, for the click-to-identify label. Only the expanded globe asks for it.
type CountryData = { names: string[]; ids: number[] }
let countriesPromise: Promise<CountryData> | null = null
const loadCountries = () => {
  countriesPromise ??= fetch(GLOBE_COUNTRIES_URL).then(response => response.json() as Promise<CountryData>)
  return countriesPromise
}

// What a click on the expanded globe reports: a city (with an optional note line) or a country
type GlobePick = { title: string; note?: string }

// Clicks this close (in drawing units) to a city or dot pick it; a press that moves further
// than DRAG_THRESHOLD is a drag, not a click
const PICK_RADIUS = { city: 8, dot: 6 }
const DRAG_THRESHOLD = 3

interface GlobeCanvasProps {
  className?: string
  // Shared, mutable [λ, φ]: both canvases read and write it, so they always show the same view
  rotation: LonLat
  // Fade in once the data is drawn (off for the expanded copy, which must appear at once)
  fadeIn?: boolean
  // When set, clicking a dot reports its city or country (null for empty space) and rings it
  onPick?: (pick: GlobePick | null) => void
}

// A dotted globe on a canvas that can be dragged to spin (with momentum). Dots near the
// cursor light up, pulses travel from home to each destination, and the cities ping.
// It redraws every frame only while it's on screen.
const GlobeCanvas = ({ className = "", rotation, fadeIn = true, onPick }: GlobeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let cancelled = false
    let teardown = () => {}

    const setup = (land: LonLat[], homeLand: LonLat[]) => {
      const landDots = land.map(p => ({ p, v: toVec(p) }))
      const homeDots = homeLand.map(p => ({ p, v: toVec(p) }))
      const cities = [home, ...routeList.map(route => route.to)].map(p => ({ p, v: toVec(p) }))
      const routes = routeList.map(({ to, via = [] }) =>
        sampleRoute([home, ...via, to], ROUTE.samples).map(p => ({ p, v: toVec(p) }))
      )
      const graticule = geoGraticule10()

      const projection = geoOrthographic().scale(RADIUS).translate([CENTER, CENTER]).clipAngle(90).precision(0.5)
      const path = geoPath(projection, ctx)

      // rotation = [λ, φ]; the point facing the viewer is (−λ, −φ)
      const velocity = { x: 0, y: 0 }
      const pointer = { x: 0, y: 0, over: false, dragging: false }
      // Where the current press started, and whether it has moved far enough to be a drag
      const press = { x: 0, y: 0, moved: false }
      // The clicked point, ringed on the globe so it stays marked as the globe turns
      let selected: LonLat | null = null
      let countries: CountryData | null = null
      if (onPick) loadCountries().then(data => (countries = data))
      const cityPicks: GlobePick[] = [
        { title: GLOBE_HOME.label, note: GLOBE_HOME.note },
        ...routeList.map(route => ({ title: route.label, note: route.note })),
      ]

      // Finds the city, or failing that the land dot, nearest the click
      const pick = () => {
        projection.rotate(rotation)
        const c = toVec([-rotation[0], -rotation[1]])
        const distanceTo = (dot: { p: LonLat; v: Vec3 }) => {
          if (dot.v[0] * c[0] + dot.v[1] * c[1] + dot.v[2] * c[2] <= 0) return Infinity
          const [x, y] = projection(dot.p) as [number, number]
          return Math.hypot(x - pointer.x, y - pointer.y)
        }
        const nearest = (dots: { p: LonLat; v: Vec3 }[]) =>
          dots.reduce(
            (best, dot, index) => {
              const distance = distanceTo(dot)
              return distance < best.distance ? { index, distance } : best
            },
            { index: -1, distance: Infinity }
          )

        const city = nearest(cities)
        if (city.distance <= PICK_RADIUS.city) {
          selected = cities[city.index].p
          return cityPicks[city.index]
        }
        const allDots = [...landDots, ...homeDots]
        const dot = nearest(allDots)
        const country = countries?.names[countries.ids[dot.index]]
        if (dot.distance <= PICK_RADIUS.dot && country) {
          selected = allDots[dot.index].p
          return { title: country }
        }
        selected = null
        return null
      }
      let scale = 1
      let frame = 0
      let running = false

      const resize = () => {
        const width = canvas.clientWidth
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(width * dpr)
        scale = (width * dpr) / SIZE
      }

      const draw = (now: number) => {
        const t = now / 1000
        if (!pointer.dragging && (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.y) > 0.01)) {
          rotation[0] += velocity.x
          rotation[1] = Math.max(-DRAG.tiltLimit, Math.min(DRAG.tiltLimit, rotation[1] + velocity.y))
          velocity.x *= DRAG.friction
          velocity.y *= DRAG.friction
        }
        projection.rotate(rotation)
        const c = toVec([-rotation[0], -rotation[1]])
        const facing = (v: Vec3) => v[0] * c[0] + v[1] * c[1] + v[2] * c[2]
        const project = (p: LonLat) => projection(p) as [number, number]

        ctx.setTransform(scale, 0, 0, scale, 0, 0)
        ctx.clearRect(0, 0, SIZE, SIZE)

        // Sphere: soft shading and outline
        const shade = ctx.createRadialGradient(SIZE * 0.35, SIZE * 0.3, 0, SIZE * 0.35, SIZE * 0.3, RADIUS * 1.6)
        shade.addColorStop(0, rgba(0.12 * REST))
        shade.addColorStop(1, rgba(0))
        ctx.beginPath()
        ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = shade
        ctx.fill()
        ctx.lineWidth = 1
        ctx.strokeStyle = rgba(0.35 * REST)
        ctx.stroke()

        ctx.beginPath()
        path(graticule)
        ctx.lineWidth = 0.5
        ctx.strokeStyle = rgba(0.12 * REST)
        ctx.stroke()

        // Land dots: the resting ones in one batch, the ones near the cursor one by one
        const lit: { x: number; y: number; k: number }[] = []
        ctx.beginPath()
        for (const dot of landDots) {
          if (facing(dot.v) <= 0.02) continue
          const [x, y] = project(dot.p)
          const k = pointer.over ? 1 - Math.hypot(x - pointer.x, y - pointer.y) / SPOTLIGHT_RADIUS : 0
          if (k > 0) {
            lit.push({ x, y, k })
            continue
          }
          ctx.moveTo(x + DOT.land.radius, y)
          ctx.arc(x, y, DOT.land.radius, 0, Math.PI * 2)
        }
        ctx.fillStyle = rgba(DOT.land.alpha)
        ctx.fill()
        for (const { x, y, k } of lit) {
          ctx.beginPath()
          ctx.arc(x, y, DOT.land.radius + k * (DOT.lit.radius - DOT.land.radius), 0, Math.PI * 2)
          ctx.fillStyle = rgba(DOT.land.alpha + k * (DOT.lit.alpha - DOT.land.alpha))
          ctx.fill()
        }

        ctx.beginPath()
        for (const dot of homeDots) {
          if (facing(dot.v) <= 0.02) continue
          const [x, y] = project(dot.p)
          ctx.moveTo(x + DOT.home.radius, y)
          ctx.arc(x, y, DOT.home.radius, 0, Math.PI * 2)
        }
        ctx.fillStyle = rgba(DOT.home.alpha)
        ctx.fill()

        // Routes: a faint dashed great circle, plus a pulse travelling along it
        ctx.lineCap = "round"
        routes.forEach((samples, i) => {
          const points = samples.map(s => (facing(s.v) > 0 ? project(s.p) : null))
          const last = points.length - 1
          const strokeRange = (from: number, to: number) => {
            ctx.beginPath()
            let drawing = false
            for (let k = Math.max(0, Math.floor(from)); k <= Math.min(last, Math.ceil(to)); k++) {
              const pt = points[k]
              if (!pt) {
                drawing = false
                continue
              }
              if (drawing) ctx.lineTo(pt[0], pt[1])
              else ctx.moveTo(pt[0], pt[1])
              drawing = true
            }
            ctx.stroke()
          }

          ctx.setLineDash([3, 3])
          ctx.lineWidth = 0.8
          ctx.strokeStyle = rgba(0.35 * REST)
          strokeRange(0, last)
          ctx.setLineDash([])

          if (!reduceMotion) {
            const phase = ((((t - i * ROUTE.stagger) / ROUTE.period) % 1) + 1) % 1
            const head = -ROUTE.length + (1 + ROUTE.length) * easeInOut(phase)
            ctx.lineWidth = 1.6
            ctx.strokeStyle = rgba(REST)
            strokeRange(head * last, (head + ROUTE.length) * last)
          }
        })

        // Cities: a dot each, a ping ring, and a slower pulse around home
        cities.forEach((city, i) => {
          if (facing(city.v) <= 0) return
          const [x, y] = project(city.p)
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fillStyle = rgba(REST)
          ctx.fill()
          if (reduceMotion) return
          const ping = ((((t - i * ROUTE.stagger) / PING_PERIOD) % 1) + 1) % 1
          ctx.beginPath()
          ctx.arc(x, y, 3 * (1 + ping), 0, Math.PI * 2)
          ctx.lineWidth = 1
          ctx.strokeStyle = rgba((1 - ping) * REST)
          ctx.stroke()
          if (i === 0) {
            const phase = (t / HOME_PULSE_PERIOD) % 1
            const swell = phase < 0.5 ? phase * 2 : (1 - phase) * 2
            ctx.beginPath()
            ctx.arc(x, y, 3 + 6 * swell, 0, Math.PI * 2)
            ctx.strokeStyle = rgba((1 - swell) * REST)
            ctx.stroke()
          }
        })

        // The clicked dot: a solid accent ring
        if (selected && facing(toVec(selected)) > 0) {
          const [x, y] = project(selected)
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.lineWidth = 1.2
          ctx.strokeStyle = rgba(1)
          ctx.stroke()
        }

        frame = requestAnimationFrame(draw)
      }

      // Pointer position in the 400×400 drawing space
      const locate = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width) * SIZE
        pointer.y = ((event.clientY - rect.top) / rect.height) * SIZE
        pointer.over = Math.hypot(pointer.x - CENTER, pointer.y - CENTER) <= RADIUS
      }

      const handleMove = (event: PointerEvent) => {
        const lastX = pointer.x
        const lastY = pointer.y
        locate(event)
        if (pointer.dragging) {
          if (Math.hypot(pointer.x - press.x, pointer.y - press.y) > DRAG_THRESHOLD) press.moved = true
          velocity.x = (pointer.x - lastX) * DRAG.degreesPerUnit
          velocity.y = -(pointer.y - lastY) * DRAG.degreesPerUnit
          rotation[0] += velocity.x
          rotation[1] = Math.max(-DRAG.tiltLimit, Math.min(DRAG.tiltLimit, rotation[1] + velocity.y))
        }
        canvas.style.cursor = pointer.dragging ? "grabbing" : pointer.over ? "grab" : "default"
      }

      const handleDown = (event: PointerEvent) => {
        locate(event)
        if (!pointer.over) {
          // A click off the globe clears the label
          if (onPick) {
            selected = null
            onPick(null)
          }
          return
        }
        event.preventDefault()
        press.x = pointer.x
        press.y = pointer.y
        press.moved = false
        pointer.dragging = true
        velocity.x = 0
        velocity.y = 0
        canvas.setPointerCapture(event.pointerId)
        canvas.style.cursor = "grabbing"
      }

      const handleUp = (event: PointerEvent) => {
        if (pointer.dragging && !press.moved && onPick) onPick(pick())
        pointer.dragging = false
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
        canvas.style.cursor = pointer.over ? "grab" : "default"
      }

      const handleLeave = () => {
        if (!pointer.dragging) pointer.over = false
      }

      const start = () => {
        if (running) return
        running = true
        frame = requestAnimationFrame(draw)
      }
      const stop = () => {
        running = false
        cancelAnimationFrame(frame)
      }

      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvas)
      // Only animate while the globe is on screen
      const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
      visibility.observe(canvas)

      canvas.addEventListener("pointermove", handleMove)
      canvas.addEventListener("pointerdown", handleDown)
      canvas.addEventListener("pointerup", handleUp)
      canvas.addEventListener("pointercancel", handleUp)
      canvas.addEventListener("pointerleave", handleLeave)
      canvas.style.opacity = "1"

      return () => {
        stop()
        resizeObserver.disconnect()
        visibility.disconnect()
        canvas.removeEventListener("pointermove", handleMove)
        canvas.removeEventListener("pointerdown", handleDown)
        canvas.removeEventListener("pointerup", handleUp)
        canvas.removeEventListener("pointercancel", handleUp)
        canvas.removeEventListener("pointerleave", handleLeave)
      }
    }

    loadDots()
      .then(({ land, homeLand }) => {
        if (!cancelled) teardown = setup(land, homeLand)
      })
      // Decorative: if the data can't load, the globe simply doesn't appear
      .catch(() => {})

    return () => {
      cancelled = true
      teardown()
    }
  }, [reduceMotion, rotation, onPick])

  // With fadeIn, the canvas starts transparent and setup() fades it in once drawn
  return (
    <canvas
      ref={canvasRef}
      className={`block aspect-square touch-none ${fadeIn ? "opacity-0 transition-opacity duration-700" : ""} ${className}`}
    />
  )
}

interface Box {
  x: number
  y: number
  size: number
}

// Expanded globe: this share of the smaller side of the window
const EXPANDED_SHARE = 0.92
const EXPAND_TRANSITION = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }

// Shown in the top-left panel until a dot is clicked
const LABEL_HINT = "Click a dot to see where it is"
const CLOSE_LABEL = "Close globe"

// The hero globe. Double-click grows it from where it sits to fill the window while the
// page fades away behind it; double-click again (or Esc) shrinks it back as the page
// returns. This is drawn in the page rather than with the browser's Fullscreen API,
// because that switch is instant and can't be animated.
//
// The expanded globe is a second canvas in a portal (the hero clips anything that grows
// past it). It starts exactly over the inline one and animates with a transform, sharing
// the same rotation, so the swap is invisible.
const InteractiveGlobe = ({ className }: { className?: string }) => {
  const inlineRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [rotation] = useState<LonLat>(() => [-initialCenter[0], -initialCenter[1]])
  const [expanded, setExpanded] = useState(false)
  // The inline globe stays hidden until the shrink-back animation has finished
  const [inlineHidden, setInlineHidden] = useState(false)
  const [boxes, setBoxes] = useState<{ from: Box; to: Box } | null>(null)
  // Name of the clicked dot in the expanded view (null shows the hint)
  const [label, setLabel] = useState<GlobePick | null>(null)

  const open = () => {
    setLabel(null)
    const rect = inlineRef.current?.getBoundingClientRect()
    if (!rect) return
    const size = Math.min(window.innerWidth, window.innerHeight) * EXPANDED_SHARE
    setBoxes({
      from: { x: rect.left, y: rect.top, size: rect.width },
      to: { x: (window.innerWidth - size) / 2, y: (window.innerHeight - size) / 2, size },
    })
    setInlineHidden(true)
    setExpanded(true)
  }

  const close = () => setExpanded(false)

  useEffect(() => {
    if (!expanded) return
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && setExpanded(false)
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [expanded])

  const transition = reduceMotion ? { duration: 0 } : EXPAND_TRANSITION
  // Where the expanded globe starts and ends: exactly over the inline one
  const collapsed = boxes && {
    x: boxes.from.x - boxes.to.x,
    y: boxes.from.y - boxes.to.y,
    scale: boxes.from.size / boxes.to.size,
  }

  return (
    <>
      <div ref={inlineRef} className={className} onDoubleClick={open}>
        <GlobeCanvas rotation={rotation} className={`w-full ${inlineHidden ? "invisible" : ""}`} />
      </div>
      {createPortal(
        <AnimatePresence onExitComplete={() => setInlineHidden(false)}>
          {expanded && boxes && collapsed && (
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[100] bg-oxford-blue bg-glowing-blue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              onDoubleClick={close}
            />
          )}
          {expanded && boxes && collapsed && (
            <motion.div
              key="globe"
              className="fixed z-[101] origin-top-left"
              style={{ left: boxes.to.x, top: boxes.to.y, width: boxes.to.size }}
              initial={collapsed}
              animate={{ x: 0, y: 0, scale: 1 }}
              exit={collapsed}
              transition={transition}
              onDoubleClick={close}>
              <GlobeCanvas rotation={rotation} fadeIn={false} className="w-full" onPick={setLabel} />
            </motion.div>
          )}
          {expanded && (
            <motion.div
              key="label"
              className="fixed left-6 top-6 z-[102] flex max-w-xs items-start gap-2 rounded-lg border border-white/10 bg-oxford-blue/60 bg-gradient-to-br from-white/[0.06] to-transparent px-4 py-2.5 font-mono text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={transition}>
              {/* items-start + mt-0.5 keep the pin level with the first line, not centred on the block */}
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-custom-accent" strokeWidth={1.75} />
              {label ? (
                <span className="flex flex-col">
                  <span className="text-custom-foreground">{label.title}</span>
                  {label.note && (
                    <span className="mt-1 text-xs leading-relaxed text-custom-secondary">{label.note}</span>
                  )}
                </span>
              ) : (
                <span className="text-custom-secondary">{LABEL_HINT}</span>
              )}
            </motion.div>
          )}
          {expanded && (
            <motion.button
              key="close"
              type="button"
              onClick={close}
              aria-label={CLOSE_LABEL}
              title={CLOSE_LABEL}
              className="fixed right-6 top-6 z-[102] flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-oxford-blue/60 bg-gradient-to-br from-white/[0.06] to-transparent text-custom-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors hover:border-custom-accent/50 hover:text-custom-accent"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={transition}>
              <X className="h-5 w-5" strokeWidth={1.75} />
            </motion.button>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export default InteractiveGlobe
