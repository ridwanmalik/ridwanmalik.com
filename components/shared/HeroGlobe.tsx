import { geoContains, geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import type { Topology, GeometryCollection } from "topojson-specification"
import type { Feature, FeatureCollection } from "geojson"
import countriesTopo from "world-atlas/countries-110m.json"
import landTopo from "world-atlas/land-110m.json"
import GlobeSpotlight from "@/components/shared/GlobeSpotlight"

// Local constants - home base and the places the arcs fly to
const HOME = { name: "Jashore", coords: [89.21, 23.17] as [number, number], countryId: "050" }

const DESTINATIONS: [number, number][] = [
  [55.27, 25.2], // Dubai
  [103.82, 1.35], // Singapore
  [139.69, 35.69], // Tokyo
  [151.21, -33.87], // Sydney
  [-0.13, 51.51], // London
]

// Seconds between each route's pulse (and each city's ping), so they don't fire together
const ROUTE_STAGGER = 0.6

// Resting brightness of the whole globe; dots under the cursor go above it
const GLOBE_OPACITY = 0.4

const DOTS_ID = "hero-globe-dots"

// Degrees between land dots. Smaller = denser map but more SVG to send.
const DOT_SPACING = 1.6

// Projected once at module load (server only), so the browser just gets SVG paths
const GLOBE = (() => {
  const size = 400
  const radius = 190
  const center: [number, number] = [HOME.coords[0] - 10, HOME.coords[1] - 5]
  const projection = geoOrthographic()
    .scale(radius)
    .translate([size / 2, size / 2])
    .rotate([-center[0], -center[1]])
    .clipAngle(90)
    .precision(0.5)
  const path = geoPath(projection).digits(1)

  const countryTopology = countriesTopo as unknown as Topology<{ countries: GeometryCollection }>
  const countries = feature(countryTopology, countryTopology.objects.countries) as FeatureCollection
  const homeCountry = countries.features.find(country => String(country.id) === HOME.countryId)
  const landTopology = landTopo as unknown as Topology<{ land: GeometryCollection }>
  const land = feature(landTopology, landTopology.objects.land) as FeatureCollection

  const isVisible = (coords: [number, number]) => {
    const [x, y] = projection(coords) ?? [0, 0]
    return path({ type: "Point", coordinates: coords }) ? { x: +x.toFixed(1), y: +y.toFixed(1) } : null
  }

  // Walk a near-equal-area grid over the visible hemisphere and keep the points on land.
  // Each dot becomes a near-zero-length segment, drawn as a round-capped stroke, so thousands of dots stay
  // a single compact path.
  const landDots: string[] = []
  const homeDots: string[] = []
  const onFeature = (target: Feature | undefined, point: [number, number]) => !!target && geoContains(target, point)
  for (let lat = -84; lat <= 84; lat += DOT_SPACING) {
    const lonStep = DOT_SPACING / Math.cos((lat * Math.PI) / 180)
    for (let lon = -180; lon < 180; lon += lonStep) {
      const point: [number, number] = [lon, lat]
      if (geoDistance(point, center) > Math.PI / 2 - 0.02) continue
      if (!land.features.some(shape => geoContains(shape, point))) continue
      const [x, y] = projection(point) ?? [0, 0]
      // h0.1 rather than h0: some renderers drop zero-length segments entirely
      const dot = `M${x.toFixed(1)} ${y.toFixed(1)}h.1`
      if (onFeature(homeCountry, point)) homeDots.push(dot)
      else landDots.push(dot)
    }
  }

  return {
    size,
    radius,
    graticule: path(geoGraticule10()) ?? "",
    landDots: landDots.join(""),
    homeDots: homeDots.join(""),
    routes: DESTINATIONS.map(to => path({ type: "LineString", coordinates: [HOME.coords, to] }) ?? "").filter(Boolean),
    points: [HOME.coords, ...DESTINATIONS].map(isVisible).filter((p): p is { x: number; y: number } => p !== null),
    home: isVisible(HOME.coords),
  }
})()

const HeroGlobe = ({ className }: { className?: string }) => (
  // Only the sphere itself takes the mouse, so the empty corners of the SVG box don't
  // trigger the spotlight
  <svg viewBox={`0 0 ${GLOBE.size} ${GLOBE.size}`} className={`pointer-events-none ${className ?? ""}`}>
    <defs>
      <radialGradient id="hero-globe-shade" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="currentColor" stopOpacity={0.12} />
        <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
      </radialGradient>
    </defs>
    {/* Everything at the globe's resting brightness; the spotlight below sits outside
        this group so the dots under the cursor can go brighter than the rest */}
    <g opacity={GLOBE_OPACITY}>
      <circle
        cx={GLOBE.size / 2}
        cy={GLOBE.size / 2}
        r={GLOBE.radius}
        fill="url(#hero-globe-shade)"
        stroke="currentColor"
        strokeOpacity={0.35}
        className="pointer-events-auto"
      />
      <path d={GLOBE.graticule} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} />
      {/* Stroke set on the group, not the path, so GlobeSpotlight's <use> can restyle it */}
      <g stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.3} strokeLinecap="round">
        <path id={DOTS_ID} d={GLOBE.landDots} />
      </g>
      <path d={GLOBE.homeDots} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      {GLOBE.routes.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="currentColor" strokeWidth={0.8} strokeOpacity={0.35} strokeDasharray="3 3" />
          {/* A glowing pulse that travels out from home along the route */}
          <path
            d={d}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray="0.2 1"
            strokeDashoffset={0.2}
            className="motion-safe:animate-route"
            style={{ animationDelay: `${i * ROUTE_STAGGER}s` }}
          />
        </g>
      ))}
      {GLOBE.points.map(({ x, y }, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={2} fill="currentColor" />
          <circle
            cx={x}
            cy={y}
            r={3}
            fill="none"
            stroke="currentColor"
            className="motion-safe:animate-ping origin-center [transform-box:fill-box]"
            style={{ animationDuration: "2.5s", animationDelay: `${i * ROUTE_STAGGER}s` }}
          />
        </g>
      ))}
      {GLOBE.home && (
        <circle cx={GLOBE.home.x} cy={GLOBE.home.y} r={6} fill="none" stroke="currentColor" strokeWidth={1}>
          <animate attributeName="r" values="3;9;3" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="1;0;1" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
    <GlobeSpotlight dotsId={DOTS_ID} />
  </svg>
)

export default HeroGlobe
