import { buildGlobeCountries } from "@/lib/globe-dots"

// Built once at build time and served as a static file; only fetched when the globe is expanded
export const dynamic = "force-static"

export const GET = () =>
  Response.json(buildGlobeCountries(), {
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  })
