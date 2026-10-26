// Hero globe settings shared by the server (lib/globe-dots.ts builds the dot data) and the
// browser (components/shared/InteractiveGlobe.tsx draws it). Kept free of heavy imports so
// the client bundle only pulls in these few numbers.

export type LonLat = [number, number]

// Home base: routes fly out from here, and its country's dots are drawn brighter
export const GLOBE_HOME = {
  name: "Jashore",
  label: "Jashore, Bangladesh",
  note: "Home base. Every line on this globe starts here",
  coords: [89.21, 23.17] as LonLat,
  countryId: "050",
}

// A route can pass through waypoints. Each leg is drawn as a great circle, so `via` bends
// a route away from its shortest path. `label` is shown when the city's dot is clicked,
// with the optional `note` on a second line under it.
export interface GlobeRoute {
  to: LonLat
  label: string
  note?: string
  via?: LonLat[]
}

// The shortest path from Bangladesh to North America runs over the Arctic. These
// waypoints send it west instead: over North Africa, then across the Atlantic.
const WESTWARD: LonLat[] = [
  [20, 32], // Libyan coast
  [-35, 35], // mid-Atlantic
]

export const GLOBE_ROUTES: GlobeRoute[] = [
  { to: [55.27, 25.2], label: "Dubai, United Arab Emirates", note: "Where Scouty is planning its next office" },
  {
    to: [103.82, 1.35],
    label: "Singapore",
    note: "Built RealEzy, a Singapore real estate platform for apartment bookings",
  },
  { to: [139.69, 35.69], label: "Tokyo, Japan", note: "Top of my travel list. Anime and a bullet train ride" },
  {
    to: [151.21, -33.87],
    label: "Sydney, Australia",
    note: "Worked with Watchflix as a Web Application Developer, 2020 to 2021",
  },
  { to: [-0.13, 51.51], label: "London, United Kingdom", note: "Where half my favourite tech talks come from" },
  {
    to: [4.48, 51.92],
    label: "Rotterdam, Netherlands",
    note: "Worked with Dream Diver as a Web & Apps Developer, 2020 to 2021",
  },
  {
    to: [-123.12, 49.28],
    label: "Vancouver, Canada",
    note: "Working with Scouty Interactive as a Senior Software Developer since 2022",
    via: WESTWARD,
  },
  {
    // Southern California (Los Angeles area), near Baker's Drive-Thru in the Inland Empire
    to: [-118.24, 34.05],
    label: "California, USA",
    note: "Worked on Hang, a party invite app, and Baker's Drive-Thru, a Southern California fast-food chain",
    via: WESTWARD,
  },
  {
    to: [-95.37, 29.76],
    label: "Houston, USA",
    note: "Working on Mockingbird, a video surveillance monitoring website",
    via: WESTWARD,
  },
  {
    to: [-96.8, 32.78],
    label: "Dallas, USA",
    note: "Built the website for Mackenzie Haubner, an independent country singer-songwriter",
    via: WESTWARD,
  },
]

// Starts slightly west and south of home, so home sits just right of centre
export const GLOBE_INITIAL_CENTER: LonLat = [GLOBE_HOME.coords[0] - 10, GLOBE_HOME.coords[1] - 5]

// Where the browser fetches the dot data (served by app/globe-dots/route.ts)
export const GLOBE_DOTS_URL = "/globe-dots"

// Country of each dot, for the click-to-identify label (served by app/globe-countries/route.ts).
// JSON { names: string[], ids: number[] }: ids[i] indexes names for dot i, in the same order
// as /globe-dots (land dots, then home dots); -1 where a dot matches no country.
export const GLOBE_COUNTRIES_URL = "/globe-countries"

// Dot coordinates are stored as tenths of a degree in an Int16Array:
// [landCount, homeCount, lon, lat, lon, lat, ...land, ...home]
export const GLOBE_DOTS_SCALE = 10
