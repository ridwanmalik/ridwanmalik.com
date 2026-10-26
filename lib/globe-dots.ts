import { geoBounds, geoContains } from "d3-geo"
import { feature } from "topojson-client"
import type { Topology, GeometryCollection } from "topojson-specification"
import type { Feature, FeatureCollection } from "geojson"
import countriesTopo from "world-atlas/countries-110m.json"
import landTopo from "world-atlas/land-110m.json"
import { GLOBE_DOTS_SCALE, GLOBE_HOME } from "@/lib/globe-config"

// Degrees between land dots. Smaller = denser map but more data to send.
const DOT_SPACING = 1.6

type Country = { feature: Feature; name: string; bounds: [[number, number], [number, number]] }

// Cheap bounding-box test before the exact polygon test. A box whose west edge is east of
// its east edge wraps across the antimeridian (e.g. Russia, Fiji).
const inBounds = ([lon, lat]: [number, number], [[west, south], [east, north]]: Country["bounds"]) =>
  lat >= south && lat <= north && (west <= east ? lon >= west && lon <= east : lon >= west || lon <= east)

// Server only, computed once: walks a near-equal-area grid over the whole sphere, keeps the
// points that fall on land, and notes which country each one is in. The map data and
// topojson never reach the browser.
const build = () => {
  const countryTopology = countriesTopo as unknown as Topology<{ countries: GeometryCollection }>
  const countryFeatures = (feature(countryTopology, countryTopology.objects.countries) as FeatureCollection).features
  const countries: Country[] = countryFeatures.map(f => ({
    feature: f,
    name: String((f.properties as { name?: string } | null)?.name ?? ""),
    bounds: geoBounds(f),
  }))
  const homeIndex = countryFeatures.findIndex(f => String(f.id) === GLOBE_HOME.countryId)
  const landTopology = landTopo as unknown as Topology<{ land: GeometryCollection }>
  const land = feature(landTopology, landTopology.objects.land) as FeatureCollection

  const countryOf = (point: [number, number]) =>
    countries.findIndex(c => inBounds(point, c.bounds) && geoContains(c.feature, point))

  const landDots: number[] = []
  const landIds: number[] = []
  const homeDots: number[] = []
  for (let lat = -84; lat <= 84; lat += DOT_SPACING) {
    const lonStep = DOT_SPACING / Math.cos((lat * Math.PI) / 180)
    for (let lon = -180; lon < 180; lon += lonStep) {
      const point: [number, number] = [lon, lat]
      if (!land.features.some(shape => geoContains(shape, point))) continue
      const id = countryOf(point)
      const coords = [Math.round(lon * GLOBE_DOTS_SCALE), Math.round(lat * GLOBE_DOTS_SCALE)]
      if (id !== -1 && id === homeIndex) homeDots.push(...coords)
      else {
        landDots.push(...coords)
        landIds.push(id)
      }
    }
  }

  return {
    // Layout in lib/globe-config.ts: [landCount, homeCount, ...land, ...home], about 18 KB
    dots: Int16Array.from([landDots.length / 2, homeDots.length / 2, ...landDots, ...homeDots]),
    countries: {
      names: countries.map(c => c.name),
      ids: [...landIds, ...Array<number>(homeDots.length / 2).fill(homeIndex)],
    },
  }
}

let cached: ReturnType<typeof build> | null = null
const globeData = () => (cached ??= build())

export const buildGlobeDots = () => globeData().dots
export const buildGlobeCountries = () => globeData().countries
