import { buildGlobeDots } from "@/lib/globe-dots"

// Built once at build time and served as a static file, so the work never runs per request
export const dynamic = "force-static"

export const GET = () =>
  new Response(buildGlobeDots().buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
