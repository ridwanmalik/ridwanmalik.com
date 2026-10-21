/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer must load from node_modules at runtime (not be bundled),
  // otherwise Next's server bundling gives its reconciler a mismatched React instance.
  serverExternalPackages: ["@react-pdf/renderer"],
  // Lets phones on the local Wi-Fi load dev assets (e.g. http://192.168.10.29:3001)
  allowedDevOrigins: ["192.168.*.*"],
}

module.exports = nextConfig
