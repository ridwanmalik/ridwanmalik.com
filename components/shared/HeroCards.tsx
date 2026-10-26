import { siJavascript, siLaravel, siNextdotjs, siNodedotjs, siReact, siWordpress } from "simple-icons"
import GlassCard from "@/components/shared/GlassCard"
import StatusCard from "@/components/shared/StatusCard"

// Local constants - decorative cards floating around the hero photo
const STACK_ICONS = [
  { icon: siReact, color: "#61DAFB" },
  { icon: siJavascript, color: "#F7DF1E" },
  { icon: siNextdotjs, color: "#ccd6f6" },
  { icon: siNodedotjs, color: "#5FA04E" },
  { icon: siLaravel, color: "#FF2D20" },
  { icon: siWordpress, color: "#7aa7d6" },
]

const TERMINAL = {
  title: "ridwan — zsh",
  prompt: "ridwan@portfolio:~$",
  command: "yarn dev",
  output: ["$ next dev", "", "▲ Next.js 16"],
  urls: [
    { label: "- Local:", value: "http://localhost:3000" },
    { label: "- Network:", value: "http://192.168.0.10:3000" },
  ],
  ready: "✓ Ready in 1.2s",
}

// The glass itself comes from GlassCard; this adds placement and the slow drift
const CARD_BASE = "absolute shadow-2xl motion-safe:animate-float"

// macOS traffic-light colors: close, minimise, zoom
const TRAFFIC_LIGHTS = ["#FF5F57", "#FEBC2E", "#28C840"]

const WindowHeader = ({ title }: { title?: string }) => (
  <div className="relative flex items-center h-8 px-3 border-b border-white/10">
    <div className="flex gap-1.5">
      {TRAFFIC_LIGHTS.map(color => (
        <span key={color} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      ))}
    </div>
    {title && (
      <span className="absolute inset-x-0 text-center font-mono text-[11px] text-custom-secondary">{title}</span>
    )}
  </div>
)

const HeroCards = () => (
  <div aria-hidden="true" className="select-none">
    {/* Neck height, tucked against the left of the photo */}
    <StatusCard className={`${CARD_BASE} top-[29%] right-[76%] hidden xl:block`} style={{ animationDelay: "-1s" }} />

    {/* Head height, just right of the photo */}
    <GlassCard className={`${CARD_BASE} top-[19%] -right-24 hidden xl:block w-60`} style={{ animationDelay: "-2s" }}>
      <WindowHeader />
      <div className="grid grid-cols-3 gap-5 px-6 py-5">
        {STACK_ICONS.map(({ icon, color }) => (
          <svg
            key={icon.slug}
            viewBox="0 0 24 24"
            className="w-9 h-9 mx-auto"
            fill={color}
            role="img"
            aria-label={icon.title}>
            <path d={icon.path} />
          </svg>
        ))}
      </div>
    </GlassCard>

    <GlassCard
      className={`${CARD_BASE} bottom-[4%] right-[65%] hidden xl:block xl:w-80 2xl:w-96 font-mono text-xs leading-6`}
      style={{ animationDelay: "-4s" }}>
      <WindowHeader title={TERMINAL.title} />
      <div className="p-5 whitespace-nowrap overflow-hidden">
        <p>
          <span className="text-custom-accent">{TERMINAL.prompt}</span>{" "}
          <span className="text-custom-foreground">{TERMINAL.command}</span>
        </p>
        {TERMINAL.output.map((line, i) => (
          <p key={i} className="text-custom-secondary">
            {line || " "}
          </p>
        ))}
        {TERMINAL.urls.map(({ label, value }) => (
          <p key={label} className="pl-2 text-custom-secondary">
            <span className="text-custom-foreground/80">{label}</span> {value}
          </p>
        ))}
        <p className="text-custom-accent">
          {TERMINAL.ready}
          <span className="inline-block w-2 h-3.5 ml-1 align-middle bg-custom-accent motion-safe:animate-blink" />
        </p>
      </div>
    </GlassCard>
  </div>
)

export default HeroCards
